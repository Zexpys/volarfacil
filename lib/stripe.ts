import Stripe from 'stripe'

// Server-side Stripe client — never import this in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

// Stripe IDs — set these as Vercel environment variables after Stripe setup
export const STRIPE_PRICE_PRO = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!
export const STRIPE_COUPON_REFERRAL_50 = process.env.STRIPE_COUPON_REFERRAL_50!

// Trial length for standard signups
export const TRIAL_DAYS = 3

// Referral reward amount in cents
export const REFERRAL_REWARD_CENTS = 1000 // $10

// Maximum referral credits a user can hold at once (3 months)
export const MAX_CREDIT_BALANCE_CENTS = 3000 // $30
