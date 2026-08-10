'use client'

import { useEffect, useRef } from 'react'

export default function LiquidHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Fluid particles / blobs configuration for futuristic Aurora Violet & Cyan
    const blobs = [
      { x: width * 0.3, y: height * 0.4, vx: 0.5, vy: 0.3, radius: 280, color: 'rgba(124, 92, 255, 0.45)' },   // Violet
      { x: width * 0.7, y: height * 0.6, vx: -0.4, vy: -0.5, radius: 320, color: 'rgba(6, 182, 212, 0.4)' },   // Cyan
      { x: width * 0.5, y: height * 0.3, vx: 0.3, vy: -0.4, radius: 250, color: 'rgba(59, 130, 246, 0.35)' },  // Blue
      { x: width * 0.4, y: height * 0.7, vx: -0.5, vy: 0.4, radius: 290, color: 'rgba(168, 85, 247, 0.35)' },  // Purple
    ]

    let time = 0

    const render = () => {
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      // Move & deform blobs smoothly
      blobs.forEach((blob, idx) => {
        blob.x += Math.sin(time + idx) * 1.5 + blob.vx
        blob.y += Math.cos(time + idx * 1.2) * 1.5 + blob.vy

        // Bounce boundaries
        if (blob.x < -100 || blob.x > width + 100) blob.vx *= -1
        if (blob.y < -100 || blob.y > height + 100) blob.vy *= -1

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius + Math.sin(time * 2 + idx) * 30
        )
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'rgba(9, 10, 15, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius * 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section className="relative min-h-[92vh] w-full flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20 select-none">
      {/* Dynamic Fluid Displacement Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      />

      {/* CSS Blur & Noise Glass Overlay for Liquid Surface Effect */}
      <div className="absolute inset-0 bg-[#090a0f]/40 backdrop-blur-[90px] pointer-events-none" />
      
      {/* Futuristic Mesh Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main Content (Centered & Prominent) */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Tagline / Category Chip */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono tracking-[0.25em] uppercase text-cyan-400 mb-8 shadow-inner animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SOFTWARE HOUSE & EVENT HARDWARE
        </div>

        {/* Large Prominent Hero Title */}
        <h1 className="text-5xl sm:text-7xl md:text-[6rem] lg:text-[7rem] font-black tracking-tighter text-white mb-8 leading-[0.95] text-balance">
          NEXT-GEN <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            DIGITAL CRAFT.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
          Bespoke web applications, high-concurrency event software, and immersive hardware integrations for ambitious brands.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          <a
            href="#portfolio"
            className="w-full sm:w-auto px-10 py-4 rounded-sm bg-white text-slate-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 text-center"
          >
            Explore Projects
          </a>
          
          <a
            href="#services"
            className="w-full sm:w-auto px-10 py-4 rounded-sm border border-white/20 bg-white/5 backdrop-blur-md text-slate-200 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300 active:scale-95 text-center"
          >
            Our Services
          </a>
        </div>

        {/* Metadata Footer Row inside Hero */}
        <div className="mt-20 pt-8 border-t border-white/10 w-full max-w-xl flex items-center justify-between text-[11px] font-mono tracking-widest text-slate-500 uppercase">
          <div>LATENCY: &lt; 15MS</div>
          <div>•</div>
          <div>SCALABILITY: UNLIMITED</div>
          <div>•</div>
          <div>DISPLACEMENT: FLUID</div>
        </div>
      </div>
    </section>
  )
}
