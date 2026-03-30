import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, REFERRAL_REWARD_CENTS, MAX_CREDIT_BALANCE_CENTS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  // Validate webhook secret is configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
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
    // Return 500 so Stripe retries — only for non-idempotent operations
    // For idempotent handlers this is safe; we guard against double-processing inside each handler
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
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
    // upsert with onConflict to handle duplicate webhook delivery
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

  // Only issue referral reward on the first successful payment
  if (invoice.billing_reason !== 'subscription_create') return

  const userId = sub.metadata?.user_id
  if (!userId) return

  const { data: referral } = await supabaseAdmin
    .from('referrals').select('id, referrer_id, status, reward_issued_at')
    .eq('referee_id', userId).eq('status', 'converted').maybeSingle()

  if (!referral?.referrer_id) return

  // IDEMPOTENCY: bail out if reward was already issued (handles duplicate webhook delivery)
  if (referral.reward_issued_at) return

  // Check for existing credit record (secondary idempotency check)
  const { data: existingCredit } = await supabaseAdmin
    .from('credits').select('id').eq('referral_id', referral.id)
    .eq('reason', 'referral_reward').maybeSingle()
  if (existingCredit) return

  // Check credit cap ($30 max)
  const { data: creditRows } = await supabaseAdmin
    .from('credits').select('amount_cents').eq('user_id', referral.referrer_id)
  const balance = (creditRows ?? []).reduce((sum: number, r: any) => sum + r.amount_cents, 0)
  if (balance >= MAX_CREDIT_BALANCE_CENTS) return

  const { data: referrerProfile } = await supabaseAdmin
    .from('profiles').select('stripe_customer_id').eq('id', referral.referrer_id).single()
  if (!referrerProfile?.stripe_customer_id) return

  // Apply $10 credit to referrer's Stripe balance — wrap separately so DB record is only created if Stripe succeeds
  let txnId: string
  try {
    const balanceTxn = await stripe.customers.createBalanceTransaction(
      referrerProfile.stripe_customer_id,
      { amount: -REFERRAL_REWARD_CENTS, currency: 'usd', description: 'Referral reward — friend subscribed' }
    )
    txnId = balanceTxn.id
  } catch (txnErr) {
    console.error('Failed to create Stripe balance transaction:', txnErr)
    return // Do not record credit if Stripe failed
  }

  await supabaseAdmin.from('credits').insert({
    user_id: referral.referrer_id,
    amount_cents: REFERRAL_REWARD_CENTS,
    reason: 'referral_reward',
    referral_id: referral.id,
    stripe_balance_txn_id: txnId,
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

// Shared helper: void referral and reverse any issued credit
async function voidReferral(customerId: string, reason: string) {
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id').eq('stripe_customer_id', customerId).maybeSingle()
  if (!profile) return

  const { data: referral } = await supabaseAdmin
    .from('referrals').select('id, referrer_id, status, reward_issued_at')
    .eq('referee_id', profile.id).maybeSingle()
  if (!referral) return

  // If reward was already issued, reverse the credit
  if (referral.reward_issued_at && referral.referrer_id) {
    const { data: referrerProfile } = await supabaseAdmin
      .from('profiles').select('stripe_customer_id').eq('id', referral.referrer_id).single()

    if (referrerProfile?.stripe_customer_id) {
      try {
        // Reverse the Stripe customer balance credit
        await stripe.customers.createBalanceTransaction(
          referrerProfile.stripe_customer_id,
          { amount: REFERRAL_REWARD_CENTS, currency: 'usd', description: `Referral credit reversed — ${reason}` }
        )
        // Record reversal in ledger
        await supabaseAdmin.from('credits').insert({
          user_id: referral.referrer_id,
          amount_cents: -REFERRAL_REWARD_CENTS,
          reason: 'referral_reward_reversal',
          referral_id: referral.id,
        })
      } catch (err) {
        console.error('Failed to reverse referral credit:', err)
      }
    }
  }

  // Void the referral if it's still in a voidable state
  if (['pending', 'converted', 'rewarded'].includes(referral.status)) {
    await supabaseAdmin.from('referrals').update({
      status: 'voided', voided_reason: reason,
    }).eq('id', referral.id)
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  const charge = await stripe.charges.retrieve(dispute.charge as string)
  if (charge.customer) await voidReferral(charge.customer as string, 'dispute')
}

async function handleRefund(charge: Stripe.Charge) {
  if (charge.customer) await voidReferral(charge.customer as string, 'refund')
}
