import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin, getUserFromToken } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUserFromToken(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
  })

  return NextResponse.json({ url: session.url })
}
