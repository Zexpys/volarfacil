'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

export default function UpdatePasswordPage() {
  const { t } = useLanguage()
  const a = t.auth
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError(a.errorPasswordMatch); return }
    if (password.length < 6) { setError(a.errorPasswordShort); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(a.errorGeneral)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 2000)
    }
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-white mb-2">{a.updateSuccess}</h2>
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
          <h1 className="text-2xl font-bold text-white">{a.updateTitle}</h1>
        </div>

        <form onSubmit={handleUpdate} className="bg-gray-900 border border-white/10 rounded-2xl p-8 space-y-4">
          {error && (
            <div className="bg-red-950 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">{a.newPassword}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">{a.confirmPassword}</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              placeholder="Repite tu contraseña"
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-600" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition-colors text-sm">
            {loading ? '...' : a.updateBtn}
          </button>
        </form>
      </div>
    </div>
  )
}
