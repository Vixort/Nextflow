'use client'

import { useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useEffect } from 'react'
import Reveal from './animations/Reveal'
import { Stagger, StaggerItem } from './animations/Stagger'

const STATS = [
  { value: 120, suffix: '+', label: 'Projects delivered', note: 'Web platforms, SaaS & event tech' },
  { value: 99.99, suffix: '%', label: 'Uptime SLA', note: 'Multi-region, automated failover', decimals: 2 },
  { value: 200, prefix: '<', suffix: 'ms', label: 'Avg. response time', note: 'Under real production load' },
  { value: 50, suffix: 'K+', label: 'Concurrent connections', note: 'Handled without degradation' },
]

function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    })
    return () => controls.stop()
  }, [inView, value, decimals])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section className="relative bg-[#09090b] py-24 border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <Reveal direction="up" className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white leading-[0.92]">
            Numbers we&apos;re <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">proud</span> of
          </h2>
          <p className="text-sm sm:text-base text-[#71717a] max-w-[46ch] mx-auto mt-3 leading-relaxed">
            Measured in production, not slides. Every figure below comes from systems we run today.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08]">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} className="relative bg-[#0f0f11] p-8 lg:p-10 group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(56,189,248,0.06),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-white group-hover:text-cyan-300 transition-colors duration-500">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="mt-3 text-sm font-bold text-slate-200">{stat.label}</div>
              <div className="mt-1 text-xs text-[#71717a] leading-snug">{stat.note}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}