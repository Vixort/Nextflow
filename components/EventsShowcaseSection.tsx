'use client'

import { useState } from 'react'
import { Sparkles, Calendar, MapPin, Users, ArrowUpRight, Filter, ShieldCheck, Zap, X } from 'lucide-react'

type EventCategory = 'ALL' | 'TECH' | 'MUSIC' | 'GALA' | 'ESPORTS'

interface EventItem {
  id: string
  category: EventCategory
  categoryLabel: string
  title: string
  subtitle: string
  location: string
  date: string
  attendees: string
  image: string
  gridSpan: string
  badge: string
  specs: {
    stageTech: string
    avOutput: string
    latency: string
    infrastructure: string
  }
}

const EVENTS_DATA: EventItem[] = [
  {
    id: 'tech-summit',
    category: 'TECH',
    categoryLabel: 'Tech Summit',
    title: 'Global AI & Autonomous Tech Summit 2026',
    subtitle: 'High-frequency keynote stage featuring 3D holographic projection, sub-millisecond telemetry, and live multi-screen data streaming.',
    location: 'TOKYO • SINGAPORE',
    date: 'OCTOBER 14-16, 2026',
    attendees: '14,500+ ATTENDEES',
    image: '/images/events/tech-summit.jpg',
    gridSpan: 'lg:col-span-2 lg:row-span-2',
    badge: 'LIVE KEYNOTE STAGE',
    specs: {
      stageTech: '3D Holographic 8K LED Mesh',
      avOutput: '120 FPS Real-time Render Engine',
      latency: '< 2ms Ultra-Low Telemetry',
      infrastructure: 'Zero-Trust Redundant Cloud'
    }
  },
  {
    id: 'neon-concert',
    category: 'MUSIC',
    categoryLabel: 'Music Festival',
    title: 'Neon Odyssey Cyber Sound Festival',
    subtitle: 'Ultra-luxury festival mainstage engineered with high-intensity laser arrays and immersive spatial audio.',
    location: 'AMSTERDAM • IBIZA',
    date: 'AUGUST 22-24, 2026',
    attendees: '48,000+ REVELERS',
    image: '/images/events/neon-concert.jpg',
    gridSpan: 'lg:col-span-1 lg:row-span-2',
    badge: 'CYBER MAINSTAGE',
    specs: {
      stageTech: '500+ Synchronized Laser Beams',
      avOutput: '360° Dolby Atmos Spatial Sound',
      latency: 'Sub-ms Pyro Control',
      infrastructure: 'Off-Grid Renewable Energy'
    }
  },
  {
    id: 'design-gala',
    category: 'GALA',
    categoryLabel: 'Luxury Gala',
    title: 'Haute Couture Architectural Monograph Gala',
    subtitle: 'Private black-tie banquet celebrating architectural permanence and bespoke luxury design.',
    location: 'PARIS • MILAN',
    date: 'NOVEMBER 08, 2026',
    attendees: '850 VIP GUESTS',
    image: '/images/events/design-gala.jpg',
    gridSpan: 'lg:col-span-1 lg:row-span-1',
    badge: 'EXCLUSIVE VIP GALA',
    specs: {
      stageTech: 'Mirrored Crystal Runway',
      avOutput: 'Champagne Bronze Ambient Glow',
      latency: 'Private Encrypted Guest Intake',
      infrastructure: 'Bespoke Concierge Engine'
    }
  },
  {
    id: 'esports-arena',
    category: 'ESPORTS',
    categoryLabel: 'eSports Arena',
    title: 'World Esports Championship Stadium Final',
    subtitle: 'Stadium arena hosting 80,000 fans with curved perimeter LED panels and instant replay sync.',
    location: 'LOS ANGELES, CA',
    date: 'DECEMBER 02-04, 2026',
    attendees: '82,000+ STADIUM FANS',
    image: '/images/events/esports-arena.jpg',
    gridSpan: 'lg:col-span-2 lg:row-span-1',
    badge: 'WORLD CHAMPIONSHIP',
    specs: {
      stageTech: '360° Curved LED Arena Matrix',
      avOutput: '4K 240Hz Instant Replay Stream',
      latency: 'Zero-Jitter Tournament Network',
      infrastructure: 'Multi-Region Broadcast SLA'
    }
  }
]

export default function EventsShowcaseSection() {
  const [activeTab, setActiveTab] = useState<EventCategory>('ALL')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)

  const filteredEvents = activeTab === 'ALL'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(e => e.category === activeTab)

  return (
    <section className="py-28 px-6 sm:px-12 bg-[#06070a] border-t border-white/5 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[400px] bg-purple-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>Immersive Experiences & Global Events 2026</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              Architecting Extraordinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-300">Realities</span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              From high-frequency AI tech summits to cyber neon mainstages and haute couture galas, Nextflow powers next-generation event production & digital orchestration.
            </p>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Events ({EVENTS_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('TECH')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'TECH'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Tech Summits
            </button>
            <button
              onClick={() => setActiveTab('MUSIC')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'MUSIC'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Music Festivals
            </button>
            <button
              onClick={() => setActiveTab('GALA')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'GALA'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Luxury Galas
            </button>
            <button
              onClick={() => setActiveTab('ESPORTS')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ESPORTS'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              eSports Arenas
            </button>
          </div>
        </div>

        {/* ASYMMETRIC BENTO SHOWCASE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0d0e15] shadow-2xl transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)] cursor-pointer flex flex-col justify-between p-6 sm:p-8 ${event.gridSpan}`}
            >
              {/* Background Image with Zoom & Dark Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/60 to-transparent" />
                <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Top Badges */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  {event.badge}
                </span>

                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-400 transition-all duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 space-y-3 mt-auto">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <MapPin size={13} /> {event.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Users size={13} /> {event.attendees}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {event.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" /> {event.date}
                  </span>
                  <span className="text-xs font-extrabold text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore Specs →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENT SPECS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0d0f19] border border-cyan-500/40 shadow-2xl overflow-hidden relative">
            {/* Modal Header Image Banner */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f19] via-[#0d0f19]/40 to-transparent" />
              
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider">
                  {selectedEvent.categoryLabel} Specifications
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedEvent.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} /> Stage Technology
                  </span>
                  <p className="text-xs font-extrabold text-white">{selectedEvent.specs.stageTech}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> A/V Output SLA
                  </span>
                  <p className="text-xs font-extrabold text-white">{selectedEvent.specs.avOutput}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={12} /> Telemetry Latency
                  </span>
                  <p className="text-xs font-extrabold text-white">{selectedEvent.specs.latency}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <Users size={12} /> Infrastructure
                  </span>
                  <p className="text-xs font-extrabold text-white">{selectedEvent.specs.infrastructure}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  📍 {selectedEvent.location} • 👥 {selectedEvent.attendees}
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  Close Specifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
