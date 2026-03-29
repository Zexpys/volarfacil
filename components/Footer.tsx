'use client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const f = t.footer
  return (
    <footer className="border-t border-white/10 mt-20 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>✈️</span>
          <span className="font-semibold text-gray-300">Volar<span className="text-green-400">Fácil</span></span>
          <span className="ml-2">{f.tagline}</span>
        </div>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">{f.pricing}</Link>
          <Link href="/search" className="hover:text-gray-300 transition-colors">{f.search}</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">{f.terms}</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">{f.privacy}</Link>
        </div>
      </div>
    </footer>
  )
}
