import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, STRIPE_PRICE_PRO, STRIPE_COUPON_REFERRAL_50, TRIAL_DAYS } from '@/lib/stripe'
import { supabaseAdmin, getUserFromToken } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  // Auth
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUserFromToken(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { introOffer, refCode } = body

  // Runtime validation — TypeScript types are not enforced at runtime
  if (!['trial', 'referral'].includes(introOffer)) {
    return NextResponse.json({ error: 'Invalid intro offer' }, { status: 400 })
  }
  if (refCode !== undefined && (typeof refCode !== 'string' || refCode.length > 20 || !/^[A-Za-z0-9]+$/.test(refCode))) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  }

  // Block if already subscribed
  const { data: existing } = await supabaseAdmin
    .from('subscriptions').select('status').eq('user_id', user.id)
    .in('status', ['active', 'trialing', 'past_due']).maybeSingle()
  if (existing) return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })

  // Get or create Stripe customer
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('stripe_customer_id, referral_code').eq('id', user.id).single()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!, metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabaseAdmin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  // Validate referral — prevent self-referral, invalid codes, and already-referred users
  let finalOffer: 'trial' | 'referral' = introOffer
  let referrerId: string | null = null
  let validatedRefCode: string | null = null

  if (introOffer === 'referral' && refCode) {
    const normalizedCode = refCode.toUpperCase()

    // Self-referral check
    if (normalizedCode === profile?.referral_code) {
      finalOffer = 'trial'
    } else {
      // Check if user was already referred
      const { data: alreadyReferred } = await supabaseAdmin
        .from('referrals').select('id').eq('referee_id', user.id).maybeSingle()
      if (alreadyReferred) {
        finalOffer = 'trial' // already has a referral, fall back
      } else {
        const { data: referrer } = await supabaseAdmin
          .from('profiles').select('id').eq('referral_code', normalizedCode).maybeSingle()
        if (referrer) {
          referrerId = referrer.id
          validatedRefCode = normalizedCode
        } else {
          finalOffer = 'trial' // invalid code
        }
      }
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICE_PRO, quantity: 1 }],
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/pricing`,
    metadata: {
      user_id: user.id,
      intro_offer: finalOffer,
      referrer_id: referrerId ?? '',
      ref_code: validatedRefCode ?? '',
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        intro_offer: finalOffer,
        referrer_id: referrerId ?? '',
        ref_code: validatedRefCode ?? '',
      },
    },
  }

  if (finalOffer === 'trial') {
    sessionParams.payment_method_collection = 'always'
    sessionParams.subscription_data!.trial_period_days = TRIAL_DAYS
  } else if (finalOffer === 'referral' && validatedRefCode) {
    sessionParams.discounts = [{ coupon: STRIPE_COUPON_REFERRAL_50 }]
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
