'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle2, Gauge, ShieldCheck, Zap } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

type Tab = 'overview' | 'traffic' | 'alerts'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'traffic', label: 'Traffic' },
  { id: 'alerts', label: 'Alerts' },
]

const TRAFFIC_BARS = [34, 52, 41, 68, 57, 82, 64, 91, 73, 58, 44, 62]

const ALERTS = [
  { icon: CheckCircle2, tone: 'text-emerald-400', text: 'Deploy #4821 promoted to production', time: '12s ago' },
  { icon: Zap, tone: 'text-cyan-400', text: 'Auto-scaled 6 → 24 instances', time: '1m ago' },
  { icon: Activity, tone: 'text-violet-400', text: 'Traffic spike detected (+312%)', time: '4m ago' },
  { icon: ShieldCheck, tone: 'text-emerald-400', text: 'Failover drill passed — zero downtime', time: '22m ago' },
  { icon: AlertTriangle, tone: 'text-amber-400', text: 'Cache hit-rate dropped to 91% — auto-fixed', time: '1h ago' },
]

export default function PhoneMockup({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className={`relative select-none ${className}`}>
      {/* Glow behind phone */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full bg-gradient-to-br from-cyan-500/25 via-violet-500/15 to-transparent blur-3xl"
      />

      {/* Phone frame */}
      <div className="relative w-full max-w-[320px] rounded-[2.6rem] border-[6px] border-[#1c1c1e] bg-[#09090b] shadow-[0_40px_80px_-20px_rgba(9,9,11,0.5)] overflow-hidden mx-auto">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#1c1c1e] z-20" />

        {/* Screen */}
        <div className="relative h-[540px] sm:h-[600px] bg-[#0b0c11] flex flex-col overflow-hidden">
          {/* Screen glow */}
          <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-cyan-500/10 blur-[60px] rounded-full" />

          {/* App header */}
          <div className="relative z-10 px-5 pt-9 pb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#71717a] font-semibold tracking-wide">Nextflow Console</div>
              <div className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems live
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Gauge size={14} className="text-cyan-300" />
            </div>
          </div>

          {/* Tabs */}
          <div className="relative z-10 mx-5 mb-4 flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-colors cursor-pointer ${
                  tab === t.id ? 'text-[#09090b]' : 'text-[#71717a] hover:text-white'
                }`}
              >
                {tab === t.id && (
                  <motion.div
                    layoutId="phone-tab"
                    className="absolute inset-0 rounded-lg bg-white"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="relative z-10 flex-1 px-5 overflow-hidden">
            <AnimatePresence mode="wait">
              {tab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {/* Big uptime number */}
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#71717a]">Uptime · 30 days</div>
                    <div className="mt-1 text-4xl font-extrabold tracking-[-0.03em] text-white">
                      99.99<span className="text-lg text-cyan-300">%</span>
                    </div>
                    <div className="mt-2 h-8 flex items-end justify-between gap-1">
                      {[60, 85, 45, 95, 70, 100, 55, 88, 64, 92, 78, 100].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/70 to-cyan-400"
                          style={{
                            height: `${h}%`,
                            opacity: 0.35 + (h / 100) * 0.65,
                            animation: `miniPulse ${1.6 + (i % 4) * 0.3}s ease-in-out ${i * 0.08}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stat grid */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#71717a]">P95 latency</div>
                      <div className="mt-1 text-lg font-extrabold text-white">
                        87<span className="text-xs text-cyan-300">ms</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#71717a]">Serving</div>
                      <div className="mt-1 text-lg font-extrabold text-white">
                        24<span className="text-xs text-cyan-300"> regions</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 col-span-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#71717a]">Error rate</div>
                        <span className="text-[9px] font-bold text-emerald-400">0.02%</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                          initial={{ width: '0%' }}
                          animate={{ width: '2%' }}
                          transition={{ duration: 1.4, ease, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === 'traffic' && (
                <motion.div
                  key="traffic"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#71717a]">Requests / sec</div>
                      <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-full">
                        LIVE
                      </span>
                    </div>
                    <div className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white">
                      48,213<span className="text-sm text-[#71717a]"> rps</span>
                    </div>
                    <div className="mt-3 h-28 flex items-end justify-between gap-1">
                      {TRAFFIC_BARS.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/80 to-cyan-400"
                          style={{
                            height: `${h}%`,
                            animation: `trafficBounce ${1.2 + (i % 3) * 0.4}s ease-in-out ${i * 0.12}s infinite`,
                            transformOrigin: 'bottom',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#71717a]">Concurrent</div>
                      <div className="mt-1 text-lg font-extrabold text-white">50K+</div>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#71717a]">Auto-scale</div>
                      <div className="mt-1 text-lg font-extrabold text-emerald-400">Active</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === 'alerts' && (
                <motion.div
                  key="alerts"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                  className="space-y-2"
                >
                  {ALERTS.map((a, i) => {
                    const Icon = a.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease }}
                        className="flex items-start gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3"
                      >
                        <Icon size={14} className={`${a.tone} mt-0.5 shrink-0`} />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-200 leading-snug">{a.text}</div>
                          <div className="text-[9px] text-[#71717a] mt-0.5">{a.time}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Home indicator */}
          <div className="relative z-10 mx-auto mb-2.5 w-24 h-1 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  )
}