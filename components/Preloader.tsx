'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

const LoadedContext = createContext(false)

export function usePageLoaded() {
  return useContext(LoadedContext)
}

export function Preloader({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined
    let fallback: ReturnType<typeof setTimeout> | undefined

    const markLoaded = () => {
      if (!alive) return
      timer = setTimeout(() => setLoaded(true), 200)
    }

    if (document.readyState === 'complete') {
      markLoaded()
    } else {
      window.addEventListener('load', markLoaded, { once: true })
      fallback = setTimeout(markLoaded, 5000)
    }

    return () => {
      alive = false
      if (timer) clearTimeout(timer)
      if (fallback) clearTimeout(fallback)
      window.removeEventListener('load', markLoaded)
    }
  }, [])

  return (
    <LoadedContext.Provider value={loaded}>
      {children}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[#09090b]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative flex items-center justify-center w-16 h-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400" />
              </motion.div>
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <path
                  d="M10 22L10 10L16 16L22 10L22 22"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                />
              </svg>
            </motion.div>
            <motion.span
              className="text-sm font-semibold tracking-[0.35em] text-cyan-300/70 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Nextflow
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadedContext.Provider>
  )
}
