import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For occasional pass holders',
    features: [
      '5 flight searches per day',
      'Basic availability view',
      'All-in price calculator',
      'Mobile friendly',
    ],
    missing: ['Seat alerts', 'Fare calendar', 'Unlimited searches', 'Auto-book'],
    cta: 'Start for free',
    ctaHref: '/search',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$7',
    period: 'per month',
    description: 'For frequent pass users',
    features: [
      'Unlimited flight searches',
      'Instant seat drop alerts (SMS + email)',
      'Fare calendar — full month view',
      'Route optimizer',
      'All-in price calculator',
      'Availability heatmap',
      'Cancel anytime',
    ],
    missing: ['Auto-book'],
    cta: 'Get Pro',
    ctaHref: '/search',
    highlight: true,
  },
  {
    name: 'Auto',
    price: '$15',
    period: 'per month',
    description: 'For power users',
    features: [
      'Everything in Pro',
      'Auto-book when seats drop',
      'Set rules: route, date range, max price',
      'Booking confirmation via text',
      'Priority support',
    ],
    missing: [],
    cta: 'Get Auto',
    ctaHref: '/search',
    highlight: false,
    badge: 'Coming soon',
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple pricing</h1>
        <p className="text-gray-400 text-lg">One tool. Three tiers. Way cheaper than missing a flight.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.name} className={`rounded-2xl p-6 flex flex-col relative ${
            plan.highlight
              ? 'bg-gradient-to-b from-green-950/80 to-gray-900 border border-green-700/50 shadow-lg shadow-green-950/30'
              : 'bg-gray-900 border border-white/10'
          }`}>
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">Most popular</span>
              </div>
            )}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-300 mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm mb-1">/{plan.period}</span>
              </div>
              <p className="text-gray-500 text-sm">{plan.description}</p>
            </div>

            <Link
              href={plan.ctaHref}
              className={`block text-center font-bold py-2.5 rounded-lg mb-6 transition-colors text-sm ${
                plan.highlight
                  ? 'bg-green-500 hover:bg-green-400 text-black'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-white/10'
              }`}
            >
              {plan.cta}
            </Link>

            <div className="flex-1">
              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
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
        <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'Do I need a Volaris annual pass to use VolarFácil?',
              a: 'Yes — VolarFácil is a tool for Volaris annual pass holders. You need a valid pass to search and book flights.',
            },
            {
              q: 'How are seat alerts delivered?',
              a: 'Via SMS and email. The moment seats drop on your saved routes, you get notified instantly — before they sell out.',
            },
            {
              q: 'What is auto-book?',
              a: 'You set rules (route, date range, preferred departure time) and VolarFácil automatically books a seat the instant availability opens. No manual action needed.',
            },
            {
              q: 'Is VolarFácil affiliated with Volaris?',
              a: 'No. VolarFácil is an independent third-party tool. We are not affiliated with or endorsed by Volaris.',
            },
            {
              q: 'Can I cancel my subscription?',
              a: 'Yes, cancel anytime from your account settings. No hidden fees or cancellation penalties.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'All major credit and debit cards via Stripe. Secure, encrypted checkout.',
            },
          ].map(({ q, a }) => (
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
