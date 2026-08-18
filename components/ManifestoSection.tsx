'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TextAnimation from '@/components/ui/staggerText'

export default function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Sequential, non-overlapping opacity windows so only one slide is visible at a time
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const opacity2 = useTransform(
    scrollYProgress,
    [0.22, 0.4, 0.58, 0.76],
    [0, 1, 1, 0]
  )
  const opacity3 = useTransform(scrollYProgress, [0.78, 0.96], [0, 1])

  return (
    <section ref={ref} className="relative bg-[#09090b] h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-cyan-500/[0.05] rounded-full blur-[130px]" />
        </div>

        {/* Slide 1 — opening headline */}
        <motion.div
          style={{ opacity: opacity1 }}
          className="absolute inset-0 flex items-center justify-center px-6 sm:px-12"
        >
          <div className="max-w-[1100px] mx-auto text-center">
            <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-cyan-300/60 mb-6">
              Nextflow — Software House
            </p>
            <div className="flex flex-wrap justify-center text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95]">
              <span>
                <TextAnimation divideBy="word">Build the product</TextAnimation>
              </span>
              <span className="w-3" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">
                <TextAnimation divideBy="word" delay={0.3}>
                  your competitors fear.
                </TextAnimation>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Slide 2 — second statement */}
        <motion.div
          style={{ opacity: opacity2 }}
          className="absolute inset-0 flex items-center justify-center px-6 sm:px-12"
        >
          <div className="max-w-[1100px] mx-auto text-center">
            <p className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-300 leading-snug">
              We don’t just push pixels.
            </p>
            <p className="mt-6 text-lg sm:text-2xl text-slate-500 leading-relaxed">
              We architect systems that hold up under real pressure.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-slate-500">
                Scroll
              </span>
            </div>
          </div>
        </motion.div>

        {/* Slide 3 — closing statement */}
        <motion.div
          style={{ opacity: opacity3 }}
          className="absolute inset-0 flex items-center justify-center px-6 sm:px-12"
        >
          <div className="max-w-[1100px] mx-auto text-center">
            <p className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-snug">
              <span className="text-slate-300">From a bold idea to production</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">
                <TextAnimation divideBy="word" delay={0.2}>
                  in weeks, not quarters.
                </TextAnimation>
              </span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-white/20" />
              <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-slate-500">
                Nextflow
              </span>
              <span className="h-px w-12 bg-white/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
