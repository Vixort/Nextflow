import { Data } from '@puckeditor/core'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface SitePage {
  id: string
  name: string
  slug: string
  isHome?: boolean
  data: Data
}

export interface MultiPageProjectData {
  pages: SitePage[]
  activePageId: string
}

// HELPER: ENSURE EVERY COMPONENT ITEM HAS A UNIQUE NON-EMPTY ID STRING
export function ensureContentIds(data: Data): Data {
  if (!data || typeof data !== 'object') {
    return { content: [], zones: {}, root: { props: { title: 'Page' } } }
  }

  const content = Array.isArray(data.content)
    ? data.content
        .filter((item: any) => item && typeof item === 'object')
        .map((item: any, idx: number) => {
          const itemId = (item.id && typeof item.id === 'string' && item.id.trim() !== '')
            ? item.id
            : (item.props?.id && typeof item.props.id === 'string' && item.props.id.trim() !== '')
            ? item.props.id
            : `${item.type || 'block'}-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
          const props = item.props && typeof item.props === 'object'
            ? { ...item.props, id: item.props.id || itemId }
            : { id: itemId }
          return { ...item, id: itemId, props }
        })
    : []

  const zones: Record<string, any[]> = {}
  if (data.zones && typeof data.zones === 'object') {
    const rawZones = data.zones as Record<string, any[]>
    Object.keys(rawZones).forEach(zoneKey => {
      const zoneItems = rawZones[zoneKey]
      if (Array.isArray(zoneItems)) {
        zones[zoneKey] = zoneItems
          .filter((item: any) => item && typeof item === 'object')
          .map((item: any, idx: number) => {
            const itemId = (item.id && typeof item.id === 'string' && item.id.trim() !== '')
              ? item.id
              : (item.props?.id && typeof item.props.id === 'string' && item.props.id.trim() !== '')
              ? item.props.id
              : `${item.type || 'block'}-${zoneKey}-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
            const props = item.props && typeof item.props === 'object'
              ? { ...item.props, id: item.props.id || itemId }
              : { id: itemId }
            return { ...item, id: itemId, props }
          })
      } else {
        zones[zoneKey] = []
      }
    })
  }

  return {
    ...data,
    content: content as any,
    zones,
    root: data.root || { props: { title: 'Page' } },
  }
}


// DEFAULT HOME PAGE STARTER DATA WITH UNIQUE IDS
export const DEFAULT_HOME_PAGE_DATA: Data = ensureContentIds({
  content: [
    { id: 'navbar-home', type: 'Navbar', props: { brandName: 'NEXTFLOW.', ctaText: 'Sign In', fixedTop: true } },
    {
      id: 'hero-home',
      type: 'Hero',
      props: {
        badge: 'NEXT-GEN ARCHITECTURE',
        title: 'Craft Extraordinary Digital Experiences',
        gradientTitle: 'With Precision & Speed',
        description: 'Empower your enterprise with autonomous workflows and high-frequency database sync.',
        primaryCta: 'Explore Showcase',
        primaryUrl: '/services',
        secondaryCta: 'View Specs',
        secondaryUrl: '/about',
        align: 'center',
        themeStyle: 'glass',
        padding: 'standard',
      },
    },
    { id: 'logos-home', type: 'ClientLogosMarquee', props: { title: 'TRUSTED BY INNOVATION TEAMS AT GLOBAL ENTERPRISES', logo1Text: 'CYBERPULSE', logo2Text: 'AETHER FINTECH', logo3Text: 'SUPABASE LABS', logo4Text: 'NEXUS CLOUD', logo5Text: 'VERCEL LABS' } },
    {
      id: 'bento-home',
      type: 'BentoGrid',
      props: {
        title: 'Engineered For Extreme Performance & Scale',
        gradientTitle: 'High-Velocity Modules',
        subhead: 'Architectural foundations built for high-throughput enterprise applications.',
        card1Title: 'Real-time Telemetry Engine',
        card1Desc: 'Sub-millisecond logging and audit trails.',
        card2Title: 'Zero-Trust Security Paradigm',
        card2Desc: 'Strict RBAC hierarchy checking.',
        card3Title: 'Visual No-Code Studio',
        card3Desc: 'Drag, drop, reorder, and customize.',
        themeStyle: 'glass',
        padding: 'standard',
      },
    },
    {
      id: 'pricing-home',
      type: 'PricingTable',
      props: {
        title: 'Flexible & Scalable Pricing Tiers',
        subhead: 'Transparent plans designed for teams of all sizes.',
        proPrice: '$49/mo',
        proFeatures: 'Unlimited Workflows, 5 Admin Accounts, Supabase DB Sync, Puck Studio',
        enterprisePrice: '$199/mo',
        enterpriseFeatures: 'Unlimited Everything, Dedicated Support, Custom Webhooks, SSO',
        highlightPro: true,
        padding: 'standard',
      },
    },
    {
      id: 'footer-home',
      type: 'Footer',
      props: {
        brandName: 'NEXTFLOW.',
        description: 'Next-generation digital workspace and template engine.',
        copyrightText: '© 2026 Nextflow Inc. All rights reserved.',
        link1: 'Privacy Policy',
        link2: 'Terms of Service',
        link3: 'Documentation',
        link4: 'Status',
      },
    },
  ] as any,
  zones: {},
  root: {
    props: {
      title: 'Home Page',
      bodyBackground: '#090a0f',
      customBodyBackground: '',
      bodyTextColor: '#e2e8f0',
      fontFamily: 'font-sans',
      bodyPaddingTop: '0px',
      bodyPaddingBottom: '0px',
      bodyPaddingHorizontal: '0px',
      bodyPadding: '',
      bodyMargin: '0 auto',
      bodyMaxWidth: '100%',
      customBodyClass: '',
      customBodyCss: '',
    } as any,
  },
})

// LUMINA LUXURY WHITE MULTI-PAGE STUDIO TEMPLATE
export const LUMINA_WHITE_STUDIO_PROJECT: MultiPageProjectData = {
  activePageId: 'lumina-home-page',
  pages: [
    {
      id: 'lumina-home-page',
      name: 'Home',
      slug: '/',
      isHome: true,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Portfolio', link1Url: '/#portfolio', link2: 'Services', link2Url: '/services', ctaText: 'Inquire', ctaUrl: '/contact' } },
          { id: 'hero-lumina', type: 'HeroMinimalSerif', props: { badge: 'MONOGRAPH 2026', headline: 'PURITY IN ARCHITECTURAL FORM', subheadline: 'Bespoke architectural design systems engineered with mathematical precision and natural light.', ctaText: 'EXPLORE ATELIER WORK', ctaUrl: '/services' } },
          { id: 'portfolio-lumina', type: 'PortfolioMasonryGrid', props: { title: 'Selected Atelier Works', p1Title: 'Villa Aura Glass Residence', p1Img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80', p2Title: 'Obsidian Minimalist Pavilion', p2Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80', p3Title: 'Kyoto Zen Sanctuary', p3Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80' } },
          { id: 'bento-lumina', type: 'BentoAsymmetric4', props: { title: 'Architectural Philosophy & Principles', card1Title: 'Pure Light Palette', card1Desc: 'Pure white #ffffff background with high-contrast slate #0f172a typography.', card2Title: 'Sustainable Materials', card2Desc: 'Zero carbon footprint design and natural ventilation.', card3Title: 'Spatial Harmony', card3Desc: 'Proportional balance following golden ratio geometry.', card4Title: 'Sub-Millisecond Speed', card4Desc: 'Powered by Nextflow multi-page visual engine.' } },
          { id: 'testimonial-lumina', type: 'TestimonialSingleHero', props: { quote: '"Lumina Atelier redefines modern minimalist architecture with absolute visual clarity and structural perfection."', authorName: 'Architectural Digest', authorRole: 'Issue 2026 Selection', companyLogo: 'AD' } },
          { id: 'footer-lumina', type: 'FooterMinimalInline', props: { brandName: 'LUMINA ATELIER', copyrightText: '© 2026 Lumina Architecture Studio. All rights reserved.', link1: 'Documentation', link1Url: '/services', link2: 'Contact Atelier', link2Url: '/contact' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Lumina Architecture Studio - Home',
            bodyBackground: '#ffffff',
            bodyTextColor: '#0f172a',
            fontFamily: 'font-serif'
          } as any
        }
      })
    },
    {
      id: 'lumina-about-page',
      name: 'About Us',
      slug: '/about',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina-about', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Portfolio', link1Url: '/#portfolio', link2: 'Services', link2Url: '/services', ctaText: 'Inquire', ctaUrl: '/contact' } },
          { id: 'hero-lumina-about', type: 'HeroMinimalistTypography', props: { badge: 'STUDIO CULTURE', mainHeading: 'PHILOSOPHY & CRAFTSMANSHIP', subhead: 'Founded in 2018, Lumina is a global design collective operating at the intersection of architecture, digital form, and structural engineering.', ctaText: 'VIEW STUDIO SPECS', ctaUrl: '/services' } },
          { id: 'manifesto-lumina-about', type: 'FeatureListSplit', props: { badge: 'OUR MANIFESTO', title: 'Form Follows Purity', description: 'We eliminate all unnecessary ornamentation to reveal the intrinsic beauty of structural materials and natural light.', feature1Title: '01. Mathematical Ratio', feature1Desc: 'Strict adherence to golden ratio spatial proportion scales.', feature2Title: '02. Material Integrity', feature2Desc: 'Authentic stone, glass, and carbon structures.', feature3Title: '03. Digital Precision', feature3Desc: 'Integrated visual WebGL and Nextflow architecture.', cardImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80' } },
          { id: 'stats-lumina-about', type: 'StatsCounterGrid', props: { stat1Value: '15+', stat1Label: 'Years Studio Heritage', stat2Value: '240+', stat2Label: 'Global Projects Built', stat3Value: '12', stat3Label: 'International Awards', stat4Value: '100%', stat4Label: 'Client Satisfaction' } },
          { id: 'awards-lumina-about', type: 'PortfolioAwardBadges', props: { title: 'Accolades & Global Recognition', award1: 'Red Dot Best of Best 2026', award2: 'Awwwards Site of the Year', award3: 'Mies van der Rohe Nominee' } },
          { id: 'footer-lumina-about', type: 'FooterMinimalInline', props: { brandName: 'LUMINA ATELIER', copyrightText: '© 2026 Lumina Architecture Studio.', link1: 'Services', link1Url: '/services', link2: 'Inquire', link2Url: '/contact' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'About Us | Lumina Architecture Studio',
            bodyBackground: '#f8fafc',
            bodyTextColor: '#0f172a',
            fontFamily: 'font-serif'
          } as any
        }
      })
    },
    {
      id: 'lumina-services-page',
      name: 'Services',
      slug: '/services',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina-services', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Home', link1Url: '/', link2: 'About Us', link2Url: '/about', ctaText: 'Inquire', ctaUrl: '/contact' } },
          { id: 'hero-lumina-services', type: 'Hero', props: { badge: 'ATELIER SERVICES', title: 'Bespoke Architectural Engineering', gradientTitle: '& Interior Systems', description: 'End-to-end architectural design, 3D spatial modelling, and modern web presence integration.', primaryCta: 'Book Atelier Consultation', primaryUrl: '/contact', secondaryCta: 'View Pricing Matrix', secondaryUrl: '/services#pricing', align: 'center', themeStyle: 'glass', padding: 'standard' } },
          { id: 'comparison-lumina-services', type: 'FeatureComparisonGrid', props: { title: 'Service Tiers & Deliverables', col1Name: 'Full Atelier Retainer', col2Name: 'Standard Concept', row1: '3D Spatial Modeling', row2: 'On-site Construction Supervision', row3: 'Custom Web & VR Presentation' } },
          { id: 'pricing-lumina-services', type: 'PricingTable', props: { title: 'Atelier Engagement Tiers', subhead: 'Transparent retainer plans for residential and commercial developments.', proPrice: '$12,500', proFeatures: 'Concept Design, 3D Renderings, Material Specs, Web Portfolio', enterprisePrice: '$35,000', enterpriseFeatures: 'Full Architectural Blueprint, Construction Oversight, Dedicated Team, VR Walkthrough', highlightPro: true, padding: 'standard' } },
          { id: 'calendar-lumina-services', type: 'CtaBookDemoCalendar', props: { title: 'Schedule a 1-on-1 Atelier Consultation', subhead: 'Discuss your architectural project vision with our principal partners.', calendarCta: 'Book 30-Min Consultation' } },
          { id: 'footer-lumina-services', type: 'FooterMinimalInline', props: { brandName: 'LUMINA ATELIER', copyrightText: '© 2026 Lumina Architecture Studio.', link1: 'Home', link1Url: '/', link2: 'Contact', link2Url: '/contact' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Services | Lumina Architecture Studio',
            bodyBackground: '#ffffff',
            bodyTextColor: '#0f172a',
            fontFamily: 'font-serif'
          } as any
        }
      })
    },
    {
      id: 'lumina-contact-page',
      name: 'Contact',
      slug: '/contact',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina-contact', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Home', link1Url: '/', link2: 'Services', link2Url: '/services', ctaText: 'Back to Home', ctaUrl: '/' } },
          { id: 'hero-lumina-contact', type: 'HeroFormCapture', props: { badge: 'START A PROJECT', title: 'Inquire for Atelier Commissions', description: 'Our principal architects review incoming briefs weekly. Leave your email or project summary below.', formButtonText: 'Submit Project Inquiry', formPlaceholder: 'your.name@company.com' } },
          { id: 'faq-lumina-contact', type: 'FaqAccordion', props: { title: 'Frequently Asked Questions', subhead: 'Common questions regarding Atelier commissions and project timelines.', q1Title: 'What is the typical project timeline?', q1Answer: 'Concept design takes 4-6 weeks, followed by blueprint specification.', q2Title: 'Do you accept international projects?', q2Answer: 'Yes, Lumina operates globally across Asia, Europe, and the Americas.', q3Title: 'Can we license Nextflow web templates?', q3Answer: 'All Lumina digital presences are built using Nextflow Studio templates.' } },
          { id: 'footer-lumina-contact', type: 'FooterMinimalInline', props: { brandName: 'LUMINA ATELIER', copyrightText: '© 2026 Lumina Architecture Studio.', link1: 'Home', link1Url: '/', link2: 'Services', link2Url: '/services' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Contact Atelier | Lumina Architecture Studio',
            bodyBackground: '#f8fafc',
            bodyTextColor: '#0f172a',
            fontFamily: 'font-serif'
          } as any
        }
      })
    }
  ]
}

// PAGE PRESETS FOR QUICK CREATION
export const PAGE_PRESETS: { name: string; slug: string; description: string; getStarterData: (name: string) => Data }[] = [
  {
    name: 'Blank Page',
    slug: '/new-page',
    description: 'Completely empty canvas with zero elements',
    getStarterData: (name: string) => ensureContentIds({
      content: [],
      zones: {},
      root: { props: { title: name, bodyBackground: '#090a0f', bodyTextColor: '#e2e8f0', fontFamily: 'font-sans' } as any },
    }),
  },
  {
    name: 'About Us',
    slug: '/about',
    description: 'Company story, team highlights, and core values',
    getStarterData: (name: string) => ensureContentIds({
      content: [
        { id: `nav-about-${Date.now()}`, type: 'Navbar', props: { brandName: 'NEXTFLOW.', ctaText: 'Contact Us', fixedTop: true } },
        { id: `hero-about-${Date.now()}`, type: 'HeroMinimalSerif', props: { badge: 'OUR STORY', headline: 'Pioneering The Future of Web Architecture', subheadline: 'Empowering engineering teams worldwide to build visual, high-velocity web platforms.', ctaText: 'Learn More' } },
        { id: `bento-about-${Date.now()}`, type: 'BentoAsymmetric4', props: { title: 'Our Core Engineering Values', card1Title: 'Zero Compromise Quality', card1Desc: 'Strict typing and performance controls.', card2Title: 'Developer First', card2Desc: 'Designed to feel natural to modern engineers.', card3Title: 'Open Standards', card3Desc: 'Clean React and Tailwind CSS output.', card4Title: 'Enterprise Resilience', card4Desc: 'High-availability infrastructure.' } },
        { id: `stats-about-${Date.now()}`, type: 'StatsCounterGrid', props: { stat1Value: '2026', stat1Label: 'Founded Year', stat2Value: '50K+', stat2Label: 'Global Users', stat3Value: '100+', stat3Label: 'Visual Presets', stat4Value: '99.99%', stat4Label: 'Uptime SLA' } },
        { id: `footer-about-${Date.now()}`, type: 'Footer', props: { brandName: 'NEXTFLOW.', description: 'Next-generation digital workspace.', copyrightText: '© 2026 Nextflow Inc.', link1: 'Privacy', link2: 'Terms', link3: 'Docs', link4: 'Status' } },
      ] as any,
      zones: {},
      root: { props: { title: name, bodyBackground: '#090a0f', bodyTextColor: '#e2e8f0', fontFamily: 'font-sans' } as any },
    }),
  },
  {
    name: 'Services',
    slug: '/services',
    description: 'Feature modules, service comparison, and capabilities',
    getStarterData: (name: string) => ensureContentIds({
      content: [
        { id: `nav-svc-${Date.now()}`, type: 'Navbar', props: { brandName: 'NEXTFLOW.', ctaText: 'Get Started', fixedTop: true } },
        { id: `hero-svc-${Date.now()}`, type: 'HeroSplitImage', props: { badge: 'SOLUTIONS', title: 'Enterprise Web Development Services', description: 'Custom visual design systems, database architecture, and automated workflows.', imageSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', primaryCta: 'Explore Services', secondaryCta: 'Book Demo' } },
        { id: `grid-svc-${Date.now()}`, type: 'FeatureGridCards', props: { title: 'What We Deliver', subhead: 'End-to-end digital transformation for modern enterprises.', card1Title: 'Visual Studio Engine', card1Desc: 'No-code drag and drop editor.', card2Title: 'Database Schema Sync', card2Desc: 'Sub-millisecond Supabase sync.', card3Title: 'Tailwind CSS Tokens', card3Desc: 'Custom theme design systems.', card4Title: 'Code Export', card4Desc: 'Clean 1-click ZIP downloads.' } },
        { id: `cta-svc-${Date.now()}`, type: 'CtaBanner', props: { title: 'Ready to Transform Your Architecture?', subhead: 'Connect with our solutions team today.', buttonLabel: 'Schedule Consultation', buttonUrl: '/contact', variant: 'cyan', padding: 'standard' } },
        { id: `footer-svc-${Date.now()}`, type: 'Footer', props: { brandName: 'NEXTFLOW.', description: 'Next-generation digital workspace.', copyrightText: '© 2026 Nextflow Inc.', link1: 'Privacy', link2: 'Terms', link3: 'Docs', link4: 'Status' } },
      ] as any,
      zones: {},
      root: { props: { title: name, bodyBackground: '#090a0f', bodyTextColor: '#e2e8f0', fontFamily: 'font-sans' } as any },
    }),
  },
  {
    name: 'Pricing',
    slug: '/pricing',
    description: 'Subscription plans, feature matrix, and FAQ',
    getStarterData: (name: string) => ensureContentIds({
      content: [
        { id: `nav-prc-${Date.now()}`, type: 'Navbar', props: { brandName: 'NEXTFLOW.', ctaText: 'Sign In', fixedTop: true } },
        { id: `table-prc-${Date.now()}`, type: 'PricingTable', props: { title: 'Simple Transparent Pricing', subhead: 'No hidden fees. Scale as your business grows.', proPrice: '$49/mo', proFeatures: 'Unlimited Workflows, 5 Admin Accounts, Supabase DB Sync, Puck Studio', enterprisePrice: '$199/mo', enterpriseFeatures: 'Unlimited Everything, Dedicated Support, Custom Webhooks, SSO', highlightPro: true, padding: 'standard' } },
        { id: `matrix-prc-${Date.now()}`, type: 'PricingComparisonMatrix', props: { title: 'Complete Plan Feature Matrix', feat1: '100+ Visual Presets', feat2: 'Supabase REST DB Sync', feat3: 'Unlimited ZIP Exports' } },
        { id: `faq-prc-${Date.now()}`, type: 'FaqAccordion', props: { title: 'Frequently Asked Questions', subhead: 'Everything you need to know about plans and billing.', q1Title: 'Can I upgrade or downgrade anytime?', q1Answer: 'Yes, change your subscription anytime from the workspace settings.', q2Title: 'Is there a free trial?', q2Answer: 'We offer a 14-day free trial on all plans.', q3Title: 'What payment methods do you accept?', q3Answer: 'All major credit cards, Stripe, and invoice transfers.' } },
        { id: `footer-prc-${Date.now()}`, type: 'Footer', props: { brandName: 'NEXTFLOW.', description: 'Next-generation digital workspace.', copyrightText: '© 2026 Nextflow Inc.', link1: 'Privacy', link2: 'Terms', link3: 'Docs', link4: 'Status' } },
      ] as any,
      zones: {},
      root: { props: { title: name, bodyBackground: '#090a0f', bodyTextColor: '#e2e8f0', fontFamily: 'font-sans' } as any },
    }),
  },
  {
    name: 'Contact',
    slug: '/contact',
    description: 'Contact capture form, support info, and location',
    getStarterData: (name: string) => ensureContentIds({
      content: [
        { id: `nav-cnt-${Date.now()}`, type: 'Navbar', props: { brandName: 'NEXTFLOW.', ctaText: 'Home', fixedTop: true } },
        { id: `hero-cnt-${Date.now()}`, type: 'HeroFormCapture', props: { badge: 'GET IN TOUCH', title: 'We Would Love To Hear From You', description: 'Have questions or need custom architecture? Fill out the form below.', formButtonText: 'Send Message', formPlaceholder: 'Enter your work email...' } },
        { id: `trust-cnt-${Date.now()}`, type: 'TrustSecurityBadges', props: { title: 'GLOBAL SUPPORT & RESILIENCE', badge1: '24/7 SLA Support', badge2: 'Sub-ms Response', badge3: 'Dedicated Account Executive', badge4: 'SOC2 Certified' } },
        { id: `footer-cnt-${Date.now()}`, type: 'Footer', props: { brandName: 'NEXTFLOW.', description: 'Next-generation digital workspace.', copyrightText: '© 2026 Nextflow Inc.', link1: 'Privacy', link2: 'Terms', link3: 'Docs', link4: 'Status' } },
      ] as any,
      zones: {},
      root: { props: { title: name, bodyBackground: '#090a0f', bodyTextColor: '#e2e8f0', fontFamily: 'font-sans' } as any },
    }),
  },
]

// NORMALIZE UNKNOWN RAW DATA TO MultiPageProjectData (100% BACKWARD COMPATIBILITY & ID ENFORCEMENT)
export function normalizeMultiPageData(rawData: unknown, defaultName: string = 'Home'): MultiPageProjectData {
  const raw = rawData && typeof rawData === 'object' ? rawData as Record<string, unknown> : null
  // Scenario 1: Already MultiPageProjectData
  if (raw && Array.isArray(raw.pages) && raw.pages.length > 0) {
    const validPages: SitePage[] = raw.pages.map((page, idx: number) => {
      const p = page && typeof page === 'object' ? page as Record<string, unknown> : {}
      return ({
      id: typeof p.id === 'string' && p.id ? p.id : `page-${idx}-${Date.now()}`,
      name: typeof p.name === 'string' && p.name ? p.name : (idx === 0 ? 'Home' : `Page ${idx + 1}`),
      slug: typeof p.slug === 'string' && p.slug ? p.slug : (idx === 0 ? '/' : `/page-${idx + 1}`),
      isHome: typeof p.isHome === 'boolean' ? p.isHome : (p.slug === '/' || idx === 0),
      data: ensureContentIds(p.data && typeof p.data === 'object' && Array.isArray((p.data as Record<string, unknown>).content) ? p.data as Data : DEFAULT_HOME_PAGE_DATA),
    })})

    const storedActivePageId = typeof raw.active_page_id === 'string' ? raw.active_page_id : raw.activePageId
    const activePageId = typeof storedActivePageId === 'string' && validPages.some(p => p.id === storedActivePageId)
      ? storedActivePageId
      : validPages[0].id

    return { pages: validPages, activePageId }
  }

  // Scenario 2: Legacy Puck Data object { content: [...], root: {...} }
  if (raw && Array.isArray(raw.content)) {
    const homePage: SitePage = {
      id: 'page-home',
      name: defaultName || 'Home',
      slug: '/',
      isHome: true,
      data: ensureContentIds(raw as Data),
    }
    return {
      pages: [homePage],
      activePageId: 'page-home',
    }
  }

  // Scenario 3: Empty / Invalid data -> return default home page
  const homePage: SitePage = {
    id: 'page-home',
    name: 'Home',
    slug: '/',
    isHome: true,
    data: DEFAULT_HOME_PAGE_DATA,
  }
  return {
    pages: [homePage],
    activePageId: 'page-home',
  }
}

// GENERATE CLEAN URL SLUG FROM PAGE NAME
export function generatePageSlug(name: string): string {
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  if (!clean || clean === 'home') return '/'
  return `/${clean}`
}

// MULTI-PAGE ZIP EXPORT ENGINE
export function exportMultiPageZip(projectData: MultiPageProjectData, templateName: string) {
  const zip = new JSZip()
  const cleanTemplateName = templateName.toLowerCase().replace(/\s+/g, '-')

  // Save project raw data JSON for re-importing
  zip.file('project-data.json', JSON.stringify(projectData, null, 2))
  zip.file('README.txt', `Multi-Page Website Template: ${templateName}\nPages Count: ${projectData.pages.length}\nCreated with Nextflow Studio.`)

  // Build slug-to-filename map
  const slugToFilenameMap: Record<string, string> = {}
  projectData.pages.forEach(p => {
    const fName = p.isHome || p.slug === '/'
      ? 'index.html'
      : `${p.slug.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-') || 'page'}.html`
    slugToFilenameMap[p.slug] = fName
  })

  // Package each page as individual HTML file
  projectData.pages.forEach(page => {
    const fileName = slugToFilenameMap[page.slug] || (page.isHome ? 'index.html' : 'page.html')
    const pageTitle = `${page.name} | ${templateName}`

    // Convert internal hrefs in page content
    let serializedContent = JSON.stringify(page.data.content || [], null, 2)
    Object.entries(slugToFilenameMap).forEach(([slug, fName]) => {
      serializedContent = serializedContent.replace(new RegExp(`"href"\\s*:\\s*"${slug}"`, 'g'), `"href": "${fName}"`)
      serializedContent = serializedContent.replace(new RegExp(`href="${slug}"`, 'g'), `href="${fName}"`)
    })

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #090a0f; color: #e2e8f0; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; }
  </style>
</head>
<body className="bg-[#090a0f] text-slate-200">
  <!-- Page: ${page.name} (${page.slug}) -->
  <div id="app">
    <!-- Component Data Payload -->
    <script type="application/json" id="puck-page-data">
      ${serializedContent}
    </script>
  </div>
</body>
</html>`

    zip.file(fileName, htmlContent)
  })

  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, `${cleanTemplateName}-multipage-website.zip`)
  })
}
