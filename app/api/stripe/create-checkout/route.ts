import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_PRO, STRIPE_COUPON_REFERRAL_50, TRIAL_DAYS } from '@/lib/stripe'
import { supabaseAdmin, getUserFromToken } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  // 1. Auth
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUserFromToken(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Parse body
  const { introOffer, refCode } = await request.json() as {
    introOffer: 'trial' | 'referral'
    refCode?: string
  }

  // 3. Block if already subscribed
  const { data: existing } = await supabaseAdmin
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing', 'past_due'])
    .maybeSingle()
  if (existing) return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })

  // 4. Get or create Stripe customer
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id, referral_code')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  // 5. Validate referral offer — prevent self-referral & invalid codes
  let finalOffer = introOffer
  let referrerId: string | null = null
  let validatedRefCode: string | null = null

  if (introOffer === 'referral' && refCode) {
    // Self-referral check
    if (refCode === profile?.referral_code) {
      finalOffer = 'trial' // silently fall back — no error shown to prevent probing
    } else {
      const { data: referrer } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('referral_code', refCode.toUpperCase())
        .maybeSingle()

      if (referrer) {
        referrerId = referrer.id
        validatedRefCode = refCode.toUpperCase()
      } else {
        finalOffer = 'trial' // invalid code, fall back
      }
    }
  }

  // 6. Build Stripe checkout session
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICE_PRO, quantity: 1 }],
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/pricing`,
    // Attach metadata so webhook knows context
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
    // Card required upfront + 3-day free trial
    sessionParams.payment_method_collection = 'always'
    sessionParams.subscription_data!.trial_period_days = TRIAL_DAYS
  } else if (finalOffer === 'referral' && validatedRefCode) {
    // 50% off first month coupon (no trial — these are mutually exclusive)
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
