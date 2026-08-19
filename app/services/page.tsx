import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import Reveal from '@/components/animations/Reveal'
import { GooeyTextReveal } from '@/components/ui/gooey-text-reveal'
import {
  ArrowUpRight,
  Check,
  Zap,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { getServices } from '@/lib/services/catalog'
import { SERVICE_ICONS, SERVICE_ICON_COLORS, type ServiceIconName } from '@/lib/services/icons'

export const dynamic = 'force-dynamic'

const process = [
  { step: '01', title: 'Discover', text: 'We map your goals, users, and constraints to define what success looks like.' },
  { step: '02', title: 'Architect', text: 'We design the system, data model, and UX blueprint before a single line of code.' },
  { step: '03', title: 'Build & Ship', text: 'Fast, iterative delivery with continuous feedback loops and production hardening.' },
  { step: '04', title: 'Scale & Support', text: 'Post-launch monitoring, optimization, and a long-term partnership.' },
]

export default async function ServicesPage() {
  const services = await getServices(true)

  return (
    <>
      <main className="min-h-screen bg-[#09090b] text-slate-100 relative overflow-hidden">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-20 px-6 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/[0.07] blur-[140px] rounded-full pointer-events-none" />

          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Nextflow Software House
            </div>
          </Reveal>

          <div className="mt-8 overflow-hidden">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <Reveal direction="up">
                <span>WE</span>
              </Reveal>
              <Reveal direction="up" delay={0.15}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-purple-400 inline-block">
                  DESIGN, BUILD & SHIP.
                </span>
              </Reveal>
            </h1>
          </div>

          <Reveal direction="up" delay={0.1} className="mt-5 space-y-4 max-w-2xl">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-cyan-400/90">
              Full-Cycle Software Engineering
            </p>
            <p className="text-slate-300 text-base sm:text-xl font-light leading-relaxed">
              A software house that takes your product from a bold idea to production —
              architecture, engineering, and reliability under one roof.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Layers size={14} className="text-cyan-400" />
              <span>{services.length} Core Disciplines</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Zap size={14} className="text-amber-400" />
              <span>&lt; 200ms Telemetry</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Activity size={14} className="text-emerald-400" />
              <span>99.99% Uptime SLA</span>
            </div>
          </Reveal>
        </section>

        {/* ── SERVICES GRID ────────────────────────────────────── */}
        <section className="relative py-20 px-6 max-w-[1400px] mx-auto border-t border-white/5">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <GooeyTextReveal mode="scroll" start="top 80%" duration={1.2} stagger={0.12}>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-white leading-tight">
                  What we do best
                </h2>
              </GooeyTextReveal>
              <Reveal direction="up" delay={0.1}>
                <p className="text-slate-400 mt-4 max-w-xl">
                  {services.length} core disciplines that cover the entire lifecycle of a digital product.
                </p>
              </Reveal>
            </div>
            <Reveal direction="up" delay={0.15}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
              >
                Not sure what you need?
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => {
              const Icon = SERVICE_ICONS[service.icon as ServiceIconName] ?? SERVICE_ICONS.Globe
              const iconColor = SERVICE_ICON_COLORS[service.color] ?? 'text-cyan-400'
              return (
                <StaggerItem key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative flex flex-col justify-between h-full p-8 rounded-3xl bg-[#0d0e15] border border-white/5 overflow-hidden hover:bg-[#12141d] hover:border-white/15 transition-all duration-300 active:scale-[0.98] block"
                  >
                    {/* Ambient gradient glow */}
                    <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br ${service.color} opacity-[0.08] group-hover:opacity-25 blur-[80px] transition-opacity duration-700`} />
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <Icon className={`w-7 h-7 ${iconColor} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out`} strokeWidth={1.75} />
                        <span className="text-3xl font-black text-white/[0.06] group-hover:text-white/[0.12] transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="mt-6 text-2xl font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-slate-400 text-sm leading-relaxed font-light">
                        {service.description}
                      </p>

                      <ul className="mt-6 space-y-2.5">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors font-bold">
                        Learn more
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>

        {/* ── PROCESS ──────────────────────────────────────────── */}
        <section className="py-20 px-6 max-w-[1400px] mx-auto border-t border-white/5">
          <div className="mb-12 text-center">
            <GooeyTextReveal mode="scroll" start="top 85%" duration={1.2} stagger={0.12}>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-white leading-tight">
                How we work
              </h2>
            </GooeyTextReveal>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" amount={0.1}>
            {process.map((item) => (
              <StaggerItem
                key={item.step}
                className="relative p-8 rounded-3xl bg-[#0d0e15] border border-white/5 hover:border-cyan-500/40 transition-colors duration-300"
              >
                <span className="text-5xl font-black text-white/5 group-hover:text-cyan-400/20">{item.step}</span>
                <h3 className="mt-4 text-xl font-bold text-white tracking-tight">{item.title}</h3>
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-24 px-6 border-t border-white/5">
          <Reveal direction="up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-white leading-tight">
              Ready to build with us?
            </h2>
            <p className="text-slate-400 mt-4 text-lg font-light">
              Tell us about your project. No sales pitch — just technical expertise.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-colors active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              Start a conversation <ArrowRight size={16} />
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  )
}
