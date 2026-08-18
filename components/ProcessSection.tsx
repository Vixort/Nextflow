'use client'

import { motion } from 'framer-motion'
import { Compass, DraftingCompass, Hammer, Rocket } from 'lucide-react'
import Reveal from './animations/Reveal'
import { Stagger, StaggerItem } from './animations/Stagger'

const STEPS = [
  {
    step: '01',
    title: 'Discover',
    icon: Compass,
    description:
      'We map your goals, users, and constraints. One focused workshop is enough to find the real problem worth solving.',
  },
  {
    step: '02',
    title: 'Architect',
    icon: DraftingCompass,
    description:
      'Systems designed for scale from day one — modular components, typed APIs, and infrastructure that can absorb growth.',
  },
  {
    step: '03',
    title: 'Build',
    icon: Hammer,
    description:
      'Weekly shipped increments with production previews. You watch the product take shape, not wait months for a reveal.',
  },
  {
    step: '04',
    title: 'Launch & Scale',
    icon: Rocket,
    description:
      'Hardened deploys, monitoring, and post-launch iteration. We stay until your metrics move — then we keep moving them.',
  },
]

export default function ProcessSection() {
  return (
    <section className="relative bg-[#09090b] py-24 border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-40 top-1/3 w-[600px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <Reveal direction="up" className="max-w-2xl mb-16">
          <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-cyan-300/60 mb-4">
            How we work
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white leading-[0.92]">
            From first call to production — a process with no dead ends
          </h2>
        </Reveal>

        <Stagger className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08]">
          {/* Animated connecting line across the top */}
          <motion.div
            aria-hidden
            className="hidden lg:block absolute top-0 left-0 right-0 h-px bg-transparent"
          >
            <motion.div
              className="h-px bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </motion.div>

          {STEPS.map((s) => {
            const Icon = s.icon
            return (
              <StaggerItem key={s.step} className="relative bg-[#0f0f11] p-8 lg:p-9 group">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/40 group-hover:scale-110 transition-all duration-500">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-mono text-slate-600 group-hover:text-cyan-400/60 transition-colors font-semibold">
                    /{s.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold tracking-tight text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-[#a1a1aa] leading-relaxed">{s.description}</p>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}