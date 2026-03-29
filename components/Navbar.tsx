'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/')
    setOpen(false)
  }

  const displayEmail = user?.email
    ? (user.email.length > 22 ? user.email.slice(0, 20) + '…' : user.email)
    : ''

  return (
    <nav className="border-b border-white/10 bg-gray-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">✈️</span>
          <span className="text-white">Volar<span className="text-green-400">Fácil</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/search" className="hover:text-white transition-colors">{t.nav.search}</Link>
          <Link href="/calendar" className="hover:text-white transition-colors">{t.nav.calendar}</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">{t.nav.pricing}</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gray-800 border border-white/10 hover:border-white/30 px-2.5 py-1.5 rounded-lg transition-colors text-gray-300"
          >
            <span>{lang === 'es' ? '🇲🇽' : '🇺🇸'}</span>
            <span>{lang === 'es' ? 'ES' : 'EN'}</span>
          </button>

          {user ? (
            <>
              <Link href="/account"
                className="text-xs text-gray-500 hover:text-white transition-colors max-w-[160px] truncate px-2">
                {displayEmail}
              </Link>
              <button onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
                {t.auth.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
                {t.nav.login}
              </Link>
              <Link href="/signup" className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                {t.nav.getStarted}
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 text-xs font-semibold bg-gray-800 border border-white/10 px-2 py-1.5 rounded-lg text-gray-300"
          >
            <span>{lang === 'es' ? '🇲🇽' : '🇺🇸'}</span>
            <span>{lang === 'es' ? 'ES' : 'EN'}</span>
          </button>
          <button className="text-gray-400" onClick={() => setOpen(!open)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/search" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>{t.nav.search}</Link>
          <Link href="/calendar" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>{t.nav.calendar}</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>{t.nav.pricing}</Link>
          {user ? (
            <>
              <Link href="/account" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>
                {lang === 'es' ? 'Mi cuenta' : 'My account'}
              </Link>
              <button onClick={handleSignOut} className="text-left text-red-400 hover:text-red-300">{t.auth.logout}</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>{t.nav.login}</Link>
              <Link href="/signup" className="bg-green-500 text-black font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>{t.nav.getStarted}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
