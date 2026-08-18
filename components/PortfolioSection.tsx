'use client'

import Reveal from './animations/Reveal'
import { CylinderCarousel } from './ui/cylinder-carousel'

const carouselImages = [
  { src: '/images/events/tech-summit.jpg', alt: 'Global AI & Autonomous Tech Summit' },
  { src: '/portfolio_fintech.jpg', alt: 'Alpex Trading fintech dashboard' },
  { src: '/images/events/neon-concert.jpg', alt: 'Neon Odyssey Cyber Sound Festival' },
  { src: '/portfolio_mobile.jpg', alt: 'Vitality mobile app' },
  { src: '/images/events/esports-arena.jpg', alt: 'World Esports Championship' },
  { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80', alt: 'Software development team collaborating' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', alt: 'Engineering team at work' },
  { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', alt: 'Tech conference keynote' },
  { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', alt: 'Developers building software' },
  { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', alt: 'Team strategy meeting' },
  { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', alt: 'Engineer reviewing code' },
  { src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80', alt: 'Software architecture planning' },
  { src: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80', alt: 'Modern web application development' },
  { src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80', alt: 'Laptop with code on dark desk' },
  { src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80', alt: 'Programming and coding' },
  { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80', alt: 'Team working on technology' },
  { src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80', alt: 'Esports gaming setup' },
]

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="relative bg-[#09090b] py-24 border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header */}
        <Reveal direction="up" className="text-center mb-4 flex flex-col items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white leading-[0.92]">
              Our work in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">motion</span>
            </h2>
            <p className="text-[#a1a1aa] text-base max-w-xl mx-auto mt-3 leading-relaxed">
              From immersive event experiences to mission-critical software — a glimpse of what we build and where it runs.
            </p>
          </div>
        </Reveal>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-cyan-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

        {/* 3D Cylinder Carousel */}
        <Reveal direction="up" className="relative">
          <CylinderCarousel
            images={carouselImages}
            animationDuration={34}
            cardWidth={280}
          />
        </Reveal>
      </div>
    </section>
  )
}
