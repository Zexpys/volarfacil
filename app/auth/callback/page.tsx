'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase JS handles the hash tokens automatically via onAuthStateChange.
    // Just redirect home after a brief delay.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        if (event === 'PASSWORD_RECOVERY') {
          router.push('/update-password')
        } else {
          router.push('/')
        }
      }
    })
    // Fallback redirect
    const timer = setTimeout(() => router.push('/'), 3000)
    return () => { subscription.unsubscribe(); clearTimeout(timer) }
  }, [router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-gray-400">
          <svg className="animate-spin h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Verificando...</span>
        </div>
      </div>
    </div>
  )
}
