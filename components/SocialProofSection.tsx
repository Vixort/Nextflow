'use client'

import { Stagger, StaggerItem } from './animations/Stagger'

const LOGOS = [
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Shopify', slug: 'shopify' },
  { name: 'Cloudflare', slug: 'cloudflare' },
  { name: 'GitHub', slug: 'github' },
  { name: 'Notion', slug: 'notion' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'Linear', slug: 'linear' },
  { name: 'Framer', slug: 'framer' },
]

export default function SocialProofSection() {
  return (
    <section className="bg-[#09090b] pt-16 pb-12 border-b border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <Stagger amount={0.5}>
          <StaggerItem>
            <p className="text-center text-xs text-[#71717a] tracking-widest uppercase">
              Trusted by engineering teams worldwide
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
              <div className="flex items-center gap-16 w-max animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
                {[...LOGOS, ...LOGOS].map((logo, i) => (
                  <img
                    key={`${logo.slug}-${i}`}
                    src={`https://cdn.simpleicons.org/${logo.slug}/ffffff`}
                    alt={logo.name}
                    className="h-6 w-auto opacity-30 hover:opacity-70 transition grayscale object-contain"
                  />
                ))}
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}