'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AIRPORTS, getMockFlights, Flight } from '@/lib/mockData'
import { useLanguage } from '@/contexts/LanguageContext'

const US_AIRPORTS = AIRPORTS.filter(a => a.country === 'US')
const MX_AIRPORTS = AIRPORTS.filter(a => a.country === 'MX')

function SearchContent() {
  const params = useSearchParams()
  const { t } = useLanguage()
  const s = t.search
  const c = t.common
  const [origin, setOrigin] = useState(params.get('origin') || 'OAK')
  const [destination, setDestination] = useState(params.get('destination') || 'MLM')
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(params.get('date') || '')
  const [flights, setFlights] = useState<Flight[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    setTimeout(() => {
      setFlights(getMockFlights(origin, destination))
      setLoading(false)
    }, 800)
  }

  function swap() {
    setOrigin(destination)
    setDestination(origin)
  }

  const isInternational = AIRPORTS.find(a => a.code === origin)?.country === 'MX' || AIRPORTS.find(a => a.code === destination)?.country === 'MX'
  const originName = AIRPORTS.find(a => a.code === origin)?.name || origin
  const destName = AIRPORTS.find(a => a.code === destination)?.name || destination

  const selectClass = "bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{s.title}</h1>
      <p className="text-gray-400 mb-8 text-sm">{isInternational ? s.intlNote : s.domNote}</p>

      <form onSubmit={handleSearch} className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.from}</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} className={selectClass}>
              <optgroup label={c.usaGroup}>{US_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
              <optgroup label={c.mxGroup}>{MX_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
            </select>
          </div>

          <div className="flex justify-center">
            <button type="button" onClick={swap} className="bg-gray-800 border border-white/10 rounded-lg p-2.5 hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.to}</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} className={selectClass}>
              <optgroup label={c.usaGroup}>{US_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
              <optgroup label={c.mxGroup}>{MX_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}</optgroup>
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.date}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className={selectClass} min={today} />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <label className="flex items-center gap-2 bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 cursor-pointer flex-1">
              <input type="checkbox" className="accent-green-500" />
              <span className="text-sm text-gray-300">{s.roundTrip}</span>
            </label>
            <button type="submit" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-lg transition-colors flex-1 text-sm">
              {s.searchBtn}
            </button>
          </div>
        </div>
      </form>

      {/* Empty state */}
      {!searched && !loading && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">✈️</p>
          <p className="text-white font-semibold mb-2">{s.emptyTitle}</p>
          <p className="text-gray-500 text-sm">{s.emptySubtitle}</p>
          <div className="mt-8 inline-flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400">
            <span className="text-yellow-400">💡</span>
            {isInternational ? s.tipIntl : s.tipDom}
          </div>
        </div>
      )}

      {/* Alert Banner */}
      {searched && !loading && (
        <div className="bg-green-950 border border-green-800/50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start gap-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-green-400 mt-0.5">🔔</span>
            <div>
              <p className="text-green-300 font-medium text-sm">{s.alertTitle}</p>
              <p className="text-green-600 text-xs mt-0.5">{s.alertSubtitle} {originName} → {destName}.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-2 rounded-lg transition-colors">
            {s.alertBtn}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-gray-400">
            <svg className="animate-spin h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {isInternational ? s.intlNote : s.domNote}
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && flights && (
        <div>
          <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm">
            <span className="text-yellow-400">⏰</span>
            <p className="text-gray-400">
              {isInternational
                ? <><span className="text-white font-medium">{s.bookingIntl}</span> <span className="text-green-400">{s.bookingIntlSuffix}</span></>
                : <><span className="text-white font-medium">{s.bookingDom}</span> <span className="text-green-400">{s.bookingDomSuffix}</span></>}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-white">{flights.filter(f => f.available).length}</span> {s.available}
              <span className="text-gray-500 ml-2">· {origin} → {destination}</span>
            </p>
            <span className="text-xs text-gray-500">{s.sorted}</span>
          </div>

          <div className="flex flex-col gap-3">
            {flights.map(flight => (
              <div
                key={flight.id}
                className={`bg-gray-900 border rounded-xl p-5 transition-colors ${flight.available ? 'border-white/10 hover:border-green-800/50' : 'border-white/5 opacity-50'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-center min-w-[52px]">
                      <p className="text-lg sm:text-xl font-bold text-white">{flight.departure}</p>
                      <p className="text-xs text-gray-500">{origin}</p>
                    </div>
                    <div className="text-center text-gray-600 flex-1">
                      <p className="text-xs mb-1">{flight.duration}</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="w-6 sm:w-8 h-px bg-gray-700" />
                        <span className="text-xs">✈</span>
                        <div className="w-6 sm:w-8 h-px bg-gray-700" />
                      </div>
                      <p className="text-xs mt-1 text-green-500">{s.nonstop}</p>
                    </div>
                    <div className="text-center min-w-[52px]">
                      <p className="text-lg sm:text-xl font-bold text-white">{flight.arrival}</p>
                      <p className="text-xs text-gray-500">{destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs text-gray-500">{flight.airline} · {flight.flightNumber}</p>
                      {flight.available
                        ? <p className="text-sm text-yellow-400 font-medium mt-1">{flight.seatsLeft} {s.seatsLeft}</p>
                        : <p className="text-sm text-gray-600 mt-1">{s.soldOut}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-white">{flight.price > 0 ? `$${flight.price}` : 'Free'}</p>
                      <p className="text-xs text-gray-500">{s.withPass}</p>
                    </div>
                    {flight.available
                      ? <button className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">{s.bookBtn}</button>
                      : <button className="bg-gray-800 text-gray-600 font-bold px-4 py-2 rounded-lg text-sm cursor-not-allowed whitespace-nowrap">{s.soldOut}</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">{s.demo}</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-10 text-gray-400">Cargando...</div>}>
      <SearchContent />
    </Suspense>
  )
}
