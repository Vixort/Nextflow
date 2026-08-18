'use client'

import Link from 'next/link'
import { Stagger, StaggerItem } from './animations/Stagger'

const navigation = {
  services: [
    { label: 'Web Platforms', href: '#services' },
    { label: 'SaaS Architecture', href: '#services' },
    { label: 'Mobile Applications', href: '#services' },
    { label: 'Event Technology', href: '#services' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '/contact' },
    { label: 'Client Login', href: '/login' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#09090b] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">

        {/* Main footer grid */}
        <Stagger className="py-16 grid grid-cols-2 sm:grid-cols-4 gap-10 lg:gap-16" direction="up" amount={0.1}>

          {/* Brand column */}
          <StaggerItem className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-base font-semibold tracking-tight text-white">
                Nextflow
              </span>
            </Link>
            <p className="text-sm text-[#71717a] leading-relaxed max-w-[28ch]">
              Engineering digital products that scale with your ambition.
            </p>
          </StaggerItem>

          {/* Services */}
          <StaggerItem>
            <h4 className="text-xs font-medium text-[#a1a1aa] tracking-wide mb-4">Services</h4>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#52525b] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Company */}
          <StaggerItem>
            <h4 className="text-xs font-medium text-[#a1a1aa] tracking-wide mb-4">Company</h4>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#52525b] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Resources */}
          <StaggerItem>
            <h4 className="text-xs font-medium text-[#a1a1aa] tracking-wide mb-4">Resources</h4>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#52525b] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

        </Stagger>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#3f3f46]">
            © {new Date().getFullYear()} Nextflow Software House
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="text-xs text-[#3f3f46] hover:text-[#a1a1aa] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-[#3f3f46] hover:text-[#a1a1aa] transition-colors">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
