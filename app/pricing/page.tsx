'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import CheckoutButton from '@/components/CheckoutButton'

const PRICES = ['$0', '$10', '$20']

function PricingContent() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const p = t.pricing
  const params = useSearchParams()
  const [refCode, setRefCode] = useState<string | null>(null)

  useEffect(() => {
    // Check URL first, then localStorage
    const urlRef = params.get('ref')
    const storedRef = typeof window !== 'undefined' ? localStorage.getItem('vf_ref') : null
    const code = urlRef || storedRef || null
    if (code) setRefCode(code)
  }, [params])

  const hasReferral = !!refCode
  const periods = [p.forever, p.monthly, p.monthly]

  const planFeatures = [
    { features: p.features.free, missing: p.features.freeMissing, highlight: false, badge: null, coming: false },
    { features: p.features.pro, missing: p.features.proMissing, highlight: true, badge: null, coming: false },
    { features: p.features.auto, missing: [] as string[], highlight: false, badge: p.comingSoon, coming: true },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{p.title}</h1>
        <p className="text-gray-400 text-lg">{p.subtitle}</p>
      </div>

      {/* Referral banner */}
      {hasReferral && (
        <div className="bg-green-950 border border-green-700/50 rounded-xl p-4 mb-8 text-center">
          <p className="text-green-300 font-semibold text-sm">
            🎉 {lang === 'es' ? 'Tienes una oferta especial: 50% de descuento en tu primer mes' : "You have a referral offer: 50% off your first month"}
          </p>
          <p className="text-green-600 text-xs mt-1">
            {lang === 'es'
              ? 'Aplica al suscribirte al plan Pro abajo'
              : 'Applied when you subscribe to Pro below'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {p.plans.map((plan, i) => (
          <div key={plan.name} className={`rounded-2xl p-6 flex flex-col relative ${
            planFeatures[i].highlight
              ? 'bg-gradient-to-b from-green-950/80 to-gray-900 border border-green-700/50 shadow-lg shadow-green-950/30'
              : 'bg-gray-900 border border-white/10'
          }`}>
            {planFeatures[i].highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">{p.mostPopular}</span>
              </div>
            )}
            {planFeatures[i].badge && !planFeatures[i].highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">{planFeatures[i].badge}</span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-300 mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-1">
                {i === 1 && hasReferral ? (
                  <>
                    <span className="text-2xl font-bold text-white">$5</span>
                    <span className="text-gray-600 line-through text-sm mb-1">$10</span>
                    <span className="text-gray-500 text-sm mb-1">/{p.monthly}</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">{PRICES[i]}</span>
                    <span className="text-gray-500 text-sm mb-1">/{periods[i]}</span>
                  </>
                )}
              </div>
              <p className="text-gray-500 text-sm">{plan.desc}</p>
              {i === 1 && hasReferral && (
                <p className="text-green-400 text-xs mt-1 font-medium">
                  {lang === 'es' ? '→ $10/mes después del primer mes' : '→ $10/mo after first month'}
                </p>
              )}
            </div>

            {/* CTA */}
            {i === 0 && (
              <Link href="/signup"
                className="block text-center font-bold py-2.5 rounded-lg mb-6 transition-colors text-sm bg-gray-800 hover:bg-gray-700 text-white border border-white/10">
                {plan.cta}
              </Link>
            )}
            {i === 1 && !planFeatures[i].coming && (
              <CheckoutButton
                introOffer={hasReferral ? 'referral' : 'trial'}
                refCode={refCode ?? undefined}
                className="block w-full text-center font-bold py-2.5 rounded-lg mb-6 transition-colors text-sm bg-green-500 hover:bg-green-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasReferral
                  ? (lang === 'es' ? 'Obtener 50% de descuento →' : 'Claim 50% off →')
                  : (lang === 'es' ? 'Empezar prueba de 3 días →' : 'Start 3-day free trial →')}
              </CheckoutButton>
            )}
            {i === 2 && (
              <button disabled
                className="block w-full text-center font-bold py-2.5 rounded-lg mb-6 text-sm bg-gray-800 text-gray-600 border border-white/10 cursor-not-allowed">
                {lang === 'es' ? 'Próximamente' : 'Coming soon'}
              </button>
            )}

            {/* Trial / referral notice */}
            {i === 1 && !planFeatures[i].coming && (
              <p className="text-xs text-gray-600 text-center -mt-4 mb-4">
                {hasReferral
                  ? (lang === 'es' ? 'Sin periodo de prueba · Pago hoy de $5' : 'No trial · Charged $5 today')
                  : (lang === 'es' ? '3 días gratis · Se requiere tarjeta · Cancela antes si no quieres pagar' : '3 days free · Card required · Cancel before charge')}
              </p>
            )}

            <div className="flex-1">
              <ul className="space-y-2.5">
                {planFeatures[i].features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {planFeatures[i].missing.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-10">{p.faqTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {p.faq.map(({ q, a }) => (
            <div key={q} className="bg-gray-900 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2 text-sm">{q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral terms snippet */}
      <p className="text-center text-xs text-gray-700 mt-12 max-w-2xl mx-auto leading-relaxed">
        {lang === 'es'
          ? 'Las ofertas de introducción (prueba de 3 días y 50% de descuento) son para clientes nuevos y no se pueden combinar. El crédito de referido ($10) se aplica cuando el referido completa su primer pago exitoso. Máximo $30 en créditos acumulados. Los créditos no tienen valor en efectivo y no son transferibles.'
          : 'Intro offers (3-day trial and 50% off first month) are for new customers only and cannot be combined. Referral credit ($10) is issued when the referred customer completes their first successful payment. Maximum $30 in accumulated credits. Credits have no cash value and are non-transferable.'}
      </p>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-16 text-gray-400">Loading...</div>}>
      <PricingContent />
    </Suspense>
  )
}
