import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, REFERRAL_REWARD_CENTS, MAX_CREDIT_BALANCE_CENTS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'charge.dispute.created':
        await handleDispute(event.data.object as Stripe.Dispute)
        break
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge)
        break
    }
  } catch (err) {
    console.error(`Webhook handler error (${event.type}):`, err)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const introOffer = session.metadata?.intro_offer
  const referrerId = session.metadata?.referrer_id
  const subscriptionId = session.subscription as string
  if (!userId || !subscriptionId) return

  const sub = await stripe.subscriptions.retrieve(subscriptionId)

  await supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: sub.customer as string,
    status: sub.status,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    intro_offer: introOffer || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'stripe_subscription_id' })

  if (introOffer === 'referral' && referrerId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles').select('email').eq('id', userId).single()
    await supabaseAdmin.from('referrals').upsert({
      referrer_id: referrerId,
      referee_id: userId,
      referee_email: profile?.email ?? '',
      status: 'converted',
      stripe_discount_applied: true,
    }, { onConflict: 'referee_id' })
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const sub = await stripe.subscriptions.retrieve(subscriptionId)
  await supabaseAdmin.from('subscriptions').update({
    status: sub.status,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', subscriptionId)

  // Issue referral reward only on first successful payment
  if (invoice.billing_reason !== 'subscription_create') return

  const userId = sub.metadata?.user_id
  if (!userId) return

  const { data: referral } = await supabaseAdmin
    .from('referrals').select('id, referrer_id, status')
    .eq('referee_id', userId).eq('status', 'converted').maybeSingle()
  if (!referral?.referrer_id) return

  // Check credit cap
  const { data: creditRows } = await supabaseAdmin
    .from('credits').select('amount_cents').eq('user_id', referral.referrer_id)
  const balance = (creditRows ?? []).reduce((sum: number, r: any) => sum + r.amount_cents, 0)
  if (balance >= MAX_CREDIT_BALANCE_CENTS) return

  const { data: referrerProfile } = await supabaseAdmin
    .from('profiles').select('stripe_customer_id').eq('id', referral.referrer_id).single()
  if (!referrerProfile?.stripe_customer_id) return

  // Add $10 to referrer's Stripe balance (negative = credit)
  const balanceTxn = await stripe.customers.createBalanceTransaction(
    referrerProfile.stripe_customer_id,
    { amount: -REFERRAL_REWARD_CENTS, currency: 'usd', description: 'Referral reward' }
  )

  await supabaseAdmin.from('credits').insert({
    user_id: referral.referrer_id,
    amount_cents: REFERRAL_REWARD_CENTS,
    reason: 'referral_reward',
    referral_id: referral.id,
    stripe_balance_txn_id: balanceTxn.id,
  })

  await supabaseAdmin.from('referrals').update({
    status: 'rewarded',
    reward_issued_at: new Date().toISOString(),
  }).eq('id', referral.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return
  await supabaseAdmin.from('subscriptions').update({
    status: 'past_due', updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', subscriptionId)

  if (invoice.billing_reason === 'subscription_create') {
    const sub = await stripe.subscriptions.retrieve(subscriptionId)
    const userId = sub.metadata?.user_id
    if (userId) {
      await supabaseAdmin.from('referrals').update({
        status: 'voided', voided_reason: 'failed_first_payment',
      }).eq('referee_id', userId).eq('status', 'converted')
    }
  }
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  await supabaseAdmin.from('subscriptions').update({
    status: sub.status,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', sub.id)
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await supabaseAdmin.from('subscriptions').update({
    status: 'canceled', cancel_at_period_end: false, updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', sub.id)
}

async function handleDispute(dispute: Stripe.Dispute) {
  const charge = await stripe.charges.retrieve(dispute.charge as string)
  const customerId = charge.customer as string
  if (!customerId) return
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id').eq('stripe_customer_id', customerId).maybeSingle()
  if (!profile) return
  await supabaseAdmin.from('referrals').update({
    status: 'voided', voided_reason: 'dispute',
  }).eq('referee_id', profile.id).eq('status', 'converted')
}

async function handleRefund(charge: Stripe.Charge) {
  const customerId = charge.customer as string
  if (!customerId) return
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id').eq('stripe_customer_id', customerId).maybeSingle()
  if (!profile) return
  await supabaseAdmin.from('referrals').update({
    status: 'voided', voided_reason: 'refund',
  }).eq('referee_id', profile.id).eq('status', 'converted')
}
