'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="border-b border-white/10 bg-gray-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">✈️</span>
          <span className="text-white">Volar<span className="text-green-400">Fácil</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/search" className="hover:text-white transition-colors">Search</Link>
          <Link href="/calendar" className="hover:text-white transition-colors">Fare Calendar</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
            Log in
          </button>
          <Link href="/pricing" className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Get started
          </Link>
        </div>

        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/search" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Search</Link>
          <Link href="/calendar" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Fare Calendar</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/pricing" className="bg-green-500 text-black font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>Get started</Link>
        </div>
      )}
    </nav>
  )
}
