import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getUserFromToken } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUserFromToken(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // Fetch profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  // Fetch subscription
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('status, trial_end, current_period_end, cancel_at_period_end, intro_offer')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .maybeSingle()

  // Fetch credits balance + history
  const { data: creditRows } = await supabaseAdmin
    .from('credits')
    .select('id, amount_cents, reason, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const totalEarnedCents = (creditRows ?? [])
    .filter(c => c.reason === 'referral_reward')
    .reduce((sum, c) => sum + c.amount_cents, 0)

  const appliedCents = (creditRows ?? [])
    .filter(c => c.amount_cents < 0)
    .reduce((sum, c) => sum + Math.abs(c.amount_cents), 0)

  const balanceCents = totalEarnedCents - appliedCents

  // Fetch referrals made by this user
  const { data: referrals } = await supabaseAdmin
    .from('referrals')
    .select('id, referee_email, status, created_at')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  const maskedReferrals = (referrals ?? []).map(r => ({
    ...r,
    // Mask email for display: jo***@gmail.com
    referee_email: maskEmail(r.referee_email),
  }))

  return NextResponse.json({
    profile: {
      email: user.email,
      referralCode: profile?.referral_code ?? null,
      referralLink: profile?.referral_code
        ? `${siteUrl}/signup?ref=${profile.referral_code}`
        : null,
    },
    subscription: subscription ?? { status: 'none' },
    credits: {
      balanceCents,
      totalEarnedCents,
      history: creditRows ?? [],
    },
    referrals: {
      total: referrals?.length ?? 0,
      rewarded: referrals?.filter(r => r.status === 'rewarded').length ?? 0,
      converted: referrals?.filter(r => r.status === 'converted').length ?? 0,
      pending: referrals?.filter(r => r.status === 'pending').length ?? 0,
      list: maskedReferrals,
    },
  })
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const maskedLocal = local.slice(0, 2) + '***'
  const [domainName, tld] = domain.split('.')
  const maskedDomain = domainName.slice(0, 2) + '***' + (tld ? '.' + tld : '')
  return `${maskedLocal}@${maskedDomain}`
}
