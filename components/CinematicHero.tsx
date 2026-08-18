'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import { usePageLoaded } from './Preloader'

const DashboardMockup = dynamic(
  () => import('./DashboardMockup'),
  { ssr: false, loading: () => null }
)

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [showMockup, setShowMockup] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -260])

  useEffect(() => {
    const el = imageRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowMockup(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const loaded = usePageLoaded()

  useEffect(() => {
    if (!loaded) return
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
  }, [loaded])

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
        @keyframes beamspin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes scrolltick {
          0% { transform: translateY(0); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateY(14px); opacity: 0; }
        }
      `}} />

      {/* Background Detail */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Aurora Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-70">
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'aurora1 15s ease-in-out infinite', willChange: 'transform' }} />
          <div className="absolute top-[5%] right-[20%] w-[450px] h-[450px] bg-violet-500/10 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'aurora2 18s ease-in-out infinite', willChange: 'transform' }} />
          <div className="absolute -top-[10%] left-[40%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'aurora1 20s ease-in-out infinite reverse', willChange: 'transform' }} />
        </div>

        {/* Subtle grid pattern over the aurora */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_50%,transparent_100%)]" />

        {/* Rotating conic beam behind the mockup */}
        <div className="absolute left-1/2 top-[45%] w-[900px] h-[900px] opacity-25 pointer-events-none" style={{ animation: 'beamspin 40s linear infinite' }}>
          <div className="absolute inset-0 rounded-full [background:conic-gradient(from_0deg,transparent_0deg,rgba(56,189,248,0.16)_60deg,transparent_140deg,transparent_200deg,rgba(139,92,246,0.12)_260deg,transparent_360deg)] blur-[80px]" />
        </div>

        {/* Film-grain noise */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
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
        <motion.div
          ref={imageRef}
          style={{ y: mockupY }}
          className="mt-16 w-full rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_-12px_rgba(0,0,0,0.5)]"
        >
          {showMockup ? (
            <DashboardMockup />
          ) : (
            <div className="h-[800px]" aria-hidden="true" />
          )}
        </motion.div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2.5 pointer-events-none">
          <div className="w-6 h-10 rounded-full border border-white/15 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-cyan-400/80" style={{ animation: 'scrolltick 1.8s ease-in-out infinite' }} />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#52525b]">Scroll</span>
        </div>

      </div>
    </section>
  )
}
