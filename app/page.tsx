import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-gray-950 to-gray-950 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-900/30 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-green-950 border border-green-800/50 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Now tracking 70+ Volaris routes in real time
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find your Volaris Pass<br />
            <span className="text-green-400">flights instantly</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Stop refreshing Volaris manually. VolarFácil monitors annual pass availability 24/7 and alerts you the second seats drop.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl transition-colors text-lg">
              Search flights free →
            </Link>
            <Link href="/pricing" className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl transition-colors text-lg">
              View pricing
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-4">No credit card required · Free forever for basic search</p>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="max-w-4xl mx-auto px-4 -mt-4 mb-16">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">From</label>
              <select className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                <option>OAK — Oakland</option>
                <option>SFO — San Francisco</option>
                <option>SMF — Sacramento</option>
                <option>SJC — San Jose</option>
                <option>LAX — Los Angeles</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">To</label>
              <select className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                <option>MLM — Morelia</option>
                <option>GDL — Guadalajara</option>
                <option>MEX — Mexico City</option>
                <option>CUN — Cancun</option>
                <option>LAS — Las Vegas</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</label>
              <input type="date" className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
            </div>
            <Link href="/search" className="flex items-center justify-center bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors mt-5 py-2.5">
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Everything pass holders need</h2>
        <p className="text-gray-400 text-center mb-12">Built by a Volaris pass holder, for Volaris pass holders</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🔔',
              title: 'Instant seat alerts',
              desc: 'Get notified via SMS, email, or push notification the moment seats drop on your saved routes. 10 seats go fast — be the first to know.',
              badge: 'Most popular',
            },
            {
              icon: '📅',
              title: 'Fare calendar',
              desc: 'See an entire month at a glance. Green = available, yellow = limited seats, gray = sold out. No more guessing which days have flights.',
              badge: null,
            },
            {
              icon: '⚡',
              title: 'Auto-book (coming soon)',
              desc: 'Set your preferred route and dates. VolarFácil automatically books the moment a seat opens — before anyone else even sees it.',
              badge: 'Premium',
            },
            {
              icon: '🗺️',
              title: 'Route optimizer',
              desc: 'Flying to a small city? Find the best multi-hop routes automatically. OAK → MLM → MEX in one search.',
              badge: null,
            },
            {
              icon: '💰',
              title: 'All-in price calculator',
              desc: 'See your real total cost including TUA airport fees, luggage, and taxes. No hidden surprises at checkout.',
              badge: null,
            },
            {
              icon: '📊',
              title: 'Availability heatmap',
              desc: 'Know which routes historically get the most pass seats. Stop wasting time on routes that never open.',
              badge: null,
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-white/10 rounded-xl p-6 hover:border-green-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{f.icon}</span>
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

      {/* vs Competitor */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Better than the competition</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="py-3 px-4 text-center">
                  <span className="text-white font-bold">VolarFácil</span>
                  <span className="block text-green-400 text-xs">Free / $7 / $15</span>
                </th>
                <th className="py-3 px-4 text-center text-gray-500">
                  pavolaris.com
                  <span className="block text-xs">$3.95/day</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Flight search', '✅ Free', '💳 Paid only'],
                ['Seat alerts', '✅ $7/mo', '❌ No'],
                ['Auto-booking', '✅ $15/mo', '❌ No'],
                ['Fare calendar', '✅ $7/mo', '✅ Paid'],
                ['Route optimizer', '✅ $7/mo', '✅ Paid'],
                ['All-in pricing', '✅ Free', '❌ No'],
                ['Mobile friendly', '✅ Yes', '⚠️ Basic'],
              ].map(([feature, us, them]) => (
                <tr key={feature} className="hover:bg-white/2">
                  <td className="py-3 px-4 text-gray-300">{feature}</td>
                  <td className="py-3 px-4 text-center font-medium">{us}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-green-950 to-gray-900 border border-green-800/30 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-3">Start for free today</h2>
          <p className="text-gray-400 mb-8">5 free searches per day. Upgrade anytime for unlimited access + alerts.</p>
          <Link href="/pricing" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl transition-colors text-lg inline-block">
            Get started — it&apos;s free →
          </Link>
        </div>
      </section>
    </div>
  )
}
