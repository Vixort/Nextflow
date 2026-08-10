const LOGOS = [
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Shopify', slug: 'shopify' },
  { name: 'Cloudflare', slug: 'cloudflare' },
  { name: 'GitHub', slug: 'github' },
  { name: 'Notion', slug: 'notion' },
]

export default function SocialProofSection() {
  return (
    <section className="bg-[#09090b] py-16 border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <p className="text-center text-xs text-[#71717a] tracking-widest uppercase mb-10">
          Trusted by engineering teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-between gap-8 sm:gap-12">
          {LOGOS.map((logo) => (
            <div key={logo.slug} className="flex items-center justify-center">
              {/* eslint-disable-next-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${logo.slug}/ffffff`}
                alt={logo.name}
                className="h-6 w-auto opacity-30 hover:opacity-60 transition grayscale object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
