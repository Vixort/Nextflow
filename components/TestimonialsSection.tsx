'use client'

import { Quote, Star } from 'lucide-react'
import Reveal from './animations/Reveal'
import { Stagger, StaggerItem } from './animations/Stagger'

const TESTIMONIALS = [
  {
    quote:
      'Nextflow rebuilt our booking platform in eight weeks. Peak traffic used to take us down — last Black Friday we ran at 42,000 concurrent users without a blip.',
    name: 'Priya Sharma',
    role: 'CTO, TravelScale',
    initial: 'P',
    accent: 'from-cyan-400 to-blue-600',
  },
  {
    quote:
      'They treat performance like a budget line, not a slogan. We went from 1.8s time-to-interactive to 240ms, and conversion followed immediately.',
    name: 'Daniel Okafor',
    role: 'Head of Product, Nova Retail',
    initial: 'D',
    accent: 'from-violet-400 to-indigo-600',
  },
  {
    quote:
      'Our gala platform handled ticketing, live streaming, and real-time telemetry for 850 VIP guests. Not one minute of downtime across three days.',
    name: 'Lena Fischer',
    role: 'Event Director, Aurora Events',
    initial: 'L',
    accent: 'from-emerald-400 to-teal-600',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="relative bg-[#09090b] py-24 border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-0 w-[500px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <Reveal direction="up" className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white leading-[0.92]">
            What clients say after <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">shipping</span>
          </h2>
          <p className="text-sm sm:text-base text-[#71717a] max-w-[46ch] mx-auto mt-3 leading-relaxed">
            No fluffy promises — just the words of people who watched us deliver.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <StaggerItem
              key={t.name}
              className="group relative rounded-2xl border border-white/[0.08] bg-[#0f0f11] p-8 flex flex-col hover:border-white/[0.16] hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-center justify-between">
                <Quote size={22} className="text-white/10 group-hover:text-cyan-400/40 transition-colors duration-500" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="text-amber-300/80 fill-amber-300/80" />
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm text-[#a1a1aa] leading-relaxed flex-1">
                “{t.quote}”
              </p>

              <div className="mt-7 pt-6 border-t border-white/[0.06] flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.accent} flex items-center justify-center text-xs font-extrabold text-[#09090b]`}>
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-[#71717a]">{t.role}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}