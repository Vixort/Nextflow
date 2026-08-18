'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/animations/Stagger'
import Reveal from '@/components/animations/Reveal'
import { GooeyTextReveal } from '@/components/ui/gooey-text-reveal'
import {
  Globe,
  Cpu,
  Smartphone,
  Boxes,
  ShieldCheck,
  Rocket,
  ArrowUpRight,
  Check,
  Zap,
  Activity,
  Layers,
} from 'lucide-react'

const services = [
  {
    id: '01',
    title: 'Custom Web Platforms',
    icon: Globe,
    color: 'from-cyan-400 to-blue-600',
    description:
      'Awwwards-grade websites and full-scale web platforms built with modern frameworks. Blazing-fast, SEO-optimized, and engineered to scale from launch day.',
    features: ['Enterprise Next.js apps', 'High-performance front-ends', 'Headless CMS & e-commerce'],
  },
  {
    id: '02',
    title: 'SaaS & Cloud Architecture',
    icon: Boxes,
    color: 'from-purple-400 to-indigo-600',
    description:
      'We design resilient, multi-tenant SaaS products — from data modeling and auth to billing, observability, and infrastructure that holds under real load.',
    features: ['Multi-tenant backends', 'Cloud infrastructure (AWS/GCP)', 'CI/CD & observability'],
  },
  {
    id: '03',
    title: 'Mobile Applications',
    icon: Smartphone,
    color: 'from-emerald-400 to-teal-600',
    description:
      'Native and cross-platform mobile apps with a mobile-first philosophy. Seamless UX, offline support, and app-store-ready quality.',
    features: ['iOS & Android', 'React Native / Flutter', 'Push, payments & offline'],
  },
  {
    id: '04',
    title: 'Event Technology',
    icon: Cpu,
    color: 'from-orange-400 to-pink-600',
    description:
      'Hardware and software integration for events — interactive booths, live IoT, real-time telemetry, and immersive digital orchestration.',
    features: ['Interactive booths & kiosks', 'Live IoT & sensors', 'Real-time dashboards'],
  },
  {
    id: '05',
    title: 'Bespoke Software Projects',
    icon: Rocket,
    color: 'from-sky-400 to-cyan-600',
    description:
      'Custom platforms, internal tools, and complex integrations. We turn unique operational challenges into streamlined digital solutions that scale.',
    features: ['Internal tools & portals', 'System integrations', 'Legacy modernization'],
  },
  {
    id: '06',
    title: 'Security & Reliability',
    icon: ShieldCheck,
    color: 'from-amber-400 to-red-600',
    description:
      'Security is not an afterthought. We build SOC-2-minded systems with audit trails, encrypted data, RBAC, and reliability baked into the architecture.',
    features: ['Security audits', 'RBAC & encryption', 'SLOs & uptime guarantees'],
  },
]

const process = [
  { step: '01', title: 'Discover', text: 'We map your goals, users, and constraints to define what success looks like.' },
  { step: '02', title: 'Architect', text: 'We design the system, data model, and UX blueprint before a single line of code.' },
  { step: '03', title: 'Build & Ship', text: 'Fast, iterative delivery with continuous feedback loops and production hardening.' },
  { step: '04', title: 'Scale & Support', text: 'Post-launch monitoring, optimization, and a long-term partnership.' },
]

export default function ServicesPage() {
  return (
    <>
      <main className="min-h-screen bg-[#09090b] text-slate-100 relative overflow-hidden">
        <Navbar />

        {/* ── TIGHT & COHESIVE SERVICES HERO ─────────────────────────────────── */}
        <section className="relative pt-36 pb-20 px-6 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          {/* Ambient Lighting Background */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/[0.07] blur-[140px] rounded-full pointer-events-none" />

          {/* Badge */}
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Nextflow Software House
            </div>
          </Reveal>

          {/* Unified Static Headline with staggered fade-in */}
          <div className="mt-8 overflow-hidden">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                WE
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-purple-400 inline-block"
              >
                DESIGN, BUILD & SHIP.
              </motion.span>
            </h1>
          </div>

          {/* Subtitle & Description */}
          <Reveal direction="up" delay={0.1} className="mt-5 space-y-4 max-w-2xl">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-cyan-400/90">
              Full-Cycle Software Engineering
            </p>

            <p className="text-slate-300 text-base sm:text-xl font-light leading-relaxed">
              A software house that takes your product from a bold idea to production —
              architecture, engineering, and reliability under one roof.
            </p>
          </Reveal>

          {/* Micro Capability Badges */}
          <Reveal direction="up" delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              <Layers size={14} className="text-cyan-400" />
              <span>6 Core Disciplines</span>
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

        {/* ── Services Grid ───────────────────────────────────────── */}
        <section className="relative py-20 px-6 max-w-[1400px] mx-auto border-t border-white/5">
          <div className="mb-12">
            <GooeyTextReveal mode="scroll" start="top 80%" duration={1.2} stagger={0.12}>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-white leading-tight">
                What we do best
              </h2>
            </GooeyTextReveal>
            <Reveal direction="up" delay={0.1}>
              <p className="text-slate-400 mt-4 max-w-xl">
                Six core disciplines that cover the entire lifecycle of a digital product.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <StaggerItem
                  key={service.id}
                  className="group relative p-8 rounded-3xl bg-[#0d0e15] border border-white/5 overflow-hidden hover:bg-[#12141d] hover:border-white/10 transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between"
                >
                  <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-20 blur-[80px] transition-opacity duration-700`} />

                  <div>
                    <div className="flex items-start justify-between relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out">
                        <Icon className="w-6 h-6 text-slate-300 group-hover:text-cyan-400 transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                        /{service.id}
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-white tracking-tight relative z-10">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-slate-400 text-sm leading-relaxed font-light relative z-10">
                      {service.description}
                    </p>

                    <ul className="mt-6 space-y-2.5 relative z-10">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                    <span className="text-xs uppercase tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors font-bold">
                      Learn more
                    </span>
                    <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>

        {/* ── Process ─────────────────────────────────────────────── */}
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

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 px-6 border-t border-white/5">
          <Reveal direction="up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-white leading-tight">
              Ready to build with us?
            </h2>
            <p className="text-slate-400 mt-4 text-lg font-light">
              Tell us about your project. No sales pitch — just technical expertise.
            </p>
            <button className="mt-8 px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-colors active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              Start a conversation
            </button>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  )
}
