'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: 'Event Flow',
    category: 'Interactive Event Platform',
    description: 'Real-time attendee analytics and engagement tracking for enterprise conferences serving 10K+ participants.',
    image: '/portfolio_event.jpg',
  },
  {
    id: 2,
    title: 'Alpex Trading',
    category: 'Fintech Web Application',
    description: 'High-frequency trading dashboard with portfolio management, market data feeds, and SOC 2 compliant infrastructure.',
    image: '/portfolio_fintech.jpg',
  },
  {
    id: 3,
    title: 'Vitality',
    category: 'Mobile Application',
    description: 'Cross-platform health tracking app with workout analytics, nutrition logging, and wearable device integration.',
    image: '/portfolio_mobile.jpg',
  }
]

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo('.portfolio-header',
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    )

    gsap.fromTo('.portfolio-card',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15,
        scrollTrigger: { trigger: '.portfolio-grid', start: 'top 85%' }
      }
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="portfolio" className="relative bg-[#09090b] py-24 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">

        {/* Header */}
        <div className="portfolio-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white leading-[0.92]">
              Selected work
            </h2>
            <p className="text-[#a1a1aa] text-base max-w-md mt-3 leading-relaxed">
              Recent projects where our architecture decisions directly impacted business outcomes.
            </p>
          </div>
          <a
            href="#portfolio"
            className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors"
          >
            View all projects →
          </a>
        </div>

        {/* Project Grid — vertical stacked cards */}
        <div className="portfolio-grid space-y-px">
          {projects.map((project) => (
            <div
              key={project.id}
              className="portfolio-card group cursor-pointer"
            >
              <div className="relative w-full overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f11]">
                {/* Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {/* Subtle bottom gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent opacity-60" />
                </div>

                {/* Info bar */}
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#71717a] mt-1 max-w-lg">
                      {project.description}
                    </p>
                  </div>
                  <span className="text-xs text-[#52525b] font-medium tracking-wide uppercase shrink-0">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
