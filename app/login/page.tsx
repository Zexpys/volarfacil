'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const { t } = useLanguage()
  const a = t.auth
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(a.errorInvalid)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  const inputClass = "w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600"

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
            <span>✈️</span>
            <span className="text-white">Volar<span className="text-green-400">Fácil</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{a.loginTitle}</h1>
          <p className="text-gray-400 text-sm mt-2">{a.loginSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-900 border border-white/10 rounded-2xl p-8 space-y-4">
          {error && (
            <div className="bg-red-950 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">{a.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="tu@correo.com" className={inputClass} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">{a.password}</label>
              <Link href="/reset-password" className="text-xs text-green-400 hover:text-green-300 transition-colors">{a.forgotPassword}</Link>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••" className={inputClass} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors text-sm mt-2">
            {loading ? '...' : a.loginBtn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {a.noAccount}{' '}
          <Link href="/signup" className="text-green-400 hover:text-green-300 transition-colors font-medium">{a.signUpLink}</Link>
        </p>
      </div>
    </div>
  )
}
