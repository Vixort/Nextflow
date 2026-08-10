'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import CinematicHero from '@/components/CinematicHero'
import SocialProofSection from '@/components/SocialProofSection'
import ValueProposition from '@/components/ValueProposition'
import WhyUsSection from '@/components/WhyUsSection'
import ServicesSection from '@/components/ServicesSection'
import PortfolioSection from '@/components/PortfolioSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import DynamicCustomSection, { CustomSectionData } from '@/components/DynamicCustomSection'

const DEFAULT_SECTIONS: CustomSectionData[] = [
  { id: 'hero', name: 'Cinematic Hero Banner', type: 'builtin', order: 1, visible: true, is_builtin: true },
  { id: 'social_proof', name: 'Social Proof & Trusted Logos', type: 'builtin', order: 2, visible: true, is_builtin: true },
  { id: 'value_prop', name: 'Value Proposition Bento Grid', type: 'builtin', order: 3, visible: true, is_builtin: true },
  { id: 'why_us', name: 'Why Us (Problem vs Solution)', type: 'builtin', order: 4, visible: true, is_builtin: true },
  { id: 'services', name: 'Services & Capabilities', type: 'builtin', order: 5, visible: true, is_builtin: true },
  { id: 'portfolio', name: 'Portfolio & Case Studies', type: 'builtin', order: 6, visible: true, is_builtin: true },
  { id: 'final_cta', name: 'Final Conversion CTA Banner', type: 'builtin', order: 7, visible: true, is_builtin: true },
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
            // Sort by order ascending
            const sorted = [...data.sections].sort((a, b) => (a.order || 0) - (b.order || 0))
            setSections(sorted)
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
        case 'social_proof':
          return <SocialProofSection key={sec.id} />
        case 'value_prop':
          return <ValueProposition key={sec.id} />
        case 'why_us':
          return <WhyUsSection key={sec.id} />
        case 'services':
          return <ServicesSection key={sec.id} />
        case 'portfolio':
          return <PortfolioSection key={sec.id} />
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
    <>
      <main className="min-h-screen bg-[#09090b] text-slate-100 relative overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Section Renderer */}
        {sections.map(sec => renderSectionComponent(sec))}
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
