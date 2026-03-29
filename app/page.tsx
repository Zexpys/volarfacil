'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIRPORTS } from '@/lib/mockData'
import { useLanguage } from '@/contexts/LanguageContext'

const US_AIRPORTS = AIRPORTS.filter(a => a.country === 'US')
const MX_AIRPORTS = AIRPORTS.filter(a => a.country === 'MX')

const POPULAR_ROUTES = [
  { from: 'OAK', to: 'MLM', es: 'Oakland → Morelia', en: 'Oakland → Morelia' },
  { from: 'LAX', to: 'GDL', es: 'Los Ángeles → Guadalajara', en: 'Los Angeles → Guadalajara' },
  { from: 'OAK', to: 'MEX', es: 'Oakland → Ciudad de México', en: 'Oakland → Mexico City' },
  { from: 'SFO', to: 'MTY', es: 'San Francisco → Monterrey', en: 'San Francisco → Monterrey' },
  { from: 'LAX', to: 'CUN', es: 'Los Ángeles → Cancún', en: 'Los Angeles → Cancun' },
  { from: 'SMF', to: 'MLM', es: 'Sacramento → Morelia', en: 'Sacramento → Morelia' },
  { from: 'SJC', to: 'GDL', es: 'San Jose → Guadalajara', en: 'San Jose → Guadalajara' },
  { from: 'LAX', to: 'MEX', es: 'Los Ángeles → Ciudad de México', en: 'Los Angeles → Mexico City' },
]

export default function Home() {
  const router = useRouter()
  const { lang, t } = useLanguage()
  const h = t.home
  const c = t.common
  const [origin, setOrigin] = useState('OAK')
  const [destination, setDestination] = useState('MLM')
  const [date, setDate] = useState('')
  const today = new Date().toISOString().split('T')[0]

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ origin, destination })
    if (date) params.set('date', date)
    router.push(`/search?${params.toString()}`)
  }

  function swap() {
    setOrigin(destination)
    setDestination(origin)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-gray-950 to-gray-950 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-900/30 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-green-950 border border-green-800/50 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {h.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {h.h1a}<br />
            <span className="text-green-400">{h.h1b}</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">{h.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl transition-colors text-lg">
              {h.ctaSearch}
            </Link>
            <Link href="/pricing" className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl transition-colors text-lg">
              {h.ctaPricing}
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-4">{h.noCard}</p>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="max-w-4xl mx-auto px-4 -mt-4 mb-8">
        <form onSubmit={handleQuickSearch} className="bg-gray-900 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{h.from}</label>
              <select value={origin} onChange={e => setOrigin(e.target.value)} className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                <optgroup label={c.usaGroup}>{US_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
                <optgroup label={c.mxGroup}>{MX_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{h.to}</label>
              <div className="relative flex items-center gap-2">
                <select value={destination} onChange={e => setDestination(e.target.value)} className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 flex-1 w-full">
                  <optgroup label={c.usaGroup}>{US_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
                  <optgroup label={c.mxGroup}>{MX_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
                </select>
                <button type="button" onClick={swap} className="absolute -left-5 top-1/2 -translate-y-1/2 hidden md:flex bg-gray-700 border border-white/10 rounded-full p-1 hover:bg-gray-600 transition-colors z-10">
                  <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{h.date}</label>
              <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
            </div>
            <button type="submit" className="flex items-center justify-center bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors md:mt-5 py-3 md:py-2.5">
              {h.searchBtn}
            </button>
          </div>
          <button type="button" onClick={swap} className="md:hidden mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {h.swapBtn}
          </button>
        </form>
      </section>

      {/* Popular Routes */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-3">{h.popularRoutes}</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.map(r => (
            <button
              key={`${r.from}-${r.to}`}
              onClick={() => router.push(`/search?origin=${r.from}&destination=${r.to}`)}
              className="bg-gray-900 border border-white/10 hover:border-green-800/50 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-colors"
            >
              {lang === 'es' ? r.es : r.en}
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-12 mb-4">
        <h2 className="text-2xl font-bold text-center mb-2">{h.howTitle}</h2>
        <p className="text-gray-400 text-center text-sm mb-10">{h.howSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['1','2','3'] as const).map((n, i) => (
            <div key={n} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-950 border border-green-800/50 flex items-center justify-center text-green-400 font-bold text-lg mb-4">{n}</div>
              <div className="text-2xl mb-3">{['🔍','🔔','✈️'][i]}</div>
              <h3 className="font-semibold text-white mb-2">{h.steps[i].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{h.steps[i].desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">{h.featuresTitle}</h2>
        <p className="text-gray-400 text-center mb-12">{h.featuresSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {h.features.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-white/10 rounded-xl p-6 hover:border-green-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{['🔔','📅','⚡','🗺️','💰','📊'][i]}</span>
                {f.badge && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.badge === 'Premium' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800/50' : 'bg-green-950 text-green-400 border border-green-800/50'}`}>
                    {f.badge}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-green-950 to-gray-900 border border-green-800/30 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-3">{h.ctaTitle}</h2>
          <p className="text-gray-400 mb-8">{h.ctaSubtitle}</p>
          <Link href="/pricing" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl transition-colors text-lg inline-block">
            {h.ctaBtn}
          </Link>
        </div>
      </section>
    </div>
  )
}
