'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Clock3, Lock, Mail, ShieldCheck, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import ContactForm from '@/components/ContactForm'
import type { ContactContent } from '@/lib/validations/contact'

const ease = [0.22, 1, 0.36, 1] as const

const promises = [
  { icon: Zap, title: 'A few clicks, no long forms', text: 'Pick what you need — type almost nothing.' },
  { icon: Clock3, title: 'Reply within 1–2 business days', text: 'A real engineer reads every inquiry.' },
  { icon: ShieldCheck, title: 'Your info stays private', text: 'Never shared, never sold.' },
]

export default function ContactPageClient() {
  const [settings, setSettings] = useState<{ enabled: boolean; content: ContactContent; support_email?: string } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const searchParams = useSearchParams()
  const initialService = searchParams.get('service') ?? undefined

  useEffect(() => {
    let cancelled = false
    fetch('/api/contact/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (cancelled || !d?.data) return
        setSettings({ enabled: !!d.data.enabled, content: d.data.content, support_email: d.data.support_email || undefined })
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const closed = loaded && settings && !settings.enabled
  const title = settings?.content?.heading || 'Tell us what you need.'
  const accent = settings?.content?.heading_accent || "We'll do the rest."
  const intro = settings?.content?.intro

  return (
    <main className="min-h-dvh bg-[#09090b] text-slate-100 relative overflow-hidden flex flex-col">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(56,189,248,0.5), transparent)' }}
      />

      <Navbar />

      <div className="relative flex-1 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 py-10 flex">
        <div className="w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 lg:mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717a] hover:text-white transition-colors"
            >
              <ArrowLeft size={13} /> Back to home
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] gap-10 lg:gap-14 items-center">
          {/* Left: pitch */}
          <div className="max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.08 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-bold uppercase tracking-widest text-[#a1a1aa]"
            >
              <Mail size={12} className="text-cyan-400" /> Contact Us
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.16 }}
              className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-[-0.04em] text-white leading-[1.05]"
            >
              {title}
              <br className="hidden sm:block" />
              <span className="text-[#71717a]">{accent}</span>
            </motion.h1>
            {intro && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.24 }}
                className="mt-3 text-sm sm:text-[15px] text-[#71717a] max-w-[46ch] leading-relaxed"
              >
                {intro}
              </motion.p>
            )}

            <div className="mt-7 space-y-3.5">
              {promises.map((p, i) => {
                const Icon = p.icon
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.08, duration: 0.5, ease }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-slate-200">{p.title}</div>
                      <div className="mt-0.5 text-xs text-[#71717a] leading-snug">{p.text}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: form (or closed notice) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.32 }}
          >
            <AnimatePresence mode="wait">
              {closed ? (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="w-full mx-auto max-w-xl rounded-3xl bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-white/[0.02] p-px shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
                >
                  <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0e0e11]/95 backdrop-blur-xl px-6 sm:px-8 py-12 text-center overflow-hidden">
                    <div
                      aria-hidden
                      className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-40 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"
                    />
                    <div className="relative w-16 h-16 mx-auto rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
                      <Lock size={26} className="text-amber-300" />
                    </div>
                    <h3 className="relative mt-5 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                      {settings?.content?.closed_title || "We're not accepting new inquiries right now"}
                    </h3>
                    {settings?.content?.closed_text && (
                      <p className="relative mt-2.5 text-sm text-[#a1a1aa] max-w-[42ch] mx-auto leading-relaxed">
                        {settings.content.closed_text}
                      </p>
                    )}
                    {settings?.support_email && (
                      <a
                        href={`mailto:${settings.support_email}`}
                        className="relative mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                      >
                        <Mail size={13} /> {settings.support_email}
                      </a>
                    )}
                    <p className="relative mt-8 text-[10px] text-[#52525b] font-semibold uppercase tracking-widest">
                      Please check back later
                    </p>
                  </div>
                </motion.div>
              ) : (
                <ContactForm key={initialService ?? 'form'} content={settings?.content} initialServiceType={initialService} />
              )}
            </AnimatePresence>
          </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}