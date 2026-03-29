'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

function SignupContent() {
  const { t } = useLanguage()
  const a = t.auth
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Persist referral code from URL to localStorage so it survives email confirmation
    const ref = params.get('ref')
    if (ref) localStorage.setItem('vf_ref', ref.toUpperCase())
  }, [params])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError(a.errorPasswordMatch); return }
    if (password.length < 6) { setError(a.errorPasswordShort); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) {
      setError(error.message.includes('already') ? a.errorEmail : a.errorGeneral)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const inputClass = "w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600"

  if (success) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-xl font-bold text-white mb-2">{a.checkEmailTitle}</h2>
        <p className="text-gray-400 text-sm">{a.checkEmail}</p>
        <Link href="/login" className="inline-block mt-6 text-sm text-green-400 hover:text-green-300">{a.backToLogin}</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
            <span>✈️</span>
            <span className="text-white">Volar<span className="text-green-400">Fácil</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{a.signupTitle}</h1>
          <p className="text-gray-400 text-sm mt-2">{a.signupSubtitle}</p>
        </div>

        <form onSubmit={handleSignup} className="bg-gray-900 border border-white/10 rounded-2xl p-8 space-y-4">
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
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">{a.password}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="Mínimo 6 caracteres" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">{a.confirmPassword}</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              placeholder="Repite tu contraseña" className={inputClass} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors text-sm mt-2">
            {loading ? '...' : a.signupBtn}
          </button>
          <p className="text-xs text-gray-600 text-center">
            {a.termsNote}{' '}
            <Link href="/terms" className="underline hover:text-gray-400">{a.termsLink}</Link>
            {' '}{a.andWord}{' '}
            <Link href="/privacy" className="underline hover:text-gray-400">{a.privacyLink}</Link>
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {a.haveAccount}{' '}
          <Link href="/login" className="text-green-400 hover:text-green-300 transition-colors font-medium">{a.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div />}>
      <SignupContent />
    </Suspense>
  )
}
