'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import CinematicHero from '@/components/CinematicHero'
import ManifestoSection from '@/components/ManifestoSection'
import SocialProofSection from '@/components/SocialProofSection'
import EventsShowcaseSection from '@/components/EventsShowcaseSection'
import Footer from '@/components/Footer'
import { Preloader, usePageLoaded } from '@/components/Preloader'
import DynamicCustomSection, { CustomSectionData } from '@/components/DynamicCustomSection'

const ValueProposition = dynamic(() => import('@/components/ValueProposition'))
const WhyUsSection = dynamic(() => import('@/components/WhyUsSection'))
const ServicesSection = dynamic(() => import('@/components/ServicesSection'))
const PortfolioSection = dynamic(() => import('@/components/PortfolioSection'))
const StatsSection = dynamic(() => import('@/components/StatsSection'))
const ProcessSection = dynamic(() => import('@/components/ProcessSection'))
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'))
const FinalCTA = dynamic(() => import('@/components/FinalCTA'))

const DEFAULT_SECTIONS: CustomSectionData[] = [
  { id: 'hero', name: 'Cinematic Hero Banner', type: 'builtin', order: 1, visible: true, is_builtin: true },
  { id: 'manifesto', name: 'Manifesto Statement', type: 'builtin', order: 2, visible: true, is_builtin: true },
  { id: 'social_proof', name: 'Social Proof & Trusted Logos', type: 'builtin', order: 3, visible: true, is_builtin: true },
  { id: 'value_prop', name: 'Value Proposition Bento Grid', type: 'builtin', order: 4, visible: true, is_builtin: true },
  { id: 'stats', name: 'Animated Stats Band', type: 'builtin', order: 5, visible: true, is_builtin: true },
  { id: 'why_us', name: 'Why Us (Problem vs Solution)', type: 'builtin', order: 6, visible: true, is_builtin: true },
  { id: 'process', name: 'Process (How We Work)', type: 'builtin', order: 7, visible: true, is_builtin: true },
  { id: 'services', name: 'Services & Capabilities', type: 'builtin', order: 8, visible: true, is_builtin: true },
  { id: 'portfolio', name: 'Portfolio & Case Studies', type: 'builtin', order: 9, visible: true, is_builtin: true },
  { id: 'testimonials', name: 'Client Testimonials', type: 'builtin', order: 10, visible: true, is_builtin: true },
  { id: 'events', name: 'Immersive Events Showcase', type: 'builtin', order: 11, visible: true, is_builtin: true },
  { id: 'final_cta', name: 'Final Conversion CTA Banner', type: 'builtin', order: 12, visible: true, is_builtin: true },
]

export default function HomeClient() {
  const [sections, setSections] = useState<CustomSectionData[]>(DEFAULT_SECTIONS)

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch('/api/admin/sections')
        if (res.ok) {
          const { data } = await res.json()
          if (data?.sections && Array.isArray(data.sections) && data.sections.length > 0) {
            const sorted = [...data.sections]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
            if (sorted.length > 0) {
              setSections(sorted)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load home layout sections:', err)
      }
    }
    fetchSections()
  }, [])

  const renderSectionComponent = (sec: CustomSectionData) => {
    if (!sec.visible) return null

    if (sec.is_builtin) {
      switch (sec.id) {
        case 'hero':
          return <CinematicHero key={sec.id} />
        case 'manifesto':
          return <ManifestoSection key={sec.id} />
        case 'social_proof':
          return <SocialProofSection key={sec.id} />
        case 'value_prop':
          return <ValueProposition key={sec.id} />
        case 'stats':
          return <StatsSection key={sec.id} />
        case 'why_us':
          return <WhyUsSection key={sec.id} />
        case 'process':
          return <ProcessSection key={sec.id} />
        case 'services':
          return <ServicesSection key={sec.id} />
        case 'portfolio':
          return <PortfolioSection key={sec.id} />
        case 'testimonials':
          return <TestimonialsSection key={sec.id} />
        case 'events':
          return <EventsShowcaseSection key={sec.id} />
        case 'final_cta':
          return <FinalCTA key={sec.id} />
        default:
          return null
      }
    }

    // Custom No-Code Section
    return <DynamicCustomSection key={sec.id} section={sec} />
  }

  return (
    <Preloader>
      <HomeContent sections={sections} renderSection={renderSectionComponent} />
    </Preloader>
  )
}

function HomeContent({
  sections,
  renderSection,
}: {
  sections: CustomSectionData[]
  renderSection: (sec: CustomSectionData) => ReactNode
}) {
  const loaded = usePageLoaded()

  return (
    <>
      <main className={`min-h-screen bg-[#09090b] text-slate-100 relative ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Section Renderer */}
        {sections.map(sec => renderSection(sec))}
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
