'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import DashboardMockup from './DashboardMockup'

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } })

      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1 }
      )
        .fromTo(
          '.hero-body',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.7'
        )
        .fromTo(
          ctaRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          imageRef.current,
          { y: 30, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' },
          '-=0.8'
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full flex flex-col overflow-hidden px-6 sm:px-12 pt-32 pb-20 bg-[#09090b] select-none"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes aurora1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.1); }
          66% { transform: translate(30px, -30px) scale(0.9); }
        }
      `}} />

      {/* Background Detail */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Aurora Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-70">
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'aurora1 15s ease-in-out infinite' }} />
          <div className="absolute top-[5%] right-[20%] w-[450px] h-[450px] bg-violet-500/10 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'aurora2 18s ease-in-out infinite' }} />
          <div className="absolute -top-[10%] left-[40%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'aurora1 20s ease-in-out infinite reverse' }} />
        </div>

        {/* Subtle grid pattern over the aurora */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_50%,transparent_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full">

        {/* Typography block — left-aligned, tight leading, solid white */}
        <div className="max-w-3xl">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.92] text-white"
          >
            Crafting digital<br />
            products that scale.
          </h1>

          <p className="hero-body mt-6 text-base sm:text-lg text-[#a1a1aa] max-w-[52ch] leading-relaxed">
            We design and build high-performance web platforms, scalable SaaS architectures, and real-time systems that hold up under pressure.
          </p>

          <div ref={ctaRef} className="mt-8 flex items-center gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-white text-[#09090b] text-sm font-medium tracking-tight transition-colors duration-200 hover:bg-[#e4e4e7] active:scale-[0.98]"
            >
              View our work
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-[rgba(255,255,255,0.1)] text-[#a1a1aa] text-sm font-medium tracking-tight transition-colors duration-200 hover:text-white hover:border-[rgba(255,255,255,0.2)] active:scale-[0.98]"
            >
              Our capabilities
            </a>
          </div>
        </div>

        {/* Product screenshot — single large image, no fake UI */}
        <div
          ref={imageRef}
          className="mt-16 w-full rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_-12px_rgba(0,0,0,0.5)]"
        >
          <DashboardMockup />
        </div>

      </div>
    </section>
  )
}
