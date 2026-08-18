'use client'

import { useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useEffect } from 'react'
import { Stagger } from './animations/Stagger'
import Reveal from './animations/Reveal'

function CountUp({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
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

function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 0 })

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
      }}
      className={className}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, rgba(56,189,248,0.08), transparent 65%)`,
        }}
      />
      {children}
    </div>
  )
}

export default function ValueProposition() {
  return (
    <section className="relative bg-[#09090b] py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <Reveal direction="up">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white mb-10 leading-[0.92]">
            Built for teams that ship fast
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] rounded-xl overflow-hidden border border-white/[0.08]">
          {/* Row 1: Cell 1 (LARGE - col-span-2) */}
          <SpotlightCard className="group relative bg-[#0f0f11] p-8 lg:p-10 md:col-span-2 flex flex-col justify-between min-h-[260px] overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white">Performance at Scale</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                Sub-200ms response times under 50K concurrent connections. Our event-driven architecture eliminates bottlenecks before they reach your users.
              </p>
            </div>
            <div className="mt-8 text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white/10 select-none">
              &lt;<CountUp value={200} suffix="ms" />
            </div>
          </SpotlightCard>

          {/* Row 1: Cell 2 (Regular - col-span-1) */}
          <SpotlightCard className="group relative bg-[#0f0f11] p-8 lg:p-10 md:col-span-1 flex flex-col justify-between min-h-[260px] overflow-hidden">
            <div>
              <h3 className="text-lg font-semibold text-white">Enterprise Security</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                SOC 2 compliant infrastructure with end-to-end encryption, RBAC, and automated threat detection built into every deployment layer.
              </p>
            </div>
          </SpotlightCard>

          {/* Row 2: Cell 3 (Regular - col-span-1) */}
          <SpotlightCard className="group relative bg-[#0f0f11] p-8 lg:p-10 md:col-span-1 flex flex-col justify-between min-h-[260px] overflow-hidden">
            <div>
              <h3 className="text-lg font-semibold text-white">Intelligent Scaling</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                Auto-scaling infrastructure that responds to traffic spikes in under 3 seconds. Pay for what you use, scale to what you need.
              </p>
            </div>
          </SpotlightCard>

          {/* Row 2: Cell 4 (LARGE - col-span-2) */}
          <SpotlightCard className="group relative bg-[#0f0f11] p-8 lg:p-10 md:col-span-2 flex flex-col justify-between min-h-[260px] overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white">99.99% Uptime SLA</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                Redundant multi-region deployment with automated failover. Your platform stays online even when entire availability zones don&apos;t.
              </p>
            </div>
            <div className="mt-8 text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white/10 select-none">
              <CountUp value={99.99} suffix="%" decimals={2} />
            </div>
          </SpotlightCard>
        </Stagger>
      </div>
    </section>
  )
}