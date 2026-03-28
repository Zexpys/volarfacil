import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>✈️</span>
          <span className="font-semibold text-gray-300">Volar<span className="text-green-400">Fácil</span></span>
          <span className="ml-2">— Not affiliated with Volaris</span>
        </div>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
          <Link href="/search" className="hover:text-gray-300 transition-colors">Search</Link>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy</span>
        </div>
      </div>
    </footer>
  )
}
