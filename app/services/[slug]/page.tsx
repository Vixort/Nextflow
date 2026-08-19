import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  Layers,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getServiceBySlug } from '@/lib/services/catalog'
import { getServices } from '@/lib/services/catalog'
import { GooeyTextReveal } from '@/components/ui/gooey-text-reveal'
import { SERVICE_ICONS, SERVICE_ICON_COLORS, type ServiceIconName } from '@/lib/services/icons'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: 'Service not found | Nextflow' }
  return {
    title: `${service.title} | Nextflow Services`,
    description: service.outcome || service.description,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getServices(true)])
  if (!service) notFound()

  const Icon = SERVICE_ICONS[service.icon as ServiceIconName] ?? SERVICE_ICONS.Globe

  return (
    <>
      <main className="min-h-screen bg-[#09090b] text-slate-100 relative overflow-hidden">
        <Navbar />

        {/* ── Back link ───────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pt-28 sm:pt-32">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={14} /> All services
          </Link>
        </div>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pt-8 pb-12">
          <div className="relative">
            <div className={`absolute -top-10 -left-20 w-72 h-72 bg-gradient-to-br ${service.color} opacity-[0.08] blur-[100px] pointer-events-none`} />

            <div className="relative flex items-center gap-4">
              <Icon className={`w-9 h-9 ${SERVICE_ICON_COLORS[service.color] ?? 'text-cyan-400'}`} strokeWidth={1.75} />
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Service</p>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{service.title}</h1>
              </div>
            </div>

            <p className="mt-6 text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
              {service.description}
            </p>
          </div>
        </section>

        {/* ── Outcome highlight ────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              <Sparkles size={12} /> What you get
            </p>
            <p className="mt-3 text-lg sm:text-2xl text-slate-100 font-semibold leading-relaxed">
              {service.outcome}
            </p>
          </div>
        </section>

        {/* ── Deliverables + side info ─────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-[#0d0e15] p-6 sm:p-8 h-full">
                <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                  <Layers size={15} className="text-cyan-400" /> Included in this service
                </h2>
                <ul className="mt-5 space-y-3">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-200">
                      <Check size={17} className="shrink-0 mt-0.5 text-cyan-400" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#0d0e15] p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Best suited for</h3>
                <div className="mt-4 space-y-2.5">
                  {service.best_for.map((b) => (
                    <div key={b} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-xs sm:text-[13px] text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0d0e15] p-6 flex items-center gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <Clock3 size={18} className="text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Typical timeline</p>
                  <p className="text-sm font-bold text-white mt-1">{service.timeline}</p>
                </div>
              </div>

              {service.features.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-[#0d0e15] p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Key capabilities</h3>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {service.features.map((f) => (
                      <span key={f} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-[#0d0e15] p-8 sm:p-10 text-center relative overflow-hidden">
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-br ${service.color} opacity-10 blur-[90px] pointer-events-none`} />
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight relative">Ready to start?</h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base font-light max-w-xl mx-auto relative">
              Tell us about your project — no sales pitch, a real engineer replies within 1–2 business days.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
              <Link
                href={`/contact?service=${encodeURIComponent(service.contact_service)}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-extrabold transition-colors active:scale-[0.98] shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              >
                Start this project <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-bold transition-colors active:scale-[0.98]"
              >
                <MessageSquare size={15} /> Just have questions
              </Link>
            </div>
          </div>
        </section>

        {/* ── Other services ───────────────────────────────────── */}
        {allServices.length > 1 && (
          <section className="max-w-5xl mx-auto px-6 pb-24">
            <GooeyTextReveal mode="scroll" start="top 85%" duration={1.1} stagger={0.1}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">Other services</h2>
            </GooeyTextReveal>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allServices
                .filter((s) => s.slug !== service.slug)
                .map((s) => {
                  const SIcon = SERVICE_ICONS[s.icon as ServiceIconName] ?? SERVICE_ICONS.Globe
                  return (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#0d0e15] p-5 hover:border-white/15 hover:bg-[#12141d] transition-all duration-300"
                    >
                      <SIcon className={`w-7 h-7 shrink-0 ${SERVICE_ICON_COLORS[s.color] ?? 'text-cyan-400'}`} strokeWidth={1.75} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{s.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.timeline}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </Link>
                  )
                })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}