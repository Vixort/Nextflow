'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  CalendarCog,
  Check,
  ChevronDown,
  CircleDollarSign,
  Cpu,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  Rocket,
  Send,
  Sparkles,
  User,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import {
  BUDGETS,
  BUSINESS_TYPES,
  CHANNELS,
  SERVICE_TYPES,
  type ContactContent,
} from '@/lib/validations/contact'

const serviceIcons: Record<string, LucideIcon> = {
  'Web Platform': Globe,
  'SaaS Architecture': Rocket,
  'Mobile Application': MonitorSmartphone,
  'Event Technology': CalendarCog,
  'AI & Workflow': Bot,
  'Something else': Sparkles,
}

const businessIcons: Record<string, LucideIcon> = {
  Company: Building2,
  Startup: Rocket,
  Agency: Cpu,
  Freelancer: User,
  Student: Sparkles,
  Personal: User,
}

const budgetIcons: Record<string, LucideIcon> = {
  'Under ฿50K': CircleDollarSign,
  '฿50K – ฿200K': CircleDollarSign,
  '฿200K – ฿1M': CircleDollarSign,
  '฿1M+': CircleDollarSign,
  'Not sure yet': Sparkles,
}
const quickMessages = [
  'I want a website like your showcase.',
  'Looking for a long-term development partner.',
  'Need help scaling my current platform.',
  'Tell me about pricing and timelines.',
]

type Draft = {
  serviceType: string
  businessType: string
  budget: string
  channel: string
  name: string
  email: string
  phone: string
  message: string
}

const initialDraft: Draft = {
  serviceType: '',
  businessType: '',
  budget: '',
  channel: '',
  name: '',
  email: '',
  phone: '',
  message: '',
}

const ease = [0.22, 1, 0.36, 1] as const

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 56 : -56 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -56 : 56, transition: { duration: 0.3, ease } }),
}

type Status = 'idle' | 'sending' | 'success' | 'error'

type AiMode = 'expand' | 'polish' | 'concise'

const AI_ACTIONS: { mode: AiMode; label: string; hint: string }[] = [
  { mode: 'expand', label: 'Make it detailed', hint: 'Turn a short brief into a fuller one' },
  { mode: 'polish', label: 'Make it professional', hint: 'Sharpen wording, keep every fact' },
  { mode: 'concise', label: 'Make it shorter', hint: 'Crisp essentials only' },
]

function AiExpandButton({
  message,
  onApply,
}: {
  message: string
  onApply: (text: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<AiMode | null>(null)
  const [error, setError] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  const canUse = message.trim().length >= 10

  const run = async (mode: AiMode) => {
    setOpen(false)
    setBusy(mode)
    setError('')
    try {
      const res = await fetch('/api/contact/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'AI request failed')
      onApply(json.text)
    } catch {
      setError('AI could not respond right now — try again in a moment.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {busy ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[11px] font-bold">
          <Loader2 size={11} className="animate-spin" />
          {busy === 'expand' ? 'Expanding…' : busy === 'polish' ? 'Polishing…' : 'Shortening…'}
        </div>
      ) : (
        <button
          type="button"
          disabled={!canUse}
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
            canUse
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50'
              : 'border-white/10 bg-white/[0.03] text-[#52525b] cursor-not-allowed'
          }`}
          title={canUse ? 'Let AI help you write' : 'Write a few words first'}
        >
          <Wand2 size={11} />
          AI
          <ChevronDown size={11} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      )}

      {error && <div className="absolute right-0 top-full mt-1.5 text-[10px] text-rose-400 font-semibold whitespace-nowrap z-30">{error}</div>}

      {open && canUse && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-1.5 z-40 w-60 rounded-2xl border border-white/10 bg-[#131318]/95 backdrop-blur-xl shadow-2xl p-1.5"
          >
            {AI_ACTIONS.map((a) => (
              <button
                key={a.mode}
                type="button"
                onClick={() => run(a.mode)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles size={12} className="text-cyan-400" /> {a.label}
                </div>
                <div className="mt-0.5 pl-[18px] text-[10px] text-[#71717a]">{a.hint}</div>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}

// Fire-and-forget tracker — module scope keeps impure calls (Date.now,
// fetch) out of render-scope functions.
function postTrack(sessionKey: string, events: { k: string; v: string }[]) {
  void fetch('/api/contact/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionKey,
      events: events.map((e) => ({ ...e, t: Date.now() })),
    }),
  }).catch(() => {})
}

export default function ContactForm({ content }: { content?: ContactContent | null }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [draft, setDraft] = useState<Draft>(initialDraft)
  const [status, setStatus] = useState<Status>('idle')
  const [website, setWebsite] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Admin-editable content with built-in fallbacks when settings aren't
  // loaded yet (or the endpoint is unreachable — the form never breaks).
  const services = content?.services?.length ? content.services : [...SERVICE_TYPES]
  const businessTypes = content?.business_types?.length ? content.business_types : [...BUSINESS_TYPES]
  const budgets = content?.budgets?.length ? content.budgets : [...BUDGETS]
  const channels = content?.channels?.length ? content.channels : [...CHANNELS]
  const showPhone = content?.show_phone ?? true
  const showMessage = content?.show_message ?? true
  const submitLabel = content?.submit_label || 'Send inquiry'

  // Session trail: one random id per form mount; every pick / typing burst
  // is pushed fire-and-forget to /api/contact/track (capped by the server).
  const sessionKeyRef = useRef<string>('')

  useEffect(() => {
    if (!sessionKeyRef.current) {
      try {
        sessionKeyRef.current = crypto.randomUUID()
      } catch {
        sessionKeyRef.current = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
      }
    }
  }, [])

  const track = (k: string, v: string) => {
    postTrack(sessionKeyRef.current, [{ k, v }])
  }

  const trackTyping = (k: string, v: string) => {
    if (typeTimer.current) clearTimeout(typeTimer.current)
    typeTimer.current = setTimeout(() => {
      if (v.trim()) track(k, v)
    }, 800)
  }

  const stepsMeta = useMemo(
    () => [
      { label: 'What do you need?', icon: Sparkles },
      { label: 'Tell us about you', icon: User },
      { label: 'Your contact', icon: Mail },
    ],
    [],
  )

  const canNext =
    (step === 0 && draft.serviceType !== '') ||
    (step === 1 && draft.businessType !== '' && draft.budget !== '' && draft.channel !== '')

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          website,
          sessionKey: sessionKeyRef.current,
          email: draft.email.trim(),
          name: draft.name.trim(),
          message: draft.message.trim(),
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again in a moment.')
    }
  }

  const reset = () => {
    setDraft(initialDraft)
    setStatus('idle')
    setStep(0)
  }

  // ---------- Success screen ----------
  if (status === 'success') {
    return (
      <div className="w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease }}
          className="rounded-3xl bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-white/[0.02] p-px shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0e0e11]/95 backdrop-blur-xl px-6 sm:px-8 py-10 sm:py-12 text-center overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-40 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
              className="relative w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.25)]"
            >
              <Check className="text-emerald-400" size={30} strokeWidth={3} />
            </motion.div>
            <h3 className="relative mt-5 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {content?.success_title || 'Message received!'}
            </h3>
            {content?.success_text ? (
              <p className="relative mt-2.5 text-sm text-[#a1a1aa] max-w-[42ch] mx-auto leading-relaxed">
                {content.success_text
                  .replaceAll('{name}', draft.name.split(' ')[0] || 'there')
                  .replaceAll('{service}', draft.serviceType)}
              </p>
            ) : (
              <p className="relative mt-2.5 text-sm text-[#a1a1aa] max-w-[42ch] mx-auto leading-relaxed">
                Thanks {draft.name.split(' ')[0] || 'there'} — we&apos;ve got your{' '}
                <span className="text-white font-semibold">{draft.serviceType}</span> inquiry and will
                get back to you within 1&ndash;2 business days.
              </p>
            )}

            <div className="relative mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              {[
                ['Service', draft.serviceType],
                ['Budget', draft.budget],
                ['Business', draft.businessType],
                ['Channel', draft.channel],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.4, ease }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#52525b]">{k}</div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-200 truncate">{v}</div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={reset}
              className="relative mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Send another inquiry
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto rounded-3xl bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-white/[0.02] p-px shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[calc(1.5rem-1px)] bg-[#0e0e11]/95 backdrop-blur-xl overflow-hidden relative"
      >
        {/* Top hairline glow */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none"
        />
      {/* Progress header */}
      <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="relative">
          {/* Track */}
          <div aria-hidden className="absolute left-[16.666%] right-[16.666%] top-[14px] h-px bg-white/10" />
          {/* Track fill */}
          <motion.div
            aria-hidden
            className="absolute left-[16.666%] top-[14px] h-px bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400"
            style={{ boxShadow: '0 0 10px rgba(34,211,238,0.45)' }}
            initial={false}
            animate={{ width: `${(step / (stepsMeta.length - 1)) * 66.666}%` }}
            transition={{ duration: 0.65, ease }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
              <motion.span
                className="block w-1.5 h-1.5 rounded-full bg-white"
                style={{ boxShadow: '0 0 8px rgba(255,255,255,0.9)' }}
                initial={false}
                animate={{ opacity: step > 0 ? 1 : 0, scale: step > 0 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              />
            </span>
          </motion.div>

          {/* Steps */}
          <div className="relative grid grid-cols-3">
            {stepsMeta.map((meta, i) => {
              const Icon = meta.icon
              const state = i < step ? 'done' : i === step ? 'active' : 'todo'
              const isDone = state === 'done'
              return (
                <button
                  key={meta.label}
                  type="button"
                  onClick={() => {
                    if (state !== 'todo') goTo(i)
                  }}
                  tabIndex={state === 'todo' ? -1 : 0}
                  aria-label={meta.label}
                  className="group flex flex-col items-center gap-2 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                >
                  <div className="relative">
                    {/* Pulse ring on active */}
                    {state === 'active' && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-white/40"
                        initial={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 1.75, opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <motion.div
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isDone
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                          : state === 'active'
                            ? 'bg-white text-[#09090b] shadow-[0_0_18px_rgba(255,255,255,0.35)]'
                            : 'bg-white/[0.05] text-[#52525b] border border-white/10 group-hover:border-white/25 group-hover:text-[#a1a1aa]'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={state}
                          className="flex"
                          initial={{ scale: 0.4, opacity: 0, rotate: isDone ? -90 : 0 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        >
                          {isDone ? <Check size={13} strokeWidth={3} /> : <Icon size={13} />}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <div
                    className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider text-center leading-tight transition-colors duration-500 ${
                      isDone ? 'text-slate-300' : state === 'active' ? 'text-white' : 'text-[#52525b]'
                    }`}
                  >
                    {meta.label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step body */}
      <div className="px-6 sm:px-8 py-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  What do you need?
                </h3>
                <p className="mt-1 text-[13px] text-[#71717a]">
                  Pick one — no typing required.
                </p>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((service, i) => {
                    const Icon = serviceIcons[service] ?? Sparkles
                    const selected = draft.serviceType === service
                    return (
                      <motion.button
                        key={service}
                        type="button"
                        onClick={() => {
                          set('serviceType', service)
                          track('serviceType', service)
                        }}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.35, ease }}
                        whileTap={{ scale: 0.97 }}
                        className={`group relative text-left rounded-2xl border px-4 py-3.5 transition-all duration-300 cursor-pointer ${
                          selected
                            ? 'border-white/60 bg-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.25)]'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                              selected ? 'bg-white text-[#09090b]' : 'bg-white/[0.06] text-slate-300 group-hover:bg-white/10'
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <motion.div
                            initial={false}
                            animate={{
                              scale: selected ? 1 : 0,
                              opacity: selected ? 1 : 0,
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 mt-1"
                          >
                            <Check size={12} className="text-[#09090b]" strokeWidth={3.5} />
                          </motion.div>
                        </div>
                        <div className="mt-2.5 text-[13px] font-bold text-white">{service}</div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Tell us about you
                </h3>
                <p className="mt-1 text-[13px] text-[#71717a]">
                  A few quick picks so we can prepare the right answer.
                </p>

                {/* Business type */}
                <div className="mt-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-2.5">
                    Business type
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {businessTypes.map((b, i) => {
                      const Icon = businessIcons[b] ?? User
                      const selected = draft.businessType === b
                      return (
                        <motion.button
                          key={b}
                          type="button"
                          onClick={() => {
                            set('businessType', b)
                            track('businessType', b)
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.3, ease }}
                          whileTap={{ scale: 0.95 }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                            selected
                              ? 'border-white/60 bg-white/[0.08] text-white'
                              : 'border-white/10 text-[#a1a1aa] hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <Icon size={12} className={selected ? 'text-white' : 'text-[#52525b]'} />
                          {b}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Budget */}
                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-2.5">
                    Budget range
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {budgets.map((b, i) => {
                      const Icon = budgetIcons[b] ?? CircleDollarSign
                      const selected = draft.budget === b
                      return (
                        <motion.button
                          key={b}
                          type="button"
                          onClick={() => {
                            set('budget', b)
                            track('budget', b)
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * i, duration: 0.3, ease }}
                          whileTap={{ scale: 0.95 }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                            selected
                              ? 'border-white/60 bg-white/[0.08] text-white'
                              : 'border-white/10 text-[#a1a1aa] hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <Icon size={12} className={selected ? 'text-white' : 'text-[#52525b]'} />
                          {b}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Channel */}
                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-2.5">
                    How should we reach you?
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {channels.map((c, i) => {
                      const selected = draft.channel === c
                      return (
                        <motion.button
                          key={c}
                          type="button"
                          onClick={() => {
                            set('channel', c)
                            track('channel', c)
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.3, ease }}
                          whileTap={{ scale: 0.95 }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                            selected
                              ? 'border-white/60 bg-white/[0.08] text-white'
                              : 'border-white/10 text-[#a1a1aa] hover:border-white/25 hover:text-white'
                          }`}
                        >
                          {selected ? <Check size={12} /> : <Mail size={12} className="text-[#52525b]" />}
                          {c}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Your contact details
                </h3>
                <p className="mt-1 text-[13px] text-[#71717a]">
                  Just the essentials — we&apos;ll handle the rest.
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Name"
                    icon={<User size={13} />}
                    value={draft.name}
                    onChange={(v) => set('name', v)}
                    onBlur={() => draft.name.trim() && track('name', draft.name.trim())}
                    placeholder="What should we call you?"
                    autoFocus
                  />
                  <Field
                    label="Email"
                    icon={<Mail size={13} />}
                    type="email"
                    value={draft.email}
                    onChange={(v) => set('email', v)}
                    onBlur={() => draft.email.trim() && track('email', draft.email.trim())}
                    placeholder="you@example.com"
                    required
                  />
                  {showPhone && (
                    <Field
                      label="Phone (optional)"
                      icon={<MessageSquare size={13} />}
                      type="tel"
                      value={draft.phone}
                      onChange={(v) => set('phone', v)}
                      onBlur={() => draft.phone.trim() && track('phone', draft.phone.trim())}
                      placeholder="+66 …"
                      className="sm:col-span-2"
                    />
                  )}

                  {showMessage && (
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                        Anything else? (optional)
                      </div>
                      <AiExpandButton message={draft.message} onApply={(t) => set('message', t)} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {quickMessages.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() =>
                            set('message', draft.message ? `${draft.message} ${q}` : q)
                          }
                          className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[#a1a1aa] hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={draft.message}
                      onChange={(e) => {
                        set('message', e.target.value)
                        trackTyping('message', e.target.value)
                      }}
                      rows={2}
                      maxLength={3000}
                      placeholder="Tell us about your project…"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(6,182,212,0.12)] transition-all resize-none"
                    />
                  </div>
                  )}
                </div>

                {status === 'error' && (
                  <p className="mt-3 text-xs font-semibold text-rose-400">{errorMsg}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="px-6 sm:px-8 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
        ) : (
          <span />
        )}

        {step < 2 ? (
          <motion.button
            type="button"
            onClick={() => canNext && goTo(step + 1)}
            disabled={!canNext}
            animate={canNext ? { opacity: 1 } : { opacity: 0.45 }}
            whileTap={canNext ? { scale: 0.97 } : undefined}
            className="inline-flex items-center gap-2 bg-white text-[#09090b] h-11 px-7 rounded-xl text-sm font-bold transition-colors hover:bg-slate-200 disabled:cursor-not-allowed cursor-pointer"
          >
            Continue <ArrowRight size={15} />
          </motion.button>
        ) : (
          <motion.button
            type="submit"
            disabled={status === 'sending' || !draft.name.trim() || !draft.email.trim()}
            whileTap={status === 'sending' ? undefined : { scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-white text-[#09090b] h-11 px-7 rounded-xl text-sm font-bold transition-colors hover:bg-slate-200 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === 'sending' ? (
              <>
                Sending… <Loader2 size={15} className="animate-spin" />
              </>
            ) : (
              <>
                {submitLabel} <Send size={15} />
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] top-auto h-px w-px opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      </form>
    </div>
  )
}

function Field({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  autoFocus,
  className,
}: {
  label: string
  icon: React.ReactNode
  type?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa] mb-1.5">
        <span className="text-[#52525b]">{icon}</span> {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(6,182,212,0.12)] transition-all"
      />
    </div>
  )
}