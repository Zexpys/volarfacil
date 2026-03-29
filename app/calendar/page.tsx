'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIRPORTS, getCalendarData } from '@/lib/mockData'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const US_AIRPORTS = AIRPORTS.filter(a => a.country === 'US')
const MX_AIRPORTS = AIRPORTS.filter(a => a.country === 'MX')

export default function CalendarPage() {
  const router = useRouter()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [origin, setOrigin] = useState('OAK')
  const [destination, setDestination] = useState('MLM')

  const calData = getCalendarData(year, month, origin, destination)
  const firstDay = new Date(year, month, 1).getDay()
  const available = calData.filter(d => d.status > 0).length
  const good = calData.filter(d => d.status >= 2).length

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function handleDayClick(day: number, status: number) {
    if (status === 0) return
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    router.push(`/search?origin=${origin}&destination=${destination}&date=${dateStr}`)
  }

  const statusColor = (s: number) => {
    if (s === 0) return 'bg-gray-800/50 text-gray-600 cursor-default'
    if (s === 1) return 'bg-yellow-950/80 text-yellow-400 border border-yellow-800/30 hover:border-yellow-600/50 cursor-pointer'
    if (s === 2) return 'bg-green-950/80 text-green-400 border border-green-800/30 hover:border-green-600/50 cursor-pointer'
    return 'bg-green-900/40 text-green-300 border border-green-700/40 hover:border-green-500/60 cursor-pointer'
  }

  const selectClass = "bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Fare Calendar</h1>
      <p className="text-gray-400 mb-8 text-sm">See all available days at a glance. Tap a day to search flights.</p>

      {/* Controls */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">From</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} className={selectClass}>
              <optgroup label="🇺🇸 USA">
                {US_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </optgroup>
              <optgroup label="🇲🇽 Mexico">
                {MX_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">To</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} className={selectClass}>
              <optgroup label="🇺🇸 USA">
                {US_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </optgroup>
              <optgroup label="🇲🇽 Mexico">
                {MX_AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div className="col-span-2 flex items-end">
            <button className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg text-sm transition-colors">
              🔔 Set alert for this route
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-900 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{available}</p>
          <p className="text-xs text-gray-500 mt-1">Days with seats</p>
        </div>
        <div className="bg-gray-900 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{good}</p>
          <p className="text-xs text-gray-500 mt-1">Good availability</p>
        </div>
        <div className="bg-gray-900 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">{calData.length - available}</p>
          <p className="text-xs text-gray-500 mt-1">Sold out</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs text-gray-600 font-medium py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {calData.map(({ day, status }) => (
            <div
              key={day}
              onClick={() => handleDayClick(day, status)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors ${statusColor(status)}`}
            >
              <span>{day}</span>
              {status === 1 && <span className="text-[9px] mt-0.5 text-yellow-500">low</span>}
              {status >= 2 && <span className="text-[9px] mt-0.5 text-green-500">✓</span>}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/5 justify-center">
          {[
            { color: 'bg-gray-800', label: 'No seats' },
            { color: 'bg-yellow-950 border border-yellow-800/30', label: 'Limited (1-3 seats)' },
            { color: 'bg-green-950 border border-green-800/30', label: 'Available' },
            { color: 'bg-green-900/40 border border-green-700/40', label: 'Good availability' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-gray-400">
              <div className={`w-4 h-4 rounded ${color}`} />
              {label}
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-xs mt-4">Tap any available day to search flights for that date</p>
      </div>

      <p className="text-center text-gray-600 text-xs mt-6">
        Demo mode — availability patterns are simulated. Real data requires a Volaris annual pass.
      </p>
    </div>
  )
}
