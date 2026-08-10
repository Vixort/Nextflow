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

// PAGE PRESETS FOR QUICK CREATION
export const PAGE_PRESETS: { name: string; slug: string; description: string; getStarterData: (name: string) => Data }[] = [
  {
    name: 'Blank Page',
    slug: '/new-page',
    description: 'Empty page layout canvas',
    getStarterData: (name: string) => ensureContentIds({
      content: [
        { id: `navbar-${Date.now()}`, type: 'Navbar', props: { brandName: 'NEXTFLOW.', ctaText: 'Sign In', fixedTop: false } },
        { id: `heading-${Date.now()}`, type: 'Heading', props: { text: name, level: 'h1', fontSize: '4xl', fontWeight: 'bold', color: '#ffffff', align: 'center', gradient: true } },
        { id: `spacer-${Date.now()}`, type: 'Spacer', props: { height: '40px' } },
        { id: `footer-${Date.now()}`, type: 'Footer', props: { brandName: 'NEXTFLOW.', description: 'Next-generation digital workspace.', copyrightText: '© 2026 Nextflow Inc.', link1: 'Privacy', link2: 'Terms', link3: 'Docs', link4: 'Status' } },
      ] as any,
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
export function normalizeMultiPageData(rawData: any, defaultName: string = 'Home'): MultiPageProjectData {
  // Scenario 1: Already MultiPageProjectData
  if (rawData && Array.isArray(rawData.pages) && rawData.pages.length > 0) {
    const validPages: SitePage[] = rawData.pages.map((p: any, idx: number) => ({
      id: p.id || `page-${idx}-${Date.now()}`,
      name: p.name || (idx === 0 ? 'Home' : `Page ${idx + 1}`),
      slug: p.slug || (idx === 0 ? '/' : `/page-${idx + 1}`),
      isHome: p.isHome !== undefined ? p.isHome : (p.slug === '/' || idx === 0),
      data: ensureContentIds(p.data && typeof p.data === 'object' && Array.isArray(p.data.content) ? p.data : DEFAULT_HOME_PAGE_DATA),
    }))

    const activePageId = rawData.activePageId && validPages.some(p => p.id === rawData.activePageId)
      ? rawData.activePageId
      : validPages[0].id

    return { pages: validPages, activePageId }
  }

  // Scenario 2: Legacy Puck Data object { content: [...], root: {...} }
  if (rawData && typeof rawData === 'object' && Array.isArray(rawData.content)) {
    const homePage: SitePage = {
      id: 'page-home',
      name: defaultName || 'Home',
      slug: '/',
      isHome: true,
      data: ensureContentIds(rawData as Data),
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

  // Package each page as individual HTML file
  projectData.pages.forEach(page => {
    const fileName = page.isHome || page.slug === '/'
      ? 'index.html'
      : `${page.slug.replace(/^\//, '').replace(/\//g, '-') || 'page'}.html`

    const pageTitle = `${page.name} | ${templateName}`

    // Simple export wrapper html
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #090a0f; color: #e2e8f0; font-family: ui-sans-serif, system-ui, sans-serif; }
  </style>
</head>
<body>
  <!-- Page: ${page.name} (${page.slug}) -->
  <div id="app">
    ${JSON.stringify(page.data.content, null, 2)}
  </div>
</body>
</html>`

    zip.file(fileName, htmlContent)
  })

  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, `${cleanTemplateName}-multipage-website.zip`)
  })
}
