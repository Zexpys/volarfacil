'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  const a = t.auth
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
    if (error) {
      setError(a.errorGeneral)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-xl font-bold text-white mb-2">{a.resetSentTitle}</h2>
        <p className="text-gray-400 text-sm">{a.resetSuccess}</p>
        <Link href="/login" className="inline-block mt-6 text-sm text-green-400 hover:text-green-300">{a.backToLogin}</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
            <span>✈️</span>
            <span className="text-white">Volar<span className="text-green-400">Fácil</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{a.resetTitle}</h1>
          <p className="text-gray-400 text-sm mt-2">{a.resetSubtitle}</p>
        </div>

        <form onSubmit={handleReset} className="bg-gray-900 border border-white/10 rounded-2xl p-8 space-y-4">
          {error && (
            <div className="bg-red-950 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">{a.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="tu@correo.com"
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors text-sm">
            {loading ? '...' : a.resetBtn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-green-400 hover:text-green-300 transition-colors">{a.backToLogin}</Link>
        </p>
      </div>
    </div>
  )
}
