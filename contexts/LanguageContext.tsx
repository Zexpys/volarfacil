'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Lang } from '@/lib/i18n'

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof translations.es
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  setLang: () => {},
  t: translations.es,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    const saved = localStorage.getItem('vf-lang') as Lang | null
    if (saved === 'en' || saved === 'es') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('vf-lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
