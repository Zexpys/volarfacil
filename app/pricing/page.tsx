'use client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const PRICES = ['$0', '$7', '$15']

export default function PricingPage() {
  const { t } = useLanguage()
  const p = t.pricing

  const planFeatures = [
    { features: p.features.free, missing: p.features.freeMissing, highlight: false, badge: null },
    { features: p.features.pro, missing: p.features.proMissing, highlight: true, badge: null },
    { features: p.features.auto, missing: [] as string[], highlight: false, badge: p.comingSoon },
  ]
  const periods = [p.forever, p.monthly, p.monthly]

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{p.title}</h1>
        <p className="text-gray-400 text-lg">{p.subtitle}</p>
      </div>

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
            {planFeatures[i].badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">{planFeatures[i].badge}</span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-300 mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">{PRICES[i]}</span>
                <span className="text-gray-500 text-sm mb-1">/{periods[i]}</span>
              </div>
              <p className="text-gray-500 text-sm">{plan.desc}</p>
            </div>

            <Link
              href="/search"
              className={`block text-center font-bold py-2.5 rounded-lg mb-6 transition-colors text-sm ${
                planFeatures[i].highlight
                  ? 'bg-green-500 hover:bg-green-400 text-black'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-white/10'
              }`}
            >
              {plan.cta}
            </Link>

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
    </div>
  )
}
