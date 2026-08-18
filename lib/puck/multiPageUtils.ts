import type { Data } from '@puckeditor/core'
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

// LUMINA LUXURY ESTATE & VILLA ARCHITECTURE MULTI-PAGE STUDIO TEMPLATE
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
          { id: 'nav-lumina', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Home', link1Url: '/', link2: 'About', link2Url: '/about', link3: 'Services', link3Url: '/services', ctaText: 'Contact', ctaUrl: '/contact' } },
          { id: 'hero-parallax-lumina', type: 'EstateFullBleedParallaxHero', props: { badge: 'LUMINA ARCHITECTURAL ATELIER • MONOGRAPH 2026', title: 'THE ART OF STRUCTURAL PERMANENCE', subtitle: 'Bespoke residential sanctuaries integrating natural Roman travertine, zero-carbon solar roofs, and panoramic alpine glass.', location: 'LAKE COMO • ASPEN • KYOTO • BEL AIR', price: 'PRIVATE COMMISSIONS FROM $12.5M', bgImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80', ctaText: 'INQUIRE PRIVATE BRIEF', ctaUrl: '/contact', secText: 'EXPLORE MONOGRAPH', secUrl: '/services' } },
          { id: 'hero-editorial-lumina', type: 'EstateHeroEditorial', props: { location: 'LAKE COMO, ITALY', title: 'Villa Aura Glass Sanctuary', subtitle: 'A masterpiece of contemporary architectural design, seamlessly integrating raw travertine stone, floor-to-ceiling panoramic glass, and private alpine waterfront vistas.', price: '€14,500,000', specs: '6 BEDS • 7 BATHS • 12,400 SQ FT • PRIVATE DOCK', heroImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80', ctaText: 'Inquire Private Brief', ctaUrl: '/contact', secText: 'View Architectural Specs', secUrl: '/services' } },
          { id: 'portfolio-lumina', type: 'EstateImageRailEditorial', props: { title: 'Selected Atelier Masterworks', subtitle: 'Horizontal architectural photo monograph. Scroll to explore active estate commissions.', item1Title: 'Villa Aura Glass Sanctuary', item1Loc: '01 // LAKE COMO, ITALY', item1Price: '€14,500,000', item1Img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', item2Title: 'Obsidian Alpine Pavilion', item2Loc: '02 // ASPEN, COLORADO', item2Price: '$18,500,000', item2Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80', item3Title: 'Kyoto Zen Sanctuary', item3Loc: '03 // KYOTO, JAPAN', item3Price: '$12,000,000', item3Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', item4Title: 'Bel Air Horizon Residence', item4Loc: '04 // LOS ANGELES, CA', item4Price: '$24,000,000', item4Img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'specs-lumina', type: 'EstateSpecsDetail', props: { title: 'Architectural Materiality & Structural Precision', subtitle: 'Every Lumina estate is built with authentic natural stone, thermal glass, and sustainable off-grid power.', spec1Title: 'Natural Italian Travertine', spec1Desc: 'Hand-selected Roman travertine stone slabs with precision thermal isolation.', spec2Title: 'Triple-Glazed Panoramic Glass', spec2Desc: 'Floor-to-ceiling UV-protected acoustic glass panels with invisible framing.', spec3Title: 'Zero-Carbon Solar Envelope', spec3Desc: 'Integrated photovoltaic roof tiles generating 100% clean off-grid power.', spec4Title: 'Smart Atelier Automation', spec4Desc: 'Sub-millisecond climate, security, and ambient light automation engine.' } },
          { id: 'manifesto-lumina', type: 'FeatureListSplit', props: { badge: 'OUR MANIFESTO', title: 'Form Follows Structural Purity', description: 'We eliminate all unnecessary ornamentation to reveal the intrinsic beauty of natural Roman stone, panoramic glass, and surrounding alpine light.', feature1Title: '01. Mathematical Proportion', feature1Desc: 'Strict adherence to golden ratio spatial proportion scales.', feature2Title: '02. Material Integrity', feature2Desc: 'Authentic stone, glass, and carbon-neutral envelopes.', feature3Title: '03. Digital Precision', feature3Desc: 'Sub-millisecond multi-page visual engine.', cardImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80' } },
          { id: 'timeline-lumina', type: 'EstateArchitecturalTimeline', props: { title: 'Chronological Execution Monograph', subtitle: 'Our 4-phase architectural process from raw land intake to structural commission handover.', step1Title: '01. Land & Topography Mapping', step1Desc: 'Sub-centimeter drone LIDAR topography scanning and sun-path light analysis.', step2Title: '02. Spatial Proportion & VR', step2Desc: 'Golden-ratio spatial blueprint modeling with 1:1 scale virtual reality walkthroughs.', step3Title: '03. Authentic Material Quarrying', step3Desc: 'Direct quarrying of Italian travertine stone and triple-glazed panoramic acoustic glass.', step4Title: '04. Off-Grid Solar Envelope', step4Desc: 'Integration of zero-carbon solar roofs, smart automation, and final atelier sign-off.' } },
          { id: 'quote-lumina', type: 'EstatePhilosophyQuote', props: { quote: '"Architecture is the learned game, correct and magnificent, of forms assembled in the light. Purity is not the absence of detail, but the harmony of essential structure."', author: 'LE CORBUSIER / LUMINA MONOGRAPH', monograph: 'INTERNATIONAL ARCHITECTURAL ESSAY 2026', bgImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80' } },
          { id: 'gallery-lumina', type: 'EstateGridGallery', props: { title: 'Curated Private Estates Collection', subtitle: 'Explore active private villa commissions available for acquisition or bespoke architectural development.', e1Title: 'Obsidian Alpine Pavilion', e1Loc: 'ASPEN, COLORADO', e1Price: '$18,500,000', e1Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80', e2Title: 'Kyoto Zen Sanctuary', e2Loc: 'KYOTO, JAPAN', e2Price: '$12,000,000', e2Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80', e3Title: 'Bel Air Horizon Residence', e3Loc: 'LOS ANGELES, CA', e3Price: '$24,000,000', e3Img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&auto=format&fit=crop&q=80' } },
          { id: 'comparison-lumina', type: 'FeatureComparisonGrid', props: { title: 'Villa Structural Comparison', col1Name: 'Monograph Alpine Villa', col2Name: 'Coastal Glass Pavilion', row1: 'Triple-Glazed Acoustic Glass Panels', row2: 'Zero-Carbon Solar Roof Integration', row3: 'Private Waterfront / Helipad Dock' } },
          { id: 'stats-lumina', type: 'StatsCounterGrid', props: { stat1Value: '15+', stat1Label: 'Years Atelier Heritage', stat2Value: '240+', stat2Label: 'Global Villas Built', stat3Value: '12', stat3Label: 'Monograph Awards', stat4Value: '100%', stat4Label: 'Carbon Neutrality' } },
          { id: 'awards-lumina', type: 'PortfolioAwardBadges', props: { title: 'Accolades & Global Recognition', award1: 'Red Dot Best of Best 2026', award2: 'Awwwards Site of the Year', award3: 'Mies van der Rohe Nominee' } },
          { id: 'testimonial-lumina', type: 'TestimonialQuoteMinimal', props: { quote: '"Lumina Atelier redefines luxury residential architecture with absolute visual purity, structural permanence, and harmony with surrounding nature."', author: 'ARCHITECTURAL DIGEST', role: 'INTERNATIONAL MONOGRAPH REVIEW 2026' } },
          { id: 'footer-lumina', type: 'FooterMinimalCentered', props: { brandName: 'LUMINA ARCHITECTURAL ATELIER', tagline: 'GENEVA • KYOTO • NEW YORK • MILAN', copyrightText: 'MMXXVI ALL RIGHTS RESERVED.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Lumina Atelier - Luxury Estate & Architecture Studio',
            bodyBackground: '#FBFBFA',
            bodyTextColor: '#111111',
            fontFamily: 'font-serif'
          } as any
        }
      })
    },
    {
      id: 'lumina-estates-page',
      name: 'Estates Directory',
      slug: '/about',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina-estates', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Home', link1Url: '/', link2: 'About', link2Url: '/about', link3: 'Services', link3Url: '/services', ctaText: 'Contact', ctaUrl: '/contact' } },
          { id: 'hero-lumina-estates', type: 'HeroMinimalistTypography', props: { badge: 'PRIVATE DIRECTORY', mainHeading: 'THE ESTATES COLLECTION', subhead: 'A private portfolio of ultra-luxury residential developments, alpine retreats, and coastal sanctuaries built across 4 continents.', ctaText: 'INQUIRE ACQUISITION', ctaUrl: '/contact' } },
          { id: 'spotlight-lumina-estates', type: 'EstateFullBleedParallaxHero', props: { badge: 'FEATURED VILLA MONOGRAPH', title: 'Villa Aura Glass Sanctuary', subtitle: '6 Beds • 7 Baths • 12,400 Sq Ft • Lake Como Waterfront Dock. Available for private acquisition.', location: 'LAKE COMO, ITALY', price: '€14,500,000', bgImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80', ctaText: 'INQUIRE ACQUISITION', ctaUrl: '/contact', secText: 'VIEW SPECIFICATIONS', secUrl: '/services' } },
          { id: 'rail-lumina-estates', type: 'EstateImageRailEditorial', props: { title: 'Atelier Monograph Rail', subtitle: 'Explore active private villa commissions.', item1Title: 'Villa Aura Glass Sanctuary', item1Loc: '01 // LAKE COMO, ITALY', item1Price: '€14,500,000', item1Img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', item2Title: 'Obsidian Alpine Pavilion', item2Loc: '02 // ASPEN, COLORADO', item2Price: '$18,500,000', item2Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80', item3Title: 'Kyoto Zen Sanctuary', item3Loc: '03 // KYOTO, JAPAN', item3Price: '$12,000,000', item3Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', item4Title: 'Bel Air Horizon Residence', item4Loc: '04 // LOS ANGELES, CA', item4Price: '$24,000,000', item4Img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'gallery-lumina-estates', type: 'EstateGridGallery', props: { title: 'Private Villa Portfolio', subtitle: 'Detailed specifications and private tour requests.', e1Title: 'Villa Aura Glass Residence', e1Loc: 'LAKE COMO, ITALY', e1Price: '€14,500,000', e1Img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80', e2Title: 'Obsidian Alpine Pavilion', e2Loc: 'ASPEN, COLORADO', e2Price: '$18,500,000', e2Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80', e3Title: 'Kyoto Zen Sanctuary', e3Loc: 'KYOTO, JAPAN', e3Price: '$12,000,000', e3Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80' } },
          { id: 'quote-lumina-estates', type: 'EstatePhilosophyQuote', props: { quote: '"To create architecture is to put in order. Put what in order? Function and objects."', author: 'LUMINA ARCHITECTURAL PRINCIPLES', monograph: 'GLOBAL VILLA PORTFOLIO 2026', bgImg: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&auto=format&fit=crop&q=80' } },
          { id: 'specs-lumina-estates', type: 'EstateSpecsDetail', props: { title: 'Master Atelier Specifications', subtitle: 'Engineered with sustainable materials and mathematical proportion.', spec1Title: '01. Spatial Proportion', spec1Desc: 'Proportional balance following golden ratio geometry.', spec2Title: '02. Authentic Stone', spec2Desc: 'Hand-chiselled granite and Roman travertine.', spec3Title: '03. Acoustic Isolation', spec3Desc: 'Triple acoustic insulation for complete interior tranquility.', spec4Title: '04. Solar Independence', spec4Desc: 'Integrated clean energy generation.' } },
          { id: 'comparison-lumina-estates', type: 'FeatureComparisonGrid', props: { title: 'Villa Structural Comparison', col1Name: 'Monograph Alpine Villa', col2Name: 'Coastal Glass Pavilion', row1: 'Triple-Glazed Acoustic Glass Panels', row2: 'Zero-Carbon Solar Roof Integration', row3: 'Private Waterfront / Helipad Dock' } },
          { id: 'footer-lumina-estates', type: 'FooterMinimalCentered', props: { brandName: 'LUMINA ARCHITECTURAL ATELIER', tagline: 'GENEVA • KYOTO • NEW YORK • MILAN', copyrightText: 'MMXXVI ALL RIGHTS RESERVED.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Estates Collection | Lumina Atelier',
            bodyBackground: '#ffffff',
            bodyTextColor: '#111111',
            fontFamily: 'font-serif'
          } as any
        }
      })
    },
    {
      id: 'lumina-services-page',
      name: 'Atelier Services',
      slug: '/services',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina-services', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Home', link1Url: '/', link2: 'About', link2Url: '/about', link3: 'Services', link3Url: '/services', ctaText: 'Contact', ctaUrl: '/contact' } },
          { id: 'hero-lumina-services', type: 'HeroMinimalSerif', props: { badge: 'BESPOKE COMMISSIONS', headline: 'ARCHITECTURAL SERVICES & ATELIER FEES', subheadline: 'End-to-end master planning, structural engineering, interior architecture, and custom estate construction oversight.', ctaText: 'BOOK CONSULTATION', ctaUrl: '/contact' } },
          { id: 'timeline-lumina-services', type: 'EstateArchitecturalTimeline', props: { title: 'Chronological Execution Monograph', subtitle: 'Our 4-phase architectural process from raw land intake to structural commission handover.', step1Title: '01. Land & Topography Mapping', step1Desc: 'Sub-centimeter drone LIDAR topography scanning and sun-path light analysis.', step2Title: '02. Spatial Proportion & VR', step2Desc: 'Golden-ratio spatial blueprint modeling with 1:1 scale virtual reality walkthroughs.', step3Title: '03. Authentic Material Quarrying', step3Desc: 'Direct quarrying of Italian travertine stone and triple-glazed panoramic acoustic glass.', step4Title: '04. Off-Grid Solar Envelope', step4Desc: 'Integration of zero-carbon solar roofs, smart automation, and final atelier sign-off.' } },
          { id: 'specs-lumina-services', type: 'EstateSpecsDetail', props: { title: 'Architectural Engineering Precision', subtitle: 'Our structural benchmarks ensure zero carbon footprint and 100-year longevity.', spec1Title: 'Natural Italian Travertine', spec1Desc: 'Direct quarrying of Roman stone slabs.', spec2Title: 'Triple-Glazed Acoustic Glass', spec2Desc: 'UV-protected panoramic glass panels.', spec3Title: 'Zero-Carbon Solar Roofs', spec3Desc: 'Clean off-grid power generation.', spec4Title: 'Sub-Millisecond Automation', spec4Desc: 'Smart climate & security control.' } },
          { id: 'comparison-lumina-services', type: 'FeatureComparisonGrid', props: { title: 'Atelier Retainer Deliverables Matrix', col1Name: 'Full Atelier Masterplan', col2Name: 'Concept Specification', row1: '3D Spatial Modeling & VR Walkthrough', row2: 'On-site Structural Construction Supervision', row3: 'Custom Interior & Landscape Architecture' } },
          { id: 'pricing-lumina-services', type: 'PricingTable', props: { title: 'Architectural Retainer Tiers', subhead: 'Transparent retainer structures for bespoke residential developments.', proPrice: '$25,000', proFeatures: 'Concept Masterplan, 3D Renderings, Material Specifications, Zoning Permits', enterprisePrice: '$75,000', enterpriseFeatures: 'Complete Architectural Blueprint, Structural Engineering, On-site Supervision, Custom Interior Design', highlightPro: true, padding: 'standard' } },
          { id: 'calendar-lumina-services', type: 'CtaBookDemoCalendar', props: { title: 'Schedule a 1-on-1 Atelier Consultation', subhead: 'Discuss your architectural project vision with our principal partners.', calendarCta: 'Book 30-Min Consultation' } },
          { id: 'testimonial-lumina-services', type: 'TestimonialQuoteMinimal', props: { quote: '"Lumina Atelier redefines luxury residential architecture with absolute visual purity, structural permanence, and harmony with surrounding nature."', author: 'ARCHITECTURAL DIGEST', role: 'INTERNATIONAL MONOGRAPH REVIEW 2026' } },
          { id: 'footer-lumina-services', type: 'FooterMinimalCentered', props: { brandName: 'LUMINA ARCHITECTURAL ATELIER', tagline: 'GENEVA • KYOTO • NEW YORK • MILAN', copyrightText: 'MMXXVI ALL RIGHTS RESERVED.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Atelier Services & Fee Matrix | Lumina Atelier',
            bodyBackground: '#FBFBFA',
            bodyTextColor: '#111111',
            fontFamily: 'font-serif'
          } as any
        }
      })
    },
    {
      id: 'lumina-contact-page',
      name: 'Private Inquiry',
      slug: '/contact',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-lumina-contact', type: 'NavbarMinimalMonochrome', props: { brandName: 'LUMINA ATELIER', link1: 'Home', link1Url: '/', link2: 'About', link2Url: '/about', link3: 'Services', link3Url: '/services', ctaText: 'Contact', ctaUrl: '/contact' } },
          { id: 'hero-lumina-contact', type: 'HeroMinimalistTypography', props: { badge: 'CONFIDENTIAL INTAKE', mainHeading: 'PRIVATE COMMISSION INQUIRY', subhead: 'Our principal architects review incoming private commission briefs weekly. Confidentiality assured.', ctaText: 'SUBMIT BRIEF', ctaUrl: '#inquiry-form' } },
          { id: 'inquiry-lumina-contact', type: 'EstateInquiryForm', props: { title: 'Inquire for Private Estate Commissions', subhead: 'Submit your estate location, acreage, and timeline for review.', buttonText: 'Submit Commission Inquiry', placeholder: 'your.name@company.com' } },
          { id: 'specs-lumina-contact', type: 'EstateSpecsDetail', props: { title: 'Private Intake Protocol', subtitle: 'Strict non-disclosure agreements precede all project masterplanning.', spec1Title: '01. Confidentiality', spec1Desc: 'All inquiries protected under bilateral NDA.', spec2Title: '02. Site Evaluation', spec2Desc: 'Global site visits within 14 business days.', spec3Title: '03. Permits & Zoning', spec3Desc: 'Municipal permit coordination across EU, US, and Asia.', spec4Title: '04. Direct Access', spec4Desc: 'Direct phone & VR access to principal architects.' } },
          { id: 'faq-lumina-contact', type: 'FaqAccordion', props: { title: 'Private Commission FAQs', subhead: 'Essential details regarding project intake, timelines, and confidentiality.', q1Title: 'What is the typical timeline for a private estate commission?', q1Answer: 'Masterplan concept development takes 6-8 weeks, followed by full engineering specifications.', q2Title: 'Does Lumina handle international land acquisition and permits?', q2Answer: 'Yes, our global legal and architectural team coordinates all local municipal permits across Europe, US, and Asia.', q3Title: 'Are estate commissions strictly confidential?', q3Answer: 'All inquiries are bound by non-disclosure agreements prior to initial architectural consultation.' } },
          { id: 'quote-lumina-contact', type: 'EstatePhilosophyQuote', props: { quote: '"Discretion and precision are the bedrocks of master architecture."', author: 'LUMINA ARCHITECTURAL BOARD', monograph: 'CONFIDENTIAL COMMISSIONS 2026', bgImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80' } },
          { id: 'footer-lumina-contact', type: 'FooterMinimalCentered', props: { brandName: 'LUMINA ARCHITECTURAL ATELIER', tagline: 'GENEVA • KYOTO • NEW YORK • MILAN', copyrightText: 'MMXXVI ALL RIGHTS RESERVED.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Private Inquiry | Lumina Atelier',
            bodyBackground: '#111111',
            bodyTextColor: '#FBFBFA',
            fontFamily: 'font-serif'
          } as any
        }
      })
    }
  ]
}

// NOVA MARKET E-COMMERCE MULTI-PAGE STUDIO TEMPLATE (ANTI-AI-SLOP & REAL PHOTOGRAPHY)
export const NOVA_MARKET_STUDIO_PROJECT: MultiPageProjectData = {
  activePageId: 'nova-home-page',
  pages: [
    {
      id: 'nova-home-page',
      name: 'Home',
      slug: '/',
      isHome: true,
      data: ensureContentIds({
        content: [
          { id: 'nav-nova-home', type: 'NavbarECommerce', props: { brandName: 'NOVA MARKET', searchPlaceholder: 'Search curated goods...', cartCount: '3', ctaText: 'Cart', link1Text: 'Shop', link1Url: '/shop', link2Text: 'Collections', link2Url: '/collections', link3Text: 'About', link3Url: '/about' } },
          { id: 'hero-nova-home', type: 'HeroImmersiveVideo', props: { badgeText: 'FLAGSHIP CINEMATIC EXPERIENCE', title: 'Bespoke Studio Hardware & Modern Goods', subhead: 'Precision-engineered acoustic audio, artisan furniture, and minimalist daily essentials crafted for lifetime durability.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-on-a-table-41617-large.mp4', posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80', ctaText: 'Explore Flagship Store', secondaryCta: 'Watch Studio Film' } },
          { id: 'promo-nova-home', type: 'EcommercePromoBanner', props: { promoBadge: 'AUTUMN COLLECTION 2026', headline: 'Exclusive 20% Off Launch Promotion', discountCode: 'STUDIO20', subtext: 'Applied automatically at checkout for all new studio patrons.', ctaText: 'Claim Discount' } },
          { id: 'grid-nova-home', type: 'EcommerceProductGrid', props: { title: 'Flagship Goods & Studio Catalog', p1Name: 'Aura Studio Wireless Headphones Pro', p1Price: '$349.00', p1Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80', p2Name: 'Nordic Ash Lounge Chair', p2Price: '$490.00', p2Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80', p3Name: 'Minimalist Chronograph Watch', p3Price: '$189.00', p3Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80' } },
          { id: 'rail-nova-home', type: 'EcommerceProductsRail', props: { title: 'High-Fidelity Audio Series Rail', subtitle: 'Swipe or scroll horizontally to explore precision acoustic hardware.', p1Name: 'Precision Desktop Audio Node', p1Price: '$279.00', p1Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80', p2Name: 'Beryllium Driver Studio Monitors', p2Price: '$590.00', p2Img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop&q=80', p3Name: 'Minimalist Vinyl Turntable', p3Price: '$680.00', p3Img: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=900&auto=format&fit=crop&q=80', p4Name: 'Vacuum Tube Preamplifier', p4Price: '$420.00', p4Img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80' } },
          { id: 'video-parallax-home', type: 'VideoScrollParallax', props: { title: 'Beryllium Driver Acoustic Architecture', caption: 'Engineered with sub-micron precision for zero harmonic distortion.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-on-a-table-41617-large.mp4', posterUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'gallery-nova-home', type: 'PortfolioMasonryGrid', props: { title: 'Visual Product Material Monograph', item1Title: 'Anodized Aluminum Chassis', item1Category: 'ACOUSTIC HARDWARE', item1Img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80', item2Title: 'Nordic Solid Ash Grain', item2Category: 'ARTISAN FURNITURE', item2Img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80', item3Title: 'Italian Lambskin Cushion', item3Category: 'TACTILE CRAFTSMANSHIP', item3Img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'highlight-nova-home', type: 'EcommerceFeatureHighlight', props: { productName: 'Aura Studio Wireless Headphones Pro', tagline: 'ACOUSTIC ENGINEERING', price: '$349.00', description: 'Hand-assembled active noise-cancelling headphones crafted with brushed aluminum and authentic Italian lambskin leather.', feature1: '45dB Hybrid Active Noise Suppression', feature2: '40-Hour Continuous Battery Life', mainImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'compare-nova-home', type: 'InteractiveComparisonSlider', props: { title: 'Precision Hardware Architecture', beforeImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80', beforeLabel: 'Exterior Matte Finish', afterImg: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=80', afterLabel: 'Internal Beryllium Driver Spec' } },
          { id: 'features-nova-home', type: 'FeatureListSplit', props: { badge: 'ATELIER COMMITMENT', title: 'Crafted for Perfection & Longevity', description: 'Every product in our catalog undergoes rigorous quality testing and comes backed by our lifetime craftsmanship guarantee.', feature1Title: '01. Express Global Logistics', feature1Desc: 'Carbon-neutral international delivery dispatched within 24 hours.', feature2Title: '02. 30-Day In-Home Trial', feature2Desc: 'Experience our goods in your space with hassle-free returns.', feature3Title: '03. 2-Year Full Replacement', feature3Desc: 'Comprehensive manufacturer warranty on all studio electronics.', cardImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'reviews-nova-home', type: 'Testimonials', props: { title: 'Verified Customer Reviews', subhead: 'Feedback from over 15,000 design-conscious patrons worldwide.' } },
          { id: 'footer-nova-home', type: 'FooterAppStoreLinks', props: { brandName: 'NOVA MARKET', appStoreText: 'DOWNLOAD NOVA APP', copyrightText: '© 2026 Nova Market Studio Inc. All rights reserved.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Nova Market - Bespoke Goods & Studio Hardware',
            bodyBackground: '#090a0f',
            bodyTextColor: '#e2e8f0',
            fontFamily: 'font-sans'
          } as any
        }
      })
    },
    {
      id: 'nova-shop-page',
      name: 'Shop Catalog',
      slug: '/shop',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-nova-shop', type: 'NavbarECommerce', props: { brandName: 'NOVA MARKET', searchPlaceholder: 'Search catalog...', cartCount: '3', ctaText: 'Cart', link1Text: 'Shop', link1Url: '/shop', link2Text: 'Collections', link2Url: '/collections', link3Text: 'About', link3Url: '/about' } },
          { id: 'banner-nova-shop', type: 'EcommerceStorefrontBannerSlider', props: { badgeText: 'FLASH STOREFRONT SALE', title: 'Bespoke Acoustic & Modern Hardware Showcase', subtitle: 'Up to 30% off selected flagship studio audio and artisan Scandinavian furniture.', ctaText: 'EXPLORE FLASH SALE', bannerImg1: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&auto=format&fit=crop&q=80', bannerImg2: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80', feature1Tag: 'AUDIO HARDWARE -20%', feature2Tag: 'ARTISAN FURNITURE -30%' } },
          { id: 'hero-nova-shop', type: 'EcommerceCatalogHero', props: { title: 'Flagship Storefront & Studio Catalog', subtitle: 'Explore our complete monograph of bespoke acoustic audio, artisan furniture, and minimalist daily essentials.', category1: 'ALL OBJECTS', category2: 'ACOUSTIC AUDIO', category3: 'ARTISAN LIVING', category4: 'CHRONOGRAPHS', activeCategory: 'ALL OBJECTS', itemCount: '24 STORE ITEMS' } },
          { id: 'grid8-nova-shop', type: 'EcommerceProductGrid8', props: { title: 'Full Storefront Product Catalog', subtitle: 'Browse all 24 curated goods with real-time stock availability and express dispatch.', p1Name: 'Aura Studio Wireless Headphones Pro', p1Price: '$349.00', p1OriginalPrice: '$420.00', p1Badge: 'BESTSELLER', p1Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80', p2Name: 'Nordic Ash Lounge Chair', p2Price: '$490.00', p2OriginalPrice: '$580.00', p2Badge: 'HANDCRAFTED', p2Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80', p3Name: 'Minimalist Chronograph Watch', p3Price: '$189.00', p3OriginalPrice: '$230.00', p3Badge: 'HOT DEAL', p3Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80', p4Name: 'Precision Desktop Audio Node', p4Price: '$279.00', p4OriginalPrice: '$340.00', p4Badge: 'NEW', p4Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80', p5Name: 'Beryllium Driver Studio Monitors', p5Price: '$590.00', p5OriginalPrice: '$690.00', p5Badge: 'STUDIO SPEC', p5Img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop&q=80', p6Name: 'Italian Lambskin Carry Case', p6Price: '$129.00', p6OriginalPrice: '$160.00', p6Badge: 'BESPOKE', p6Img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80', p7Name: 'Minimalist Matte Ceramic Vase', p7Price: '$89.00', p7OriginalPrice: '$110.00', p7Badge: 'POPULAR', p7Img: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=900&auto=format&fit=crop&q=80', p8Name: 'Anodized Titanium Fountain Pen', p8Price: '$95.00', p8OriginalPrice: '$125.00', p8Badge: 'LIMITED', p8Img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=900&auto=format&fit=crop&q=80' } },
          { id: 'rail-nova-shop', type: 'EcommerceProductsRail', props: { title: '02. Artisan Living & Furniture Monograph', subtitle: 'Swipe horizontally to explore handcrafted Scandinavian interior objects.', p1Name: 'Solid Oak Desk Lamp', p1Price: '$149.00', p1Img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80', p2Name: 'Modernist Architectural Side Table', p2Price: '$320.00', p2Img: 'https://images.unsplash.com/photo-1532372670720-1e7280700686?w=900&auto=format&fit=crop&q=80', p3Name: 'Nordic Concrete Planter', p3Price: '$75.00', p3Img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&auto=format&fit=crop&q=80', p4Name: 'Woven Wool Studio Throw', p4Price: '$110.00', p4Img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=80' } },
          { id: 'promo-nova-shop', type: 'EcommercePromoBanner', props: { promoBadge: 'AUTUMN COLLECTION 2026', headline: 'Exclusive 20% Off Launch Promotion', discountCode: 'STUDIO20', subtext: 'Applied automatically at checkout for all new studio patrons.', ctaText: 'Claim Discount' } },
          { id: 'trust-nova-shop', type: 'TrustCertificatesBadge', props: { title: 'VERIFIED STUDIO STANDARDS', cert1: 'AUTHENTICITY GUARANTEE', cert2: 'EXPRESS AIR DISPATCH', cert3: '2-YEAR WARRANTY' } },
          { id: 'footer-nova-shop', type: 'FooterAppStoreLinks', props: { brandName: 'NOVA MARKET', appStoreText: 'DOWNLOAD NOVA APP', copyrightText: '© 2026 Nova Market Studio Inc. All rights reserved.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Shop Catalog | Nova Market Studio',
            bodyBackground: '#090a0f',
            bodyTextColor: '#e2e8f0',
            fontFamily: 'font-sans'
          } as any
        }
      })
    },
    {
      id: 'nova-collections-page',
      name: 'Collections Showroom',
      slug: '/collections',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-nova-collections', type: 'NavbarECommerce', props: { brandName: 'NOVA MARKET', searchPlaceholder: 'Search collections...', cartCount: '3', ctaText: 'Cart', link1Text: 'Shop', link1Url: '/shop', link2Text: 'Collections', link2Url: '/collections', link3Text: 'About', link3Url: '/about' } },
          { id: 'hero-nova-collections', type: 'EcommerceCatalogHero', props: { title: 'Seasonal Collections & Curated Series', subtitle: 'Explore themed monographs: Acoustic Studio Hardware, Nordic Living, and Chronograph Accessories.', category1: 'ALL SERIES', category2: 'ACOUSTIC AUDIO', category3: 'ARTISAN LIVING', category4: 'CHRONOGRAPHS', activeCategory: 'ALL SERIES', itemCount: '3 SERIES MONOGRAPHS' } },
          { id: 'banner-nova-collections', type: 'EcommerceStorefrontBannerSlider', props: { badgeText: 'AUTUMN CURATED SPOTLIGHT', title: 'Flagship Hardware & Living Series', subtitle: 'Curated Scandinavian design objects and precision-engineered acoustic studio hardware.', ctaText: 'EXPLORE ALL SERIES', bannerImg1: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&auto=format&fit=crop&q=80', bannerImg2: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80', feature1Tag: 'AUDIO HARDWARE -20%', feature2Tag: 'ARTISAN FURNITURE -30%' } },
          { id: 'rail-collections-series1', type: 'EcommerceProductsRail', props: { title: '01. Acoustic Engineering Collection', subtitle: 'Precision active noise-cancelling headphones, desktop nodes, beryllium studio monitors, and vinyl turntables.', p1Name: 'Aura Studio Wireless Headphones Pro', p1Price: '$349.00', p1Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80', p2Name: 'Precision Desktop Audio Node', p2Price: '$279.00', p2Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80', p3Name: 'Beryllium Driver Studio Monitors', p3Price: '$590.00', p3Img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop&q=80', p4Name: 'Minimalist Vinyl Turntable', p4Price: '$680.00', p4Img: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=900&auto=format&fit=crop&q=80' } },
          { id: 'rail-collections-series2', type: 'EcommerceProductsRail', props: { title: '02. Nordic Artisan Living Collection', subtitle: 'Handcrafted solid ash lounge chairs, desk lamps, modernist side tables, and ceramic vessels.', p1Name: 'Nordic Ash Lounge Chair', p1Price: '$490.00', p1Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80', p2Name: 'Solid Oak Desk Lamp', p2Price: '$149.00', p2Img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80', p3Name: 'Modernist Architectural Side Table', p3Price: '$320.00', p3Img: 'https://images.unsplash.com/photo-1532372670720-1e7280700686?w=900&auto=format&fit=crop&q=80', p4Name: 'Minimalist Matte Ceramic Vase', p4Price: '$89.00', p4Img: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=900&auto=format&fit=crop&q=80' } },
          { id: 'rail-collections-series3', type: 'EcommerceProductsRail', props: { title: '03. Chronographs & Personal Essentials', subtitle: 'Bespoke chronograph timepieces, lambskin carry cases, titanium fountain pens, and polarized eyewear.', p1Name: 'Minimalist Chronograph Watch', p1Price: '$189.00', p1Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80', p2Name: 'Italian Lambskin Carry Case', p2Price: '$129.00', p2Img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80', p3Name: 'Anodized Titanium Fountain Pen', p3Price: '$95.00', p3Img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=900&auto=format&fit=crop&q=80', p4Name: 'Polarized Matte Eyewear', p4Price: '$165.00', p4Img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=80' } },
          { id: 'gallery-nova-collections', type: 'PortfolioMasonryGrid', props: { title: 'Visual Material & Hardware Monograph', item1Title: 'Anodized Aluminum Chassis', item1Category: 'ACOUSTIC HARDWARE', item1Img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80', item2Title: 'Nordic Solid Ash Grain', item2Category: 'ARTISAN FURNITURE', item2Img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80', item3Title: 'Italian Lambskin Cushion', item3Category: 'TACTILE CRAFTSMANSHIP', item3Img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'promo-nova-collections', type: 'EcommercePromoBanner', props: { promoBadge: 'AUTUMN COLLECTION 2026', headline: 'Exclusive 20% Off Launch Promotion', discountCode: 'STUDIO20', subtext: 'Applied automatically at checkout for all new studio patrons.', ctaText: 'Claim Discount' } },
          { id: 'trust-nova-collections', type: 'TrustCertificatesBadge', props: { title: 'VERIFIED STUDIO STANDARDS', cert1: 'AUTHENTICITY GUARANTEE', cert2: 'EXPRESS AIR DISPATCH', cert3: '2-YEAR WARRANTY' } },
          { id: 'footer-nova-collections', type: 'FooterAppStoreLinks', props: { brandName: 'NOVA MARKET', appStoreText: 'DOWNLOAD NOVA APP', copyrightText: '© 2026 Nova Market Studio Inc. All rights reserved.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Curated Collections | Nova Market Studio',
            bodyBackground: '#090a0f',
            bodyTextColor: '#e2e8f0',
            fontFamily: 'font-sans'
          } as any
        }
      })
    },
    {
      id: 'nova-product-detail-page',
      name: 'Product Detail',
      slug: '/product-detail',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-nova-detail', type: 'NavbarECommerce', props: { brandName: 'NOVA MARKET', searchPlaceholder: 'Search catalog...', cartCount: '3', ctaText: 'Cart', link1Text: 'Shop', link1Url: '/shop', link2Text: 'Collections', link2Url: '/collections', link3Text: 'About', link3Url: '/about' } },
          { id: 'spotlight-nova-detail', type: 'EcommerceFeatureHighlight', props: { productName: 'Aura Studio Wireless Headphones Pro', tagline: 'FLAGSHIP ACOUSTIC HARDWARE', price: '$349.00', description: 'Hand-assembled active noise-cancelling headphones crafted with brushed aluminum and authentic Italian lambskin leather.', feature1: '45dB Hybrid Active Noise Suppression', feature2: '40-Hour Continuous Battery Life', mainImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'compare-nova-detail', type: 'InteractiveComparisonSlider', props: { title: 'Acoustic Driver Precision View', beforeImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80', beforeLabel: 'Exterior Matte Finish', afterImg: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=80', afterLabel: 'Internal Acoustic Architecture' } },
          { id: 'features-nova-detail', type: 'FeatureListSplit', props: { badge: 'ATELIER COMMITMENT', title: 'Crafted for Perfection & Longevity', description: 'Every product in our catalog undergoes rigorous quality testing and comes backed by our lifetime craftsmanship guarantee.', feature1Title: '01. Express Global Logistics', feature1Desc: 'Carbon-neutral international delivery dispatched within 24 hours.', feature2Title: '02. 30-Day In-Home Trial', feature2Desc: 'Experience our goods in your space with hassle-free returns.', feature3Title: '03. 2-Year Full Replacement', feature3Desc: 'Comprehensive manufacturer warranty on all studio electronics.', cardImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'rail-nova-detail', type: 'EcommerceProductsRail', props: { title: 'Complementary Studio Objects', subtitle: 'Swipe horizontally to explore matching vinyl turntables and personal hardware.', p1Name: 'Minimalist Vinyl Turntable', p1Price: '$680.00', p1Img: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=900&auto=format&fit=crop&q=80', p2Name: 'Polarized Matte Eyewear', p2Price: '$165.00', p2Img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=80', p3Name: 'Hardware Key Ring Node', p3Price: '$45.00', p3Img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&auto=format&fit=crop&q=80', p4Name: 'Vacuum Tube Preamplifier', p4Price: '$420.00', p4Img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80' } },
          { id: 'reviews-nova-detail', type: 'Testimonials', props: { title: 'Verified Customer Reviews', subhead: 'Feedback from over 15,000 design-conscious patrons worldwide.' } },
          { id: 'faq-nova-detail', type: 'InteractiveFaqAccordionCard', props: { title: 'Product & Shipping Care FAQ', category: 'CUSTOMER SUPPORT', q1: 'What is the international delivery timeframe?', a1: 'Express air shipments deliver within 2-4 business days worldwide with real-time tracking.', q2: 'What warranty is included with Aura Headphones?', a2: 'All audio products include a 2-year full replacement warranty covering defects and battery health.', q3: 'How do I return an item?', a3: 'Initiate a free return within 30 days of delivery via your account order dashboard.' } },
          { id: 'footer-nova-detail', type: 'FooterAppStoreLinks', props: { brandName: 'NOVA MARKET', appStoreText: 'DOWNLOAD NOVA APP', copyrightText: '© 2026 Nova Market Studio Inc. All rights reserved.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Aura Studio Headphones | Nova Market',
            bodyBackground: '#090a0f',
            bodyTextColor: '#e2e8f0',
            fontFamily: 'font-sans'
          } as any
        }
      })
    },
    {
      id: 'nova-cart-page',
      name: 'Cart & Checkout',
      slug: '/cart',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-nova-cart', type: 'NavbarECommerce', props: { brandName: 'NOVA MARKET', searchPlaceholder: 'Search catalog...', cartCount: '2', ctaText: 'Cart', link1Text: 'Shop', link1Url: '/shop', link2Text: 'Collections', link2Url: '/collections', link3Text: 'About', link3Url: '/about' } },
          { id: 'cart-nova-summary', type: 'EcommerceCartSummary', props: { title: 'Shopping Cart & Order Summary', promoCode: 'STUDIO20', subtotal: '$839.00', shipping: 'FREE EXPRESS DISPATCH', discount: '-$167.80', total: '$671.20', checkoutUrl: '/cart' } },
          { id: 'security-nova-cart', type: 'FintechComplianceBadgeRow', props: { title: '256-BIT ENCRYPTED CHECKOUT', badge1: 'SSL SECURE', badge2: 'STRIPE PAY', badge3: 'VISA / MASTERCARD', badge4: 'APPLE PAY' } },
          { id: 'rail-nova-cart', type: 'EcommerceProductsRail', props: { title: 'Recommended Add-Ons for Your Order', subtitle: 'Enhance your setup with curated accessories dispatched together.', p1Name: 'Italian Lambskin Carry Case', p1Price: '$129.00', p1Img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80', p2Name: 'Anodized Titanium Fountain Pen', p2Price: '$95.00', p2Img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=900&auto=format&fit=crop&q=80', p3Name: 'Polarized Matte Eyewear', p3Price: '$165.00', p3Img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=80', p4Name: 'Hardware Key Ring Node', p4Price: '$45.00', p4Img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&auto=format&fit=crop&q=80' } },
          { id: 'trust-nova-cart', type: 'TrustCertificatesBadge', props: { title: 'PROTECTED PURCHASES', cert1: '30-DAY TRIAL', cert2: 'INSURED SHIPPING', cert3: 'ENCRYPTED DATA' } },
          { id: 'footer-nova-cart', type: 'FooterAppStoreLinks', props: { brandName: 'NOVA MARKET', appStoreText: 'DOWNLOAD NOVA APP', copyrightText: '© 2026 Nova Market Studio Inc. All rights reserved.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Cart & Checkout | Nova Market',
            bodyBackground: '#090a0f',
            bodyTextColor: '#e2e8f0',
            fontFamily: 'font-sans'
          } as any
        }
      })
    },
    {
      id: 'nova-about-page',
      name: 'About Story',
      slug: '/about',
      isHome: false,
      data: ensureContentIds({
        content: [
          { id: 'nav-nova-about', type: 'NavbarECommerce', props: { brandName: 'NOVA MARKET', searchPlaceholder: 'Search catalog...', cartCount: '3', ctaText: 'Cart', link1Text: 'Shop', link1Url: '/shop', link2Text: 'Collections', link2Url: '/collections', link3Text: 'About', link3Url: '/about' } },
          { id: 'hero-nova-about', type: 'HeroMinimalEditorial', props: { issueNo: 'ATELIER PHILOSOPHY', title: 'Form, Purity, and Structural Integrity', description: 'Nova Market is a modern goods atelier dedicated to crafting timeless objects that seamlessly fuse aesthetic clarity with high-performance function.', quote: '"Purity is not the absence of detail, but the absolute harmony of essential structure."', ctaText: 'Explore Catalog' } },
          { id: 'stat-nova-about', type: 'EditorialStatCallout', props: { statValue: '15,000+', statLabel: 'GLOBAL PATRONS', headline: 'Uncompromising Quality & Craftsmanship', description: 'Designed for longevity, instant responsiveness, and an effortless shopping experience.' } },
          { id: 'gallery-nova-about', type: 'PortfolioMasonryGrid', props: { title: 'Visual Material & Hardware Monograph', item1Title: 'Anodized Aluminum Chassis', item1Category: 'ACOUSTIC HARDWARE', item1Img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80', item2Title: 'Nordic Solid Ash Grain', item2Category: 'ARTISAN FURNITURE', item2Img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80', item3Title: 'Italian Lambskin Cushion', item3Category: 'TACTILE CRAFTSMANSHIP', item3Img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'features-nova-about', type: 'FeatureListSplit', props: { badge: 'ATELIER COMMITMENT', title: 'Crafted for Perfection & Longevity', description: 'Every product in our catalog undergoes rigorous quality testing and comes backed by our lifetime craftsmanship guarantee.', feature1Title: '01. Express Global Logistics', feature1Desc: 'Carbon-neutral international delivery dispatched within 24 hours.', feature2Title: '02. 30-Day In-Home Trial', feature2Desc: 'Experience our goods in your space with hassle-free returns.', feature3Title: '03. 2-Year Full Replacement', feature3Desc: 'Comprehensive manufacturer warranty on all studio electronics.', cardImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80' } },
          { id: 'quote-nova-about', type: 'EditorialQuoteBlock', props: { quote: 'We believe software and objects should share the same design language: quiet elegance, uncompromising utility, and enduring quality.', author: 'Kjetil Lindqvist', company: 'Lead Designer, Nova Market Studio' } },
          { id: 'footer-nova-about', type: 'FooterAppStoreLinks', props: { brandName: 'NOVA MARKET', appStoreText: 'DOWNLOAD NOVA APP', copyrightText: '© 2026 Nova Market Studio Inc. All rights reserved.' } }
        ] as any,
        zones: {},
        root: {
          props: {
            title: 'Our Story | Nova Market',
            bodyBackground: '#090a0f',
            bodyTextColor: '#e2e8f0',
            fontFamily: 'font-sans'
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
