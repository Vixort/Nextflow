'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MonitorSmartphone, Cpu, Blocks, Rocket } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    id: '01',
    title: 'Custom Website Development',
    description: 'Awwwards-grade websites crafted with modern frameworks. We build blazingly fast, SEO-optimized, and visually stunning digital experiences tailored to your brand.',
    icon: MonitorSmartphone,
    color: 'from-cyan-400 to-blue-600',
    colSpan: 'lg:col-span-8',
    visual: 'grid', // flag for visual variation
  },
  {
    id: '02',
    title: 'Event Tech',
    description: 'Hardware and software integration for events. Interactive booths & live IoT.',
    icon: Cpu,
    color: 'from-purple-400 to-indigo-600',
    colSpan: 'lg:col-span-4',
    visual: 'minimal',
  },
  {
    id: '03',
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps. Designed with a mobile-first philosophy ensuring seamless UX.',
    icon: Rocket,
    color: 'from-emerald-400 to-teal-600',
    colSpan: 'lg:col-span-5',
    visual: 'minimal',
  },
  {
    id: '04',
    title: 'Bespoke Software Projects',
    description: 'Custom platforms, internal tools, and complex integrations. We turn your unique operational challenges into streamlined digital solutions that scale.',
    icon: Blocks,
    color: 'from-orange-400 to-pink-600',
    colSpan: 'lg:col-span-7',
    visual: 'glow',
  }
]

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.service-card')
    
    gsap.fromTo(cards, 
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    )

    gsap.fromTo('.service-header',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      }
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="services" className="relative py-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="service-header mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 leading-tight">
            Our Expertise. <br />
            <span className="text-slate-600 font-light tracking-tight">Engineered for Impact.</span>
          </h2>
        </div>
        <p className="text-slate-400 max-w-sm text-lg font-light leading-relaxed">
          We bridge the gap between creative design and complex engineering, delivering solutions that captivate users and drive results.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 relative z-10">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <div 
              key={service.id}
              className={`service-card group relative p-8 md:p-10 rounded-3xl bg-[#0d0e15] border border-white/5 overflow-hidden hover:bg-[#12141d] hover:border-white/10 transition-all duration-300 active:scale-[0.98] cursor-crosshair flex flex-col justify-between min-h-[320px] ${service.colSpan} md:col-span-1`}
            >
              {/* Visual Diversity Backgrounds */}
              {service.visual === 'grid' && (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 group-hover:opacity-40 transition-opacity" />
              )}
              {service.visual === 'glow' && (
                <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br ${service.color} opacity-5 blur-[80px] group-hover:opacity-20 transition-opacity duration-700`} />
              )}

              {/* Hover Gradient Spotlight (Microinteraction) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300`} />
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-12 relative z-10">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out">
                  <Icon className="w-7 h-7 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 mb-2 block opacity-50 group-hover:opacity-100 transition-opacity">/{service.id}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight max-w-[250px]">
                    {service.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-400 leading-relaxed font-light text-base max-w-lg group-hover:text-slate-300 transition-colors duration-300 relative z-10">
                {service.description}
              </p>

              {/* Action arrow (Microinteraction) */}
              <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out z-10">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
