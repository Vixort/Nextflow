'use client'

import Link from 'next/link'
import { ArrowRight, MousePointerClick } from 'lucide-react'
import { Stagger, StaggerItem } from './animations/Stagger'
import Reveal from './animations/Reveal'
import DeviceStack from './DeviceStack'

export default function FinalCTA() {
  return (
    <section className="bg-[#fafafa] py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle grid + glow on the light surface */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(9,9,11,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,#000,transparent)]"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left: copy + CTA */}
          <div className="text-center lg:text-left">
            <Reveal direction="up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-[#09090b] max-w-3xl mx-auto lg:mx-0 leading-[0.92]">
                Ready to scale your digital infrastructure?
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <p className="text-base text-[#71717a] max-w-[50ch] mx-auto lg:mx-0 mt-4 leading-relaxed">
                Talk to our engineering team about your architecture challenges. No sales pitch — just
                technical expertise.
              </p>
            </Reveal>

            <Stagger
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              direction="up"
            >
              <StaggerItem>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 bg-[#09090b] text-white h-12 px-8 rounded-md text-sm font-medium hover:bg-[#18181b] transition-colors active:scale-[0.98]"
                >
                  Contact Us
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </StaggerItem>
              <StaggerItem>
                <button className="border border-[#e4e4e7] text-[#52525b] h-12 px-8 rounded-md text-sm font-medium hover:border-[#a1a1aa] hover:text-[#09090b] transition-colors active:scale-[0.98]">
                  Read documentation
                </button>
              </StaggerItem>
            </Stagger>

            <Reveal direction="up" delay={0.25}>
              <p className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-xs text-[#a1a1aa]">
                <MousePointerClick size={13} className="text-cyan-600" />
                Tap the devices to bring them forward — the iPad hides a playable game.
              </p>
            </Reveal>
          </div>

          {/* Right: interactive device stack */}
          <Reveal direction="left" delay={0.15} className="flex justify-center">
            <DeviceStack />
          </Reveal>
        </div>
      </div>
    </section>
  )
}