'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

type AccountData = {
  profile: { email: string; referralCode: string; referralLink: string }
  subscription: {
    status: string
    trial_end: string | null
    current_period_end: string | null
    cancel_at_period_end: boolean
    intro_offer: string | null
  }
  credits: { balanceCents: number; totalEarnedCents: number }
  referrals: {
    total: number; rewarded: number; converted: number; pending: number
    list: { id: string; referee_email: string; status: string; created_at: string }[]
  }
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(iso: string | null) {
  if (!iso) return null
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  active:     { text: 'Active', color: 'text-green-400' },
  trialing:   { text: 'Trial', color: 'text-yellow-400' },
  past_due:   { text: 'Past due', color: 'text-red-400' },
  canceled:   { text: 'Canceled', color: 'text-gray-500' },
  incomplete: { text: 'Incomplete', color: 'text-orange-400' },
  none:       { text: 'Free', color: 'text-gray-400' },
}

const REFERRAL_STATUS: Record<string, string> = {
  pending: 'Signed up',
  converted: 'Subscribed',
  rewarded: 'Reward earned ✓',
  voided: 'Voided',
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { lang } = useLanguage()
  const [data, setData] = useState<AccountData | null>(null)
  const [copied, setCopied] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutSuccess] = useState(
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('checkout') === 'success'
  )

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/account', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      if (res.ok) setData(await res.json())
    }
    load()
  }, [user])

  async function openPortal() {
    setPortalLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setPortalLoading(false)
  }

  function copyLink() {
    if (!data?.profile.referralLink) return
    navigator.clipboard.writeText(data.profile.referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (authLoading || !user) return null

  const sub = data?.subscription
  const statusInfo = STATUS_LABELS[sub?.status ?? 'none'] ?? STATUS_LABELS.none
  const trialDays = daysUntil(sub?.trial_end ?? null)
  const isPro = sub && ['active', 'trialing', 'past_due'].includes(sub.status)
  const creditsBalance = data?.credits.balanceCents ?? 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">{lang === 'es' ? 'Mi cuenta' : 'My account'}</h1>

      {checkoutSuccess && (
        <div className="bg-green-950 border border-green-800/50 rounded-xl p-4 mb-6 text-green-300 text-sm">
          ✓ {lang === 'es' ? '¡Suscripción activada! Bienvenido a Pro.' : 'Subscription activated! Welcome to Pro.'}
        </div>
      )}

      {/* Plan */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
          {lang === 'es' ? 'Tu plan' : 'Your plan'}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-white">{isPro ? 'Pro' : 'Free'}</span>
              <span className={`text-sm font-medium ${statusInfo.color}`}>· {statusInfo.text}</span>
            </div>
            {sub?.status === 'trialing' && trialDays !== null && (
              <p className="text-sm text-yellow-400">
                {lang === 'es'
                  ? `Tu prueba termina en ${trialDays} día${trialDays !== 1 ? 's' : ''} — ${formatDate(sub.trial_end)}`
                  : `Trial ends in ${trialDays} day${trialDays !== 1 ? 's' : ''} — ${formatDate(sub.trial_end)}`}
              </p>
            )}
            {sub?.status === 'active' && sub.current_period_end && (
              <p className="text-sm text-gray-400">
                {sub.cancel_at_period_end
                  ? (lang === 'es' ? `Cancela el ${formatDate(sub.current_period_end)}` : `Cancels ${formatDate(sub.current_period_end)}`)
                  : (lang === 'es' ? `Próximo cobro: ${formatDate(sub.current_period_end)}` : `Next billing: ${formatDate(sub.current_period_end)}`)}
              </p>
            )}
            {sub?.status === 'past_due' && (
              <p className="text-sm text-red-400">
                {lang === 'es' ? 'Pago fallido — actualiza tu método de pago' : 'Payment failed — update your payment method'}
              </p>
            )}
            {(!isPro) && (
              <p className="text-sm text-gray-500">
                {lang === 'es' ? '5 búsquedas al día · Sin alertas' : '5 searches/day · No alerts'}
              </p>
            )}
          </div>
          {isPro ? (
            <button onClick={openPortal} disabled={portalLoading}
              className="text-sm bg-gray-800 hover:bg-gray-700 border border-white/10 text-gray-300 px-4 py-2 rounded-lg transition-colors">
              {portalLoading ? '...' : (lang === 'es' ? 'Gestionar suscripción →' : 'Manage billing →')}
            </button>
          ) : (
            <Link href="/pricing"
              className="text-sm bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg transition-colors">
              {lang === 'es' ? 'Pasarse a Pro →' : 'Upgrade to Pro →'}
            </Link>
          )}
        </div>
      </div>

      {/* Credits */}
      {creditsBalance > 0 && (
        <div className="bg-yellow-950/50 border border-yellow-800/30 rounded-2xl p-6 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            {lang === 'es' ? 'Créditos disponibles' : 'Account credits'}
          </p>
          <p className="text-2xl font-bold text-yellow-400">${(creditsBalance / 100).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'es'
              ? 'Se aplican automáticamente a tu próximo cobro'
              : 'Applied automatically to your next invoice'}
          </p>
        </div>
      )}

      {/* Referral */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
          {lang === 'es' ? 'Tu link de referido' : 'Your referral link'}
        </p>

        {data?.profile.referralLink ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <code className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-green-400 truncate">
                {data.profile.referralLink}
              </code>
              <button onClick={copyLink}
                className="shrink-0 bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                {copied ? '✓' : (lang === 'es' ? 'Copiar' : 'Copy')}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              {[
                { label: lang === 'es' ? 'Se registraron' : 'Signed up', value: data.referrals.total },
                { label: lang === 'es' ? 'Pagaron' : 'Converted', value: data.referrals.rewarded },
                { label: lang === 'es' ? 'Ganado' : 'Earned', value: `$${(data.credits.totalEarnedCents / 100).toFixed(0)}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600">
              {lang === 'es'
                ? 'Ganas $10 de crédito cuando tu referido completa su primer pago. Máximo 3 meses de crédito.'
                : 'Earn $10 credit when your referral completes their first payment. Max 3 months credit.'}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">{lang === 'es' ? 'Cargando...' : 'Loading...'}</p>
        )}
      </div>

      {/* Referral history */}
      {(data?.referrals.list.length ?? 0) > 0 && (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
            {lang === 'es' ? 'Historial de referidos' : 'Referral history'}
          </p>
          <div className="space-y-2">
            {data!.referrals.list.map(r => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{r.referee_email}</span>
                <span className={`text-xs ${r.status === 'rewarded' ? 'text-green-400' : r.status === 'voided' ? 'text-gray-600' : 'text-yellow-400'}`}>
                  {REFERRAL_STATUS[r.status] ?? r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
