'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
  introOffer: 'trial' | 'referral'
  refCode?: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export default function CheckoutButton({ introOffer, refCode, className, children, disabled }: Props) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  async function handleClick() {
    if (disabled) return
    if (!user) {
      // Preserve referral code through login flow
      const ref = refCode || (typeof window !== 'undefined' ? localStorage.getItem('vf_ref') : null)
      router.push(`/signup${ref ? `?ref=${ref}` : ''}`)
      return
    }

    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const code = refCode || (typeof window !== 'undefined' ? localStorage.getItem('vf_ref') : null)

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ introOffer, refCode: code }),
    })

    const { url, error } = await res.json()

    if (url) {
      window.location.href = url
    } else {
      console.error('Checkout error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={className}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  )
}
