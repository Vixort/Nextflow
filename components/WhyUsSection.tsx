'use client'

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Stagger, StaggerItem } from './animations/Stagger'
import Reveal from './animations/Reveal'

const PAIN_POINTS = [
  {
    title: 'Scaling bottlenecks',
    description:
      'Traffic spikes crash your servers. Manual scaling means lost revenue during peak hours.',
  },
  {
    title: 'Security vulnerabilities',
    description:
      'Outdated dependencies and unpatched infrastructure leave your data exposed to breaches.',
  },
  {
    title: 'Slow iteration cycles',
    description:
      'Monolithic architectures make every deployment a risk. Your team ships features in weeks, not days.',
  },
]

const SOLUTIONS = [
  {
    title: 'Event-driven auto-scaling',
    description:
      'Handles 50K+ concurrent users without manual intervention. Scale-to-zero when idle.',
  },
  {
    title: 'Defense-in-depth security',
    description:
      'Automated patching, WAF, DDoS mitigation, and SOC 2 compliance baked into every layer.',
  },
  {
    title: 'Ship daily, not monthly',
    description:
      'Modular microservice architecture with CI/CD pipelines. Deploy with confidence, rollback in seconds.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="relative border-t border-[rgba(255,255,255,0.06)] bg-[#09090b] py-24 overflow-hidden">
      {/* Background Detail */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -right-40 -top-40 w-[600px] lg:w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column — Problems */}
          <Reveal direction="right">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.04em] text-white mb-8">
                Your current stack is holding you back
              </h2>
              <Stagger className="space-y-6">
                {PAIN_POINTS.map((point) => (
                  <StaggerItem
                    key={point.title}
                    className="group flex gap-4 rounded-xl border border-transparent px-4 py-3 -mx-4 hover:border-rose-500/20 hover:bg-rose-500/[0.03] transition-all duration-300"
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <AlertTriangle size={15} className="text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{point.title}</h3>
                      <p className="text-sm text-[#71717a] mt-1">{point.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>

          {/* Right Column — Our Solution */}
          <Reveal direction="left" delay={0.1}>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.04em] text-white mb-8">
                Architecture that eliminates these problems
              </h2>
              <Stagger className="space-y-6" direction="left">
                {SOLUTIONS.map((solution) => (
                  <StaggerItem
                    key={solution.title}
                    className="group flex gap-4 rounded-xl border border-transparent px-4 py-3 -mx-4 hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300"
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{solution.title}</h3>
                      <p className="text-sm text-[#71717a] mt-1">{solution.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}