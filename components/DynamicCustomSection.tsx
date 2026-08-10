'use client'

import React, { useState } from 'react'
import { ArrowRight, ChevronDown, Check, Sparkles, Star, Zap, Info } from 'lucide-react'
import Link from 'next/link'

export interface CustomSectionData {
  id: string
  name: string
  type: string
  order: number
  visible: boolean
  is_builtin: boolean
  custom_data?: {
    template_type: 'banner' | 'bento' | 'testimonials' | 'faq' | 'pricing' | 'raw_html'
    title?: string
    subtitle?: string
    badge?: string
    cta_text?: string
    cta_link?: string
    image_url?: string
    items?: Array<{
      title?: string
      description?: string
      icon?: string
      author?: string
      role?: string
      avatar?: string
      price?: string
      period?: string
      features?: string[]
      highlight?: boolean
    }>
    html_content?: string
  }
}

export default function DynamicCustomSection({ section }: { section: CustomSectionData }) {
  if (!section.visible) return null
  const data = section.custom_data

  if (!data) return null

  switch (data.template_type) {
    case 'banner':
      return <CustomBannerSection data={data} />
    case 'bento':
      return <CustomBentoSection data={data} />
    case 'testimonials':
      return <CustomTestimonialsSection data={data} />
    case 'faq':
      return <CustomFaqSection data={data} />
    case 'pricing':
      return <CustomPricingSection data={data} />
    case 'raw_html':
      return <CustomHtmlSection data={data} />
    default:
      return null
  }
}

/* ═══════════════════════════════════════════════════════════
   1. CUSTOM BANNER SECTION
   ═══════════════════════════════════════════════════════════ */

function CustomBannerSection({ data }: { data: NonNullable<CustomSectionData['custom_data']> }) {
  return (
    <section className="py-20 px-6 sm:px-12 relative overflow-hidden bg-[#090a0f] border-b border-white/5">
      <div className="max-w-7xl mx-auto rounded-2xl p-8 sm:p-12 relative bg-[#0f111a]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            {data.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <Sparkles size={12} /> {data.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {data.title || 'Custom Section Banner'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {data.subtitle || 'Custom content added dynamically from Nextflow Admin Dashboard.'}
            </p>
            {data.cta_text && (
              <div className="pt-2">
                <Link
                  href={data.cta_link || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-200 transition-all active:scale-95 shadow-lg"
                >
                  <span>{data.cta_text}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
          {data.image_url && (
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl max-h-80">
              <img src={data.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   2. CUSTOM BENTO GRID SECTION
   ═══════════════════════════════════════════════════════════ */

function CustomBentoSection({ data }: { data: NonNullable<CustomSectionData['custom_data']> }) {
  const items = data.items || []
  return (
    <section className="py-20 px-6 sm:px-12 bg-[#090a0f] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {data.badge && <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{data.badge}</span>}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{data.title || 'Feature Highlights'}</h2>
          <p className="text-slate-400 text-sm">{data.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-[#0f111a]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title || `Feature ${i + 1}`}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description || 'Feature description details.'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. CUSTOM TESTIMONIALS SECTION
   ═══════════════════════════════════════════════════════════ */

function CustomTestimonialsSection({ data }: { data: NonNullable<CustomSectionData['custom_data']> }) {
  const items = data.items || []
  return (
    <section className="py-20 px-6 sm:px-12 bg-[#090a0f] border-b border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{data.title || 'Client Testimonials'}</h2>
          <p className="text-slate-400 text-sm">{data.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-[#0f111a]/80 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{item.description || 'Great product experience!'}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                {item.avatar ? (
                  <img src={item.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-cyan-500/30" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xs">
                    {item.author?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{item.author || 'Client Name'}</h4>
                  <p className="text-[10px] text-slate-400">{item.role || 'Partner'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   4. CUSTOM FAQ SECTION
   ═══════════════════════════════════════════════════════════ */

function CustomFaqSection({ data }: { data: NonNullable<CustomSectionData['custom_data']> }) {
  const items = data.items || []
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#090a0f] border-b border-white/5">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{data.title || 'Frequently Asked Questions'}</h2>
          <p className="text-slate-400 text-sm">{data.subtitle}</p>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl bg-[#0f111a]/80 border border-white/10 overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between hover:bg-white/[0.02]"
              >
                <span>{item.title || `Question ${i + 1}`}</span>
                <ChevronDown size={16} className={`text-cyan-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="p-4 pt-0 text-xs text-slate-400 border-t border-white/5 leading-relaxed">
                  {item.description || 'Answer details.'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   5. CUSTOM PRICING SECTION
   ═══════════════════════════════════════════════════════════ */

function CustomPricingSection({ data }: { data: NonNullable<CustomSectionData['custom_data']> }) {
  const items = data.items || []
  return (
    <section className="py-20 px-6 sm:px-12 bg-[#090a0f] border-b border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{data.title || 'Simple Pricing Plans'}</h2>
          <p className="text-slate-400 text-sm">{data.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className={`p-6 rounded-2xl border relative flex flex-col justify-between ${
              item.highlight ? 'bg-[#0f111a] border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'bg-[#0f111a]/80 border-white/10'
            }`}>
              {item.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-cyan-500 text-slate-950">
                  Popular
                </span>
              )}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{item.title || 'Basic Plan'}</h3>
                <div>
                  <span className="text-3xl font-extrabold text-white">{item.price || '$29'}</span>
                  <span className="text-xs text-slate-400">/{item.period || 'mo'}</span>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  {item.features?.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <Check size={14} className="text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6">
                <button className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  item.highlight ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   6. CUSTOM RAW HTML / ANNOUNCEMENT SECTION
   ═══════════════════════════════════════════════════════════ */

function CustomHtmlSection({ data }: { data: NonNullable<CustomSectionData['custom_data']> }) {
  if (!data.html_content) return null
  return (
    <section className="py-12 px-6 sm:px-12 bg-[#090a0f] border-b border-white/5">
      <div className="max-w-7xl mx-auto rounded-xl p-6 bg-[#0f111a]/80 border border-white/10 text-slate-200">
        <div dangerouslySetInnerHTML={{ __html: data.html_content }} />
      </div>
    </section>
  )
}
