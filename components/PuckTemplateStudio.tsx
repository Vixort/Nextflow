'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Puck, Config, Data, DropZone } from '@puckeditor/core'
import '@puckeditor/core/dist/index.css'
import {
  ArrowLeft, Save, Download, Globe, Check, AlertTriangle, X, Sparkles,
  Columns, Rows, Grid, Layout, Code, Minus, MoveVertical, Play, Star,
  HelpCircle, ShieldCheck, Zap, Lock, Award, HeartHandshake, Layers,
  Search, Bell, User, Menu, ChevronDown, Phone, Mail, Eye, Calendar,
  Clock, ArrowRight, CheckCircle2, ShoppingBag, Radio, MessageSquare,
  Share2, ShieldAlert, Cpu, Database, Terminal, Compass, ExternalLink,
  ChevronRight, ThumbsUp, Send, Smartphone, Monitor, FileText, Plus,
  Trash2, Copy, Home, Settings2
} from 'lucide-react'
import { WebsiteTemplate } from '@/types/supabase'
import {
  MultiPageProjectData, SitePage, normalizeMultiPageData, exportMultiPageZip,
  PAGE_PRESETS, generatePageSlug, DEFAULT_HOME_PAGE_DATA, ensureContentIds
} from '@/lib/puck/multiPageUtils'

interface PuckTemplateStudioProps {
  template: Partial<WebsiteTemplate>
  onBack: () => void
  onSave: (updatedData: {
    name: string
    category: string
    description: string
    grapesjs_data: any
    html_code: string
    css_code: string
    global_css: string
  }) => Promise<void>
}

// 105 AWWWARDS-GRADE PRESET COMPONENT PROPS TYPES
type ComponentProps = {
  // 1. HEADER & NAVBARS (15 PRESETS)
  Navbar: { brandName: string; ctaText: string; fixedTop: boolean; customClass: string; customCss: string }
  NavbarMinimal: { brandName: string; linkText: string; ctaText: string; fixedTop: boolean }
  NavbarCentred: { brandName: string; link1: string; link2: string; link3: string; link4: string; ctaText: string }
  NavbarFloatingPill: { brandName: string; link1: string; link2: string; link3: string; ctaText: string; pillGlow: boolean }
  NavbarMegaMenu: { brandName: string; solutionText: string; productText: string; resourceText: string; ctaSecondary: string; ctaPrimary: string }
  NavbarCyberpunk: { brandName: string; statusDot: string; monoStat: string; ctaText: string }
  NavbarLuxuryDark: { brandName: string; subtitle: string; ctaText: string }
  NavbarSplitCTA: { topPhone: string; topEmail: string; brandName: string; ctaText: string }
  NavbarAppHeader: { brandName: string; searchPlaceholder: string; userRole: string }
  NavbarGlassmorphism: { brandName: string; blurAmount: string; ctaText: string }
  NavbarGradientBorder: { brandName: string; gradientPreset: 'cyan-blue' | 'purple-cyan' | 'emerald-cyan'; ctaText: string }
  NavbarMobileFriendly: { brandName: string; ctaText: string }
  NavbarECommerce: { brandName: string; searchPlaceholder: string; cartCount: string; ctaText: string }
  NavbarNewsMagazine: { dateText: string; breakingNews: string; brandName: string; ctaText: string }
  NavbarBrutalist: { brandName: string; tagText: string; ctaText: string }

  // 2. HERO SECTIONS (15 PRESETS)
  Hero: { badge: string; title: string; gradientTitle: string; description: string; primaryCta: string; primaryUrl: string; secondaryCta: string; secondaryUrl: string; align: 'center' | 'left'; themeStyle: 'dark' | 'glass' | 'neon' | 'carbon'; padding: 'compact' | 'standard' | 'spacious'; customClass: string; customCss: string }
  HeroVideoModal: { badge: string; title: string; description: string; videoPosterUrl: string; ctaLabel: string; ctaUrl: string }
  HeroSplitImage: { badge: string; title: string; description: string; imageSrc: string; primaryCta: string; secondaryCta: string }
  HeroCyberpunkGlow: { badge: string; title: string; subtitle: string; ctaText: string; terminalLog: string }
  HeroMinimalSerif: { badge: string; headline: string; subheadline: string; ctaText: string }
  HeroAppMockup: { badge: string; headline: string; subhead: string; appFrameImg: string; primaryCta: string }
  HeroFormCapture: { badge: string; title: string; description: string; formButtonText: string; formPlaceholder: string }
  HeroGradientSphere: { badge: string; title: string; description: string; ctaText: string }
  HeroNewsletterSignup: { badge: string; title: string; description: string; buttonText: string }
  Hero3DCourse: { badge: string; title: string; instructor: string; rating: string; ctaText: string }
  HeroBentoGrid: { title: string; subhead: string; card1Text: string; card2Text: string; card3Text: string }
  HeroFloatingCards: { title: string; description: string; ctaText: string; card1Title: string; card2Title: string }
  HeroCountdownLaunch: { badge: string; title: string; countdownTime: string; notifyCta: string }
  HeroEventConference: { badge: string; title: string; dateLocation: string; ticketCta: string }
  HeroBrutalistRaw: { bigTitle: string; tagText: string; description: string; ctaText: string }

  // 3. FEATURES & BENTO (15 PRESETS)
  BentoGrid: { title: string; gradientTitle: string; subhead: string; card1Title: string; card1Desc: string; card2Title: string; card2Desc: string; card3Title: string; card3Desc: string; themeStyle: 'dark' | 'glass' | 'neon'; padding: 'compact' | 'standard'; customClass: string; customCss: string }
  BentoAsymmetric4: { title: string; card1Title: string; card1Desc: string; card2Title: string; card2Desc: string; card3Title: string; card3Desc: string; card4Title: string; card4Desc: string }
  BentoMetrics6: { title: string; stat1Val: string; stat1Lbl: string; stat2Val: string; stat2Lbl: string; stat3Val: string; stat3Lbl: string; stat4Val: string; stat4Lbl: string }
  FeatureListSplit: { badge: string; title: string; description: string; feature1Title: string; feature1Desc: string; feature2Title: string; feature2Desc: string; feature3Title: string; feature3Desc: string; cardImage: string }
  FeatureGridCards: { title: string; subhead: string; card1Title: string; card1Desc: string; card2Title: string; card2Desc: string; card3Title: string; card3Desc: string; card4Title: string; card4Desc: string }
  FeatureComparisonTable: { title: string; col1Title: string; col2Title: string; row1: string; row2: string; row3: string }
  FeatureStepProcess: { title: string; step1Title: string; step1Desc: string; step2Title: string; step2Desc: string; step3Title: string; step3Desc: string }
  FeatureInteractiveTabs: { title: string; tab1Label: string; tab1Content: string; tab2Label: string; tab2Content: string }
  StatsCounterGrid: { stat1Value: string; stat1Label: string; stat2Value: string; stat2Label: string; stat3Value: string; stat3Label: string; stat4Value: string; stat4Label: string }
  StatsSplitChart: { title: string; stat1: string; stat1Label: string; stat2: string; stat2Label: string; chartDesc: string }
  FeatureIconRows: { title: string; item1: string; item2: string; item3: string; item4: string }
  FeatureHoverCards: { title: string; card1: string; card2: string; card3: string }
  FeatureTimeline: { title: string; milestone1: string; milestone2: string; milestone3: string }
  FeatureTechStackGrid: { title: string; tech1: string; tech2: string; tech3: string; tech4: string; tech5: string; tech6: string }
  FeatureBentoDarkVoid: { title: string; subhead: string; card1: string; card2: string; card3: string }

  // 4. PORTFOLIO & SHOWCASE (12 PRESETS)
  PortfolioShowcase: { title: string; subhead: string; project1Title: string; project1Img: string; project1Tag: string; project2Title: string; project2Img: string; project2Tag: string; padding: 'compact' | 'standard'; customClass: string; customCss: string }
  PortfolioMasonryGrid: { title: string; p1Title: string; p1Img: string; p2Title: string; p2Img: string; p3Title: string; p3Img: string }
  PortfolioClientCarousel: { title: string; item1Title: string; item2Title: string; item3Title: string }
  PortfolioAppStoreScreens: { title: string; subhead: string; screen1Img: string; screen2Img: string }
  ClientLogosMarquee: { title: string; logo1Text: string; logo2Text: string; logo3Text: string; logo4Text: string; logo5Text: string }
  ClientLogosGrid: { title: string; logo1: string; logo2: string; logo3: string; logo4: string; logo5: string; logo6: string }
  CaseStudyDetailCard: { title: string; clientName: string; metricResult: string; description: string; ctaText: string }
  PortfolioFilterTabs: { title: string; tabAll: string; tabDesign: string; tabDev: string }
  PortfolioBeforeAfter: { title: string; beforeTitle: string; afterTitle: string; description: string }
  PortfolioVideoGrid: { title: string; video1Title: string; video2Title: string }
  PortfolioAwardBadges: { title: string; award1: string; award2: string; award3: string }
  PortfolioClientQuotes: { title: string; clientName: string; resultText: string; quote: string }

  // 5. TESTIMONIALS & FAQ (12 PRESETS)
  Testimonials: { title: string; quote1: string; author1: string; authorRole1: string; quote2: string; author2: string; authorRole2: string; padding: 'compact' | 'standard'; customClass: string; customCss: string }
  TestimonialGrid3: { title: string; q1: string; a1: string; q2: string; a2: string; q3: string; a3: string }
  TestimonialSingleHero: { quote: string; authorName: string; authorRole: string; companyLogo: string }
  TestimonialVideoCards: { title: string; video1Author: string; video2Author: string }
  TestimonialTwitterCards: { title: string; handle1: string; tweet1: string; handle2: string; tweet2: string }
  FaqAccordion: { title: string; subhead: string; q1Title: string; q1Answer: string; q2Title: string; q2Answer: string; q3Title: string; q3Answer: string }
  FaqGrid2Column: { title: string; q1: string; a1: string; q2: string; a2: string; q3: string; a3: string; q4: string; a4: string }
  FaqSearchable: { title: string; placeholder: string; q1: string; a1: string; q2: string; a2: string }
  FaqCategoryTabs: { title: string; tab1: string; tab2: string; q1: string; a1: string }
  TrustSecurityBadges: { title: string; badge1: string; badge2: string; badge3: string; badge4: string }
  CommunityDiscordCard: { title: string; memberCount: string; description: string; ctaText: string }
  WallOfLove: { title: string; tweet1: string; tweet2: string; tweet3: string }

  // 6. PRICING & CTA (15 PRESETS)
  PricingTable: { title: string; subhead: string; proPrice: string; proFeatures: string; enterprisePrice: string; enterpriseFeatures: string; highlightPro: boolean; padding: 'compact' | 'standard'; customClass: string; customCss: string }
  Pricing3TierToggle: { title: string; plan1Price: string; plan2Price: string; plan3Price: string }
  PricingComparisonMatrix: { title: string; feat1: string; feat2: string; feat3: string }
  PricingUsageBased: { title: string; pricePerUnit: string; unitName: string }
  PricingSinglePlan: { title: string; price: string; features: string; ctaText: string }
  CtaBanner: { title: string; subhead: string; buttonLabel: string; buttonUrl: string; variant: 'cyan' | 'purple' | 'glass'; padding: 'compact' | 'standard'; customClass: string; customCss: string }
  CtaSplitForm: { title: string; description: string; inputPlaceholder: string; buttonText: string }
  CtaAppDownload: { title: string; description: string; iosCta: string; androidCta: string }
  CtaUrgencyTimer: { title: string; timerText: string; buttonText: string }
  CtaGlassCard: { title: string; subhead: string; buttonText: string }
  CtaNewsletterPill: { title: string; inputPlaceholder: string; buttonText: string }
  CtaFullWidthVideo: { title: string; subhead: string; buttonText: string }
  CtaBookDemoCalendar: { title: string; subhead: string; calendarCta: string }
  CtaFreeTrialCard: { title: string; subhead: string; freeTrialText: string; buttonText: string }
  CtaDarkCyberpunk: { title: string; subhead: string; executeCta: string }

  // 7. FOOTERS (11 PRESETS)
  Footer: { brandName: string; description: string; copyrightText: string; link1: string; link2: string; link3: string; link4: string }
  FooterMinimalRail: { brandName: string; copyrightText: string; link1: string; link2: string }
  FooterNewsletterBig: { brandName: string; newsletterSubhead: string; copyrightText: string }
  FooterCyberpunkMono: { brandName: string; statusText: string; copyrightText: string }
  FooterAppStoreLinks: { brandName: string; appStoreText: string; copyrightText: string }
  FooterLuxurySerif: { brandName: string; tagLine: string; copyrightText: string }
  FooterMegaSiteMap: { brandName: string; col1Title: string; col2Title: string; copyrightText: string }
  FooterSocialIconsOnly: { brandName: string; copyrightText: string }
  FooterGradientBorder: { brandName: string; copyrightText: string }
  FooterBrutalistBox: { brandName: string; tag: string; copyrightText: string }
  FooterCenteredBrand: { brandName: string; tagline: string; copyrightText: string }

  // 8. CONTAINERS (3 PRESETS)
  FlexSection: { direction: 'row' | 'column'; justifyContent: string; alignItems: string; gap: string; width: string; customWidth: string; height: string; customHeight: string; minHeight: string; paddingTop: string; paddingBottom: string; paddingHorizontal: string; padding: string; background: string; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }
  GridColumns: { columns: '2' | '3' | '4'; gap: string; width: string; customWidth: string; height: string; customHeight: string; paddingTop: string; paddingBottom: string; paddingHorizontal: string; padding: string; background: string; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }
  CardBox: { title: string; variant: 'glass' | 'neon' | 'carbon'; width: string; customWidth: string; height: string; customHeight: string; paddingTop: string; paddingBottom: string; paddingHorizontal: string; padding: string; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }

  // 9. BASIC UI ELEMENTS (7 PRESETS)
  Heading: { text: string; level: 'h1' | 'h2' | 'h3' | 'h4'; fontSize: string; fontWeight: string; color: string; bgColor?: string; align: 'left' | 'center' | 'right'; gradient: boolean; customClass: string; customCss: string }
  Text: { text: string; fontSize: string; color: string; bgColor?: string; align: 'left' | 'center' | 'right'; customClass: string; customCss: string }
  Button: { label: string; url: string; variant: 'cyan' | 'glass' | 'outline' | 'gradient'; size: 'sm' | 'md' | 'lg'; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }
  Image: { src: string; alt: string; rounded: 'none' | 'lg' | '2xl' | 'full'; shadowGlow: boolean; borderColor?: string; customClass: string; customCss: string }
  PillBadge: { badgeText: string; variant: 'cyan' | 'purple' | 'emerald'; bgColor?: string; textColor?: string; borderColor?: string; customClass?: string; customCss?: string }
  Spacer: { height: string; bgColor?: string; customClass?: string; customCss?: string }
  Divider: { variant: 'solid' | 'dashed' | 'gradient'; color: string; thickness?: string; customClass?: string; customCss?: string }
}

// PAGE BODY ROOT SETTINGS PROPS TYPE
type RootProps = {
  title: string
  bodyBackground: string
  customBodyBackground: string
  bodyTextColor: string
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono'
  bodyPaddingTop: string
  bodyPaddingBottom: string
  bodyPaddingHorizontal: string
  bodyPadding: string
  bodyMargin: string
  bodyMaxWidth: string
  customBodyClass: string
  customBodyCss: string
}

// WORDPRESS / ELEMENTOR-GRADE HIGH-AESTHETIC PRESET COMPONENTS
const puckConfig: Config<ComponentProps, RootProps> = {
  root: {
    fields: {
      title: { type: 'text', label: 'Page Title' },
      bodyBackground: {
        type: 'select',
        label: 'Page Body Background Surface',
        options: [
          { label: 'Deep Dark Void (#090a0f)', value: '#090a0f' },
          { label: 'Dark Carbon (#050608)', value: '#050608' },
          { label: 'Slate Gray (#0f111a)', value: '#0f111a' },
          { label: 'Pure White (#ffffff)', value: '#ffffff' },
          { label: 'Transparent', value: 'transparent' },
          { label: 'Custom Color / Gradient', value: 'custom' },
        ],
      },
      customBodyBackground: { type: 'text', label: 'Custom Body Background' },
      bodyTextColor: { type: 'text', label: 'Page Body Text Color' },
      fontFamily: {
        type: 'select',
        label: 'Global Font Family',
        options: [
          { label: 'Modern Sans (Inter / System)', value: 'font-sans' },
          { label: 'Editorial Serif', value: 'font-serif' },
          { label: 'Cyber Mono', value: 'font-mono' },
        ],
      },
      bodyPaddingTop: { type: 'text', label: 'Body Padding Top' },
      bodyPaddingBottom: { type: 'text', label: 'Body Padding Bottom' },
      bodyPaddingHorizontal: { type: 'text', label: 'Body Padding Left/Right' },
      bodyPadding: { type: 'text', label: 'Body Padding Override' },
      bodyMargin: { type: 'text', label: 'Body Margin' },
      bodyMaxWidth: { type: 'text', label: 'Body Max Width' },
      customBodyClass: { type: 'text', label: 'Advanced Tailwind Classes' },
      customBodyCss: { type: 'textarea', label: 'Page Body Raw CSS' },
    },
    defaultProps: {
      title: 'Untitled Website Page',
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
    },
    render: ({ children, bodyBackground, customBodyBackground, bodyTextColor, fontFamily, bodyPaddingTop, bodyPaddingBottom, bodyPaddingHorizontal, bodyPadding, bodyMargin, bodyMaxWidth, customBodyClass, customBodyCss }) => {
      const bg = bodyBackground === 'custom' ? customBodyBackground || '#090a0f' : bodyBackground || '#090a0f'
      const pt = bodyPaddingTop ? (bodyPaddingTop.includes('p') ? bodyPaddingTop : `${bodyPaddingTop}`) : ''
      const pb = bodyPaddingBottom ? (bodyPaddingBottom.includes('p') ? bodyPaddingBottom : `${bodyPaddingBottom}`) : ''
      const px = bodyPaddingHorizontal ? (bodyPaddingHorizontal.includes('p') ? bodyPaddingHorizontal : `${bodyPaddingHorizontal}`) : ''

      const bodyStyle: React.CSSProperties = {
        background: bg,
        color: bodyTextColor || '#e2e8f0',
        maxWidth: bodyMaxWidth || '100%',
        margin: bodyMargin || '0 auto',
        paddingTop: !pt.startsWith('p') ? pt : undefined,
        paddingBottom: !pb.startsWith('p') ? pb : undefined,
        paddingLeft: !px.startsWith('p') ? px : undefined,
        paddingRight: !px.startsWith('p') ? px : undefined,
        ...parseCustomCss(customBodyCss),
      }

      const classPadding = bodyPadding || `${pt.startsWith('p') ? pt : ''} ${pb.startsWith('p') ? pb : ''} ${px.startsWith('p') ? px : ''}`

      return (
        <div className={`min-h-screen w-full ${fontFamily || 'font-sans'} ${classPadding} ${customBodyClass || ''}`} style={bodyStyle}>
          {children}
        </div>
      )
    },
  },

  // 9 CATEGORIES (105 TOTAL PRESETS)
  categories: {
    navbars: {
      title: 'Header & Navbar (15 Presets)',
      components: [
        'Navbar', 'NavbarMinimal', 'NavbarCentred', 'NavbarFloatingPill', 'NavbarMegaMenu',
        'NavbarCyberpunk', 'NavbarLuxuryDark', 'NavbarSplitCTA', 'NavbarAppHeader', 'NavbarGlassmorphism',
        'NavbarGradientBorder', 'NavbarMobileFriendly', 'NavbarECommerce', 'NavbarNewsMagazine', 'NavbarBrutalist'
      ],
      defaultExpanded: true,
    },
    heros: {
      title: 'Hero-Section (15 Presets)',
      components: [
        'Hero', 'HeroVideoModal', 'HeroSplitImage', 'HeroCyberpunkGlow', 'HeroMinimalSerif',
        'HeroAppMockup', 'HeroFormCapture', 'HeroGradientSphere', 'HeroNewsletterSignup', 'Hero3DCourse',
        'HeroBentoGrid', 'HeroFloatingCards', 'HeroCountdownLaunch', 'HeroEventConference', 'HeroBrutalistRaw'
      ],
      defaultExpanded: false,
    },
    features: {
      title: 'Features & Bento-Grid (15 Presets)',
      components: [
        'BentoGrid', 'BentoAsymmetric4', 'BentoMetrics6', 'FeatureListSplit', 'FeatureGridCards',
        'FeatureComparisonTable', 'FeatureStepProcess', 'FeatureInteractiveTabs', 'StatsCounterGrid', 'StatsSplitChart',
        'FeatureIconRows', 'FeatureHoverCards', 'FeatureTimeline', 'FeatureTechStackGrid', 'FeatureBentoDarkVoid'
      ],
      defaultExpanded: false,
    },
    showcases: {
      title: 'Portfolio & Showcase (12 Presets)',
      components: [
        'PortfolioShowcase', 'PortfolioMasonryGrid', 'PortfolioClientCarousel', 'PortfolioAppStoreScreens',
        'ClientLogosMarquee', 'ClientLogosGrid', 'CaseStudyDetailCard', 'PortfolioFilterTabs',
        'PortfolioBeforeAfter', 'PortfolioVideoGrid', 'PortfolioAwardBadges', 'PortfolioClientQuotes'
      ],
      defaultExpanded: false,
    },
    socialProof: {
      title: 'Testimonials & FAQ (12 Presets)',
      components: [
        'Testimonials', 'TestimonialGrid3', 'TestimonialSingleHero', 'TestimonialVideoCards', 'TestimonialTwitterCards',
        'FaqAccordion', 'FaqGrid2Column', 'FaqSearchable', 'FaqCategoryTabs', 'TrustSecurityBadges',
        'CommunityDiscordCard', 'WallOfLove'
      ],
      defaultExpanded: false,
    },
    pricing: {
      title: 'Pricing & CTA-Section (15 Presets)',
      components: [
        'PricingTable', 'Pricing3TierToggle', 'PricingComparisonMatrix', 'PricingUsageBased', 'PricingSinglePlan',
        'CtaBanner', 'CtaSplitForm', 'CtaAppDownload', 'CtaUrgencyTimer', 'CtaGlassCard',
        'CtaNewsletterPill', 'CtaFullWidthVideo', 'CtaBookDemoCalendar', 'CtaFreeTrialCard', 'CtaDarkCyberpunk'
      ],
      defaultExpanded: false,
    },
    footers: {
      title: 'Footer-Section (11 Presets)',
      components: [
        'Footer', 'FooterMinimalRail', 'FooterNewsletterBig', 'FooterCyberpunkMono', 'FooterAppStoreLinks',
        'FooterLuxurySerif', 'FooterMegaSiteMap', 'FooterSocialIconsOnly', 'FooterGradientBorder', 'FooterBrutalistBox',
        'FooterCenteredBrand'
      ],
      defaultExpanded: false,
    },
    containers: {
      title: 'Layout Containers (DropZones) (3 Presets)',
      components: ['FlexSection', 'GridColumns', 'CardBox'],
      defaultExpanded: false,
    },
    atomic: {
      title: 'Basic UI Elements (7 Presets)',
      components: ['Heading', 'Text', 'Button', 'Image', 'PillBadge', 'Spacer', 'Divider'],
      defaultExpanded: false,
    },
  },

  components: {
    // 1. NAVBARS (15 PRESETS)
    Navbar: {
      fields: { brandName: { type: 'text' }, ctaText: { type: 'text' }, fixedTop: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { brandName: 'NEXTFLOW.', ctaText: 'Sign In', fixedTop: false, customClass: '', customCss: '' },
      render: ({ brandName, ctaText, fixedTop, customClass, customCss }) => (
        <header className={`px-4 sm:px-8 py-4 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between font-sans text-white ${fixedTop ? 'sticky top-0 z-40' : ''} ${customClass}`} style={parseCustomCss(customCss)}>
          <div className="text-base font-black tracking-tight text-white flex items-center gap-1">{brandName}<span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /></div>
          <nav className="hidden md:flex gap-8 text-xs text-slate-300 font-semibold"><a href="/" className="hover:text-cyan-400">Home</a><a href="/about" className="hover:text-cyan-400">About</a><a href="/services" className="hover:text-cyan-400">Services</a><a href="/pricing" className="hover:text-cyan-400">Pricing</a><a href="/contact" className="hover:text-cyan-400">Contact</a></nav>
          <a href="/pricing" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs shadow-md">{ctaText}</a>
        </header>
      )
    },
    NavbarMinimal: {
      fields: { brandName: { type: 'text' }, linkText: { type: 'text' }, ctaText: { type: 'text' }, fixedTop: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] } },
      defaultProps: { brandName: 'AETHER', linkText: 'Overview', ctaText: 'Get Access', fixedTop: false },
      render: ({ brandName, linkText, ctaText, fixedTop }) => (
        <header className={`px-4 sm:px-6 py-3.5 bg-[#050608] border-b border-white/10 flex items-center justify-between font-sans text-white ${fixedTop ? 'sticky top-0 z-40' : ''}`}>
          <div className="font-extrabold tracking-widest text-xs uppercase text-slate-300">{brandName}</div>
          <div className="flex items-center gap-6"><a href="/about" className="text-xs text-slate-400">{linkText}</a><a href="/pricing" className="text-xs font-bold text-cyan-400">{ctaText}</a></div>
        </header>
      )
    },
    NavbarCentred: {
      fields: { brandName: { type: 'text' }, link1: { type: 'text' }, link2: { type: 'text' }, link3: { type: 'text' }, link4: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'N E X U S', link1: 'Products', link2: 'Solutions', link3: 'Docs', link4: 'Company', ctaText: 'Launch App' },
      render: ({ brandName, link1, link2, link3, link4, ctaText }) => (
        <header className="px-4 sm:px-8 py-4 bg-[#0f111a]/80 backdrop-blur-2xl border-b border-white/10 font-sans text-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <nav className="hidden sm:flex gap-6 text-xs text-slate-300"><a href="/">{link1}</a><a href="/services">{link2}</a></nav>
            <div className="text-sm font-black tracking-[0.25em] text-white uppercase">{brandName}</div>
            <div className="flex items-center gap-6 text-xs"><a href="/about" className="hidden sm:inline text-slate-300">{link3}</a><a href="/pricing" className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold">{ctaText}</a></div>
          </div>
        </header>
      )
    },
    NavbarFloatingPill: {
      fields: { brandName: { type: 'text' }, link1: { type: 'text' }, link2: { type: 'text' }, link3: { type: 'text' }, ctaText: { type: 'text' }, pillGlow: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] } },
      defaultProps: { brandName: 'PULSE.', link1: 'Features', link2: 'Services', link3: 'Pricing', ctaText: 'Try Free', pillGlow: true },
      render: ({ brandName, link1, link2, link3, ctaText, pillGlow }) => (
        <div className="py-4 px-4 bg-transparent">
          <header className={`max-w-4xl mx-auto px-6 py-3 rounded-full bg-[#0f111a]/90 backdrop-blur-2xl flex items-center justify-between font-sans text-white ${pillGlow ? 'border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border border-white/15'}`}>
            <div className="text-sm font-black text-white">{brandName}</div>
            <nav className="hidden sm:flex gap-6 text-xs text-slate-300"><a href="/">{link1}</a><a href="/services">{link2}</a><a href="/pricing">{link3}</a></nav>
            <a href="/contact" className="px-5 py-2 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs">{ctaText}</a>
          </header>
        </div>
      )
    },
    NavbarMegaMenu: {
      fields: { brandName: { type: 'text' }, solutionText: { type: 'text' }, productText: { type: 'text' }, resourceText: { type: 'text' }, ctaSecondary: { type: 'text' }, ctaPrimary: { type: 'text' } },
      defaultProps: { brandName: 'ENTERPRISE FLOW', solutionText: 'Solutions', productText: 'Modules', resourceText: 'Developer Hub', ctaSecondary: 'Docs', ctaPrimary: 'Book Demo' },
      render: ({ brandName, solutionText, productText, resourceText, ctaSecondary, ctaPrimary }) => (
        <header className="px-6 py-4 bg-[#090a0f] border-b border-white/10 font-sans text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8"><div className="text-xs font-black tracking-wider text-white flex items-center gap-2"><span className="w-3 h-3 bg-cyan-500 rounded-xs" />{brandName}</div><nav className="hidden lg:flex gap-6 text-xs text-slate-300"><button className="flex items-center gap-1">{solutionText} <ChevronDown size={12}/></button><button className="flex items-center gap-1">{productText} <ChevronDown size={12}/></button><a href="/about">{resourceText}</a></nav></div>
            <div className="flex items-center gap-3 text-xs"><a href="/services" className="px-4 py-2 text-slate-300">{ctaSecondary}</a><a href="/contact" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black">{ctaPrimary}</a></div>
          </div>
        </header>
      )
    },
    NavbarCyberpunk: {
      fields: { brandName: { type: 'text' }, statusDot: { type: 'text' }, monoStat: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: '// CYBERPULSE-v4.0', statusDot: 'SYSTEM ONLINE', monoStat: 'PING 0.4ms', ctaText: '[ EXECUTE ]' },
      render: ({ brandName, statusDot, monoStat, ctaText }) => (
        <header className="px-6 py-3 bg-[#050608] border-b border-cyan-500/40 font-mono text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-3"><span className="text-cyan-400 font-extrabold tracking-widest">{brandName}</span><span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />{statusDot}</span></div>
          <div className="flex items-center gap-6"><span className="text-slate-500 text-[11px] hidden sm:inline">{monoStat}</span><a href="/pricing" className="px-4 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold">{ctaText}</a></div>
        </header>
      )
    },
    NavbarLuxuryDark: {
      fields: { brandName: { type: 'text' }, subtitle: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'HAUTE ARCHITECTURE', subtitle: 'Issue No. 04', ctaText: 'Request Atelier Dossier' },
      render: ({ brandName, subtitle, ctaText }) => (
        <header className="px-8 py-6 bg-[#090a0f] border-b border-white/10 font-serif text-white flex items-center justify-between">
          <div><div className="text-base tracking-[0.2em] uppercase">{brandName}</div><span className="text-[9px] font-sans text-slate-400 uppercase tracking-widest block">{subtitle}</span></div>
          <a href="/contact" className="text-xs font-sans uppercase tracking-widest text-slate-300 border-b border-white/30 pb-0.5">{ctaText}</a>
        </header>
      )
    },
    NavbarSplitCTA: {
      fields: { topPhone: { type: 'text' }, topEmail: { type: 'text' }, brandName: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { topPhone: '+1 (800) 555-FLOW', topEmail: 'support@nextflow.io', brandName: 'NEXTFLOW PRO', ctaText: 'Client Portal' },
      render: ({ topPhone, topEmail, brandName, ctaText }) => (
        <header className="font-sans text-white">
          <div className="px-8 py-1.5 bg-[#050608] border-b border-white/5 flex justify-between items-center text-[10px] text-slate-400"><div className="flex gap-6"><span className="flex items-center gap-1.5"><Phone size={10} className="text-cyan-400" /> {topPhone}</span><span className="flex items-center gap-1.5"><Mail size={10} className="text-cyan-400" /> {topEmail}</span></div><span>Global SLA Support: 24/7</span></div>
          <div className="px-8 py-4 bg-[#090a0f] border-b border-white/10 flex justify-between items-center"><div className="text-base font-black text-white">{brandName}</div><a href="/contact" className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">{ctaText}</a></div>
        </header>
      )
    },
    NavbarAppHeader: {
      fields: { brandName: { type: 'text' }, searchPlaceholder: { type: 'text' }, userRole: { type: 'text' } },
      defaultProps: { brandName: 'WORKSPACE ENGINE', searchPlaceholder: 'Search workflows (⌘K)...', userRole: 'ADMIN OWNER' },
      render: ({ brandName, searchPlaceholder, userRole }) => (
        <header className="px-6 py-3 bg-[#0f111a] border-b border-white/10 font-sans text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-6"><div className="font-extrabold text-white text-sm">{brandName}</div><div className="relative hidden md:block w-72"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" readOnly placeholder={searchPlaceholder} className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#090a0f] border border-white/10 text-xs text-slate-300 focus:outline-none"/></div></div>
          <div className="flex items-center gap-4"><button className="p-2 rounded-xl bg-white/5 text-slate-300 relative"><Bell size={15}/><span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5"/></button><div className="flex items-center gap-2 border-l border-white/10 pl-4"><div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs"><User size={14}/></div><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{userRole}</span></div></div>
        </header>
      )
    },
    NavbarGlassmorphism: {
      fields: { brandName: { type: 'text' }, blurAmount: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'AURA GLASS', blurAmount: 'blur-3xl', ctaText: 'Explore' },
      render: ({ brandName, ctaText }) => (
        <header className="px-8 py-4 bg-white/5 backdrop-blur-3xl border-b border-white/10 font-sans text-white flex items-center justify-between">
          <div className="text-base font-extrabold text-white">{brandName}</div>
          <nav className="hidden sm:flex gap-8 text-xs text-slate-300 font-medium"><a href="/">Architecture</a><a href="/services">Ecosystem</a><a href="/pricing">Pricing</a></nav>
          <a href="/contact" className="px-5 py-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">{ctaText}</a>
        </header>
      )
    },
    NavbarGradientBorder: {
      fields: { brandName: { type: 'text' }, gradientPreset: { type: 'select', options: [{ label: 'Cyan-Blue', value: 'cyan-blue' }, { label: 'Purple-Cyan', value: 'purple-cyan' }] }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'STREAMLINE.', gradientPreset: 'cyan-blue', ctaText: 'Get Started' },
      render: ({ brandName, ctaText }) => (
        <header className="bg-[#090a0f] font-sans text-white relative">
          <div className="px-8 py-4 flex items-center justify-between"><div className="text-base font-black text-white">{brandName}</div><nav className="hidden sm:flex gap-8 text-xs text-slate-300 font-semibold"><a href="/">Overview</a><a href="/services">Specs</a><a href="/about">Docs</a></nav><a href="/pricing" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs">{ctaText}</a></div>
          <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500" />
        </header>
      )
    },
    NavbarMobileFriendly: {
      fields: { brandName: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'POCKET APP', ctaText: 'Open App' },
      render: ({ brandName, ctaText }) => (
        <header className="px-4 py-3 bg-[#090a0f] border-b border-white/10 font-sans text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-3"><button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"><Menu size={16} /></button><span className="font-extrabold text-white text-sm">{brandName}</span></div>
          <a href="/pricing" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs">{ctaText}</a>
        </header>
      )
    },
    NavbarECommerce: {
      fields: { brandName: { type: 'text' }, searchPlaceholder: { type: 'text' }, cartCount: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'LUMEN STORE', searchPlaceholder: 'Search products...', cartCount: '3', ctaText: 'Checkout' },
      render: ({ brandName, searchPlaceholder, cartCount, ctaText }) => (
        <header className="px-6 py-3.5 bg-[#0d0f19] border-b border-white/10 font-sans text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-6"><div className="font-black text-cyan-400 text-base">{brandName}</div><div className="relative w-64 hidden md:block"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" readOnly placeholder={searchPlaceholder} className="w-full pl-8 pr-3 py-1.5 bg-[#090a0f] border border-white/10 rounded-xl text-xs text-slate-300"/></div></div>
          <div className="flex items-center gap-4"><button className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-slate-300"><ShoppingBag size={14}/><span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">{cartCount}</span></button><a href="/pricing" className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl">{ctaText}</a></div>
        </header>
      )
    },
    NavbarNewsMagazine: {
      fields: { dateText: { type: 'text' }, breakingNews: { type: 'text' }, brandName: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { dateText: 'SUNDAY, AUGUST 2026', breakingNews: 'BREAKING: Nextflow 4.0 Released With Multi-Page Engine', brandName: 'THE CHRONICLE', ctaText: 'Subscribe' },
      render: ({ dateText, breakingNews, brandName, ctaText }) => (
        <header className="font-sans text-white bg-[#090a0f] border-b border-white/10">
          <div className="px-6 py-1.5 bg-[#050608] border-b border-white/5 flex justify-between items-center text-[10px] text-slate-400"><span>{dateText}</span><span className="text-cyan-400 font-semibold truncate max-w-md">{breakingNews}</span></div>
          <div className="px-6 py-4 flex justify-between items-center"><div className="text-xl font-serif tracking-widest text-white font-bold">{brandName}</div><a href="/pricing" className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs">{ctaText}</a></div>
        </header>
      )
    },
    NavbarBrutalist: {
      fields: { brandName: { type: 'text' }, tagText: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'RAW_FOUNDATION', tagText: '[ MULTI_PAGE ]', ctaText: 'ENTER_SYSTEM' },
      render: ({ brandName, tagText, ctaText }) => (
        <header className="px-6 py-4 bg-black border-b-2 border-white font-mono text-white flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-sm"><span>{brandName}</span><span className="text-cyan-400 text-xs">{tagText}</span></div>
          <a href="/services" className="px-4 py-2 bg-white text-black font-black text-xs hover:bg-cyan-400 border border-white">{ctaText}</a>
        </header>
      )
    },

    // 2. HERO SECTIONS (15 PRESETS)
    Hero: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, gradientTitle: { type: 'text' }, description: { type: 'textarea' }, primaryCta: { type: 'text' }, primaryUrl: { type: 'text' }, secondaryCta: { type: 'text' }, secondaryUrl: { type: 'text' }, align: { type: 'radio', options: [{ label: 'Center', value: 'center' }, { label: 'Left', value: 'left' }] }, themeStyle: { type: 'select', options: [{ label: 'Glass', value: 'glass' }, { label: 'Neon', value: 'neon' }] }, padding: { type: 'select', options: [{ label: 'Standard', value: 'standard' }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { badge: 'NEXT-GEN ARCHITECTURE', title: 'Craft Extraordinary Digital Experiences', gradientTitle: 'With Precision & Speed', description: 'Empower your enterprise with autonomous workflows and high-frequency database sync.', primaryCta: 'Explore Showcase', primaryUrl: '/services', secondaryCta: 'View Specs', secondaryUrl: '/about', align: 'center', themeStyle: 'glass', padding: 'standard', customClass: '', customCss: '' },
      render: ({ badge, title, gradientTitle, description, primaryCta, primaryUrl, secondaryCta, secondaryUrl }) => (
        <section className="py-24 px-6 bg-[#090a0f] text-white font-sans relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto">
            {badge && <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-6 uppercase tracking-widest"><Sparkles size={12}/>{badge}</span>}
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">{title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{gradientTitle}</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">{description}</p>
            <div className="flex justify-center gap-4"><a href={primaryUrl || '/services'} className="px-8 py-4 rounded-2xl font-black bg-cyan-500 text-slate-950 text-sm shadow-lg">{primaryCta}</a><a href={secondaryUrl || '/about'} className="px-8 py-4 rounded-2xl font-bold bg-white/5 text-white border border-white/15 text-sm">{secondaryCta}</a></div>
          </div>
        </section>
      )
    },
    HeroVideoModal: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, videoPosterUrl: { type: 'text' }, ctaLabel: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { badge: 'WATCH PLATFORM DEMO', title: 'See How Nextflow Transforms Architecture', description: 'Watch a 2-minute explainer walkthrough of our visual template engine.', videoPosterUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80', ctaLabel: 'Get Started Free', ctaUrl: '/pricing' },
      render: ({ badge, title, description, videoPosterUrl, ctaUrl }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white text-center font-sans">
          <div className="max-w-4xl mx-auto mb-10"><span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-4 uppercase"><Play size={12}/>{badge}</span><h1 className="text-4xl font-black mb-3">{title}</h1><p className="text-slate-400 text-sm">{description}</p></div>
          <div className="max-w-3xl mx-auto relative rounded-3xl overflow-hidden border border-cyan-500/30"><img src={videoPosterUrl} alt="Demo" className="w-full aspect-video object-cover"/><div className="absolute inset-0 bg-black/50 flex items-center justify-center"><a href={ctaUrl || '/pricing'} className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl"><Play size={24} className="fill-current ml-1"/></a></div></div>
        </section>
      )
    },
    HeroSplitImage: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, imageSrc: { type: 'text' }, primaryCta: { type: 'text' }, secondaryCta: { type: 'text' } },
      defaultProps: { badge: 'HIGH VELOCITY', title: 'Accelerate Development Without Code Debt', description: 'Build enterprise visual pages with clean TypeScript props.', imageSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', primaryCta: 'Start Free Trial', secondaryCta: 'Documentation' },
      render: ({ badge, title, description, imageSrc, primaryCta, secondaryCta }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-6 uppercase"><Zap size={12}/>{badge}</span><h1 className="text-4xl font-extrabold mb-4">{title}</h1><p className="text-slate-400 text-sm mb-8 leading-relaxed">{description}</p><div className="flex gap-4"><a href="/pricing" className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">{primaryCta}</a><a href="/about" className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/15">{secondaryCta}</a></div></div><div className="rounded-3xl overflow-hidden border border-cyan-500/30"><img src={imageSrc} alt="Hero Split" className="w-full aspect-4/3 object-cover"/></div></div></section>
      )
    },
    HeroCyberpunkGlow: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, subtitle: { type: 'text' }, ctaText: { type: 'text' }, terminalLog: { type: 'text' } },
      defaultProps: { badge: '// SYSTEM READY', title: 'AUTONOMOUS WORKFLOW ENGINE', subtitle: 'Execute sub-millisecond database pipelines with Zero-Trust security.', ctaText: '> DEPLOY_SYSTEM', terminalLog: '$ status: 200 OK | ping: 0.2ms' },
      render: ({ badge, title, subtitle, ctaText, terminalLog }) => (
        <section className="py-24 px-6 bg-[#050608] border-b border-cyan-500/30 font-mono text-white text-center"><div className="max-w-4xl mx-auto"><span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs mb-6 inline-block">{badge}</span><h1 className="text-4xl font-extrabold text-cyan-400 mb-4">{title}</h1><p className="text-slate-400 text-xs max-w-xl mx-auto mb-8">{subtitle}</p><div className="mb-8 inline-block px-4 py-2 rounded bg-black border border-white/10 text-slate-500 text-xs">{terminalLog}</div><div><a href="/pricing" className="px-8 py-3.5 rounded bg-cyan-500 text-slate-950 font-bold text-xs shadow-[0_0_30px_rgba(6,182,212,0.4)]">{ctaText}</a></div></div></section>
      )
    },
    HeroMinimalSerif: {
      fields: { badge: { type: 'text' }, headline: { type: 'text' }, subheadline: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { badge: 'COLLECTION 2026', headline: 'Purity in Architectural Expression', subheadline: 'Minimalist design systems engineered for discerning editorial creators.', ctaText: 'Discover Monograph' },
      render: ({ badge, headline, subheadline, ctaText }) => (
        <section className="py-28 px-8 bg-[#090a0f] font-serif text-white text-center"><div className="max-w-3xl mx-auto"><span className="text-[10px] font-sans tracking-[0.25em] text-slate-400 uppercase mb-6 block">{badge}</span><h1 className="text-5xl font-normal leading-tight mb-6">{headline}</h1><p className="font-sans text-xs text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">{subheadline}</p><a href="/about" className="font-sans text-xs uppercase tracking-widest text-slate-200 border-b border-white/40 pb-1">{ctaText}</a></div></section>
      )
    },
    HeroAppMockup: {
      fields: { badge: { type: 'text' }, headline: { type: 'text' }, subhead: { type: 'text' }, appFrameImg: { type: 'text' }, primaryCta: { type: 'text' } },
      defaultProps: { badge: 'NEXTFLOW DESKTOP', headline: 'The Visual Workspace Built For Speed', subhead: 'Manage templates, database schema, and automated workflows in one dark UI.', appFrameImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80', primaryCta: 'Download App' },
      render: ({ badge, headline, subhead, appFrameImg, primaryCta }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white text-center font-sans"><div className="max-w-4xl mx-auto mb-10"><span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase mb-4 inline-block">{badge}</span><h1 className="text-4xl font-extrabold mb-3">{headline}</h1><p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">{subhead}</p><a href="/services" className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block shadow-lg">{primaryCta}</a></div><div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/15 shadow-2xl p-2 bg-[#0f111a]"><img src={appFrameImg} alt="App" className="w-full rounded-xl"/></div></section>
      )
    },
    HeroFormCapture: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, formButtonText: { type: 'text' }, formPlaceholder: { type: 'text' } },
      defaultProps: { badge: 'EARLY ACCESS', title: 'Join The Next Generation Web Builder', description: 'Be the first to access 100+ production presets and automated Supabase sync.', formButtonText: 'Get Invite', formPlaceholder: 'Enter your work email...' },
      render: ({ badge, title, description, formButtonText, formPlaceholder }) => (
        <section className="py-24 px-6 bg-[#0d0f19] text-white text-center font-sans"><div className="max-w-3xl mx-auto"><span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6 uppercase inline-block">{badge}</span><h1 className="text-4xl font-extrabold mb-4">{title}</h1><p className="text-slate-400 text-sm mb-8">{description}</p><div className="max-w-md mx-auto flex gap-2"><input type="email" readOnly placeholder={formPlaceholder} className="flex-1 px-4 py-3 rounded-xl bg-[#090a0f] border border-white/15 text-xs text-slate-200 focus:outline-none"/><button className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs">{formButtonText}</button></div></div></section>
      )
    },
    HeroGradientSphere: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, ctaText: { type: 'text' } },
      defaultProps: { badge: 'NEON MATRIX', title: 'Boundless Infinite Possibilities', description: 'Create dynamic multi-column layouts with real-time responsive previewing.', ctaText: 'Launch Studio' },
      render: ({ badge, title, description, ctaText }) => (
        <section className="py-28 px-6 bg-[#090a0f] text-white text-center font-sans relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"/><div className="relative z-10 max-w-3xl mx-auto"><span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase mb-6 inline-block">{badge}</span><h1 className="text-5xl font-black mb-4">{title}</h1><p className="text-slate-400 text-sm mb-8">{description}</p><a href="/pricing" className="px-8 py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl text-xs inline-block shadow-xl">{ctaText}</a></div></section>
      )
    },
    HeroNewsletterSignup: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, buttonText: { type: 'text' } },
      defaultProps: { badge: 'WEEKLY INSIGHTS', title: 'Master Next.js & Supabase Architecture', description: 'Subscribe to receive weekly deep-dives into modern web development and design systems.', buttonText: 'Subscribe Free' },
      render: ({ badge, title, description, buttonText }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white text-center font-sans border-y border-white/10"><div className="max-w-xl mx-auto"><span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider block mb-3">{badge}</span><h1 className="text-3xl font-extrabold mb-3">{title}</h1><p className="text-slate-400 text-xs mb-6">{description}</p><div className="flex gap-2"><input type="email" readOnly placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/15 text-xs text-slate-300"/><button className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">{buttonText}</button></div></div></section>
      )
    },
    Hero3DCourse: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, instructor: { type: 'text' }, rating: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { badge: 'ACADEMY COURSE', title: 'Building Production Web Apps with Next.js 16', instructor: 'Led by Nextflow Core Engineering Team', rating: '5.0 ★ (1,200+ Students)', ctaText: 'Enroll Now' },
      render: ({ badge, title, instructor, rating, ctaText }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between"><div><span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase mb-4 inline-block">{badge}</span><h1 className="text-3xl font-extrabold mb-2">{title}</h1><p className="text-xs text-slate-400 mb-1">{instructor}</p><div className="text-amber-400 text-xs font-bold mb-6">{rating}</div><a href="/pricing" className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block">{ctaText}</a></div><div className="w-64 h-44 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-4 flex items-center justify-center text-white font-black text-lg shadow-xl">3D COURSE</div></div></section>
      )
    },
    HeroBentoGrid: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, card1Text: { type: 'text' }, card2Text: { type: 'text' }, card3Text: { type: 'text' } },
      defaultProps: { title: 'The Complete Full-Stack Solution', subhead: 'Integrated layout modules for every use case.', card1Text: 'Sub-ms Data Sync', card2Text: 'Zero-Trust RBAC', card3Text: '1-Click ZIP Export' },
      render: ({ title, subhead, card1Text, card2Text, card3Text }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-4xl mx-auto mb-10"><h1 className="text-4xl font-extrabold mb-3">{title}</h1><p className="text-slate-400 text-xs">{subhead}</p></div><div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-cyan-300 font-bold">{card1Text}</div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-sky-300 font-bold">{card2Text}</div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-purple-300 font-bold">{card3Text}</div></div></section>
      )
    },
    HeroFloatingCards: {
      fields: { title: { type: 'text' }, description: { type: 'textarea' }, ctaText: { type: 'text' }, card1Title: { type: 'text' }, card2Title: { type: 'text' } },
      defaultProps: { title: 'Design Modern Interfaces Without Friction', description: 'Empower designers and developers with shared visual component state.', ctaText: 'Get Started', card1Title: 'Component Specs', card2Title: 'Live Telemetry' },
      render: ({ title, description, ctaText, card1Title, card2Title }) => (
        <section className="py-24 px-6 bg-[#090a0f] text-white font-sans relative"><div className="max-w-4xl mx-auto text-center"><h1 className="text-4xl font-extrabold mb-4">{title}</h1><p className="text-slate-400 text-sm max-w-lg mx-auto mb-8">{description}</p><a href="/pricing" className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">{ctaText}</a></div><div className="max-w-4xl mx-auto mt-10 grid grid-cols-2 gap-6"><div className="p-6 rounded-2xl bg-[#0f111a] border border-cyan-500/30 text-xs font-bold text-cyan-300 shadow-xl">{card1Title}</div><div className="p-6 rounded-2xl bg-[#0f111a] border border-sky-500/30 text-xs font-bold text-sky-300 shadow-xl">{card2Title}</div></div></section>
      )
    },
    HeroCountdownLaunch: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, countdownTime: { type: 'text' }, notifyCta: { type: 'text' } },
      defaultProps: { badge: 'LAUNCHING SOON', title: 'Nextflow 4.0 Studio Platform', countdownTime: '04 DAYS : 12 HOURS : 45 MINS', notifyCta: 'Get Notified' },
      render: ({ badge, title, countdownTime, notifyCta }) => (
        <section className="py-24 px-6 bg-[#050608] text-white text-center font-sans border-b border-white/10"><div className="max-w-3xl mx-auto"><span className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs uppercase mb-4 inline-block font-bold">{badge}</span><h1 className="text-4xl font-black mb-6">{title}</h1><div className="text-2xl font-mono text-cyan-400 font-bold mb-8 tracking-widest">{countdownTime}</div><a href="/contact" className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl text-xs inline-block">{notifyCta}</a></div></section>
      )
    },
    HeroEventConference: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, dateLocation: { type: 'text' }, ticketCta: { type: 'text' } },
      defaultProps: { badge: 'GLOBAL SUMMIT 2026', title: 'The World Web Architecture Summit', dateLocation: 'OCTOBER 14-16 // TOKYO, JAPAN', ticketCta: 'Get Conference Ticket' },
      render: ({ badge, title, dateLocation, ticketCta }) => (
        <section className="py-24 px-6 bg-[#090a0f] text-white text-center font-sans"><div className="max-w-4xl mx-auto"><span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase mb-6 inline-block">{badge}</span><h1 className="text-4xl sm:text-5xl font-black mb-4">{title}</h1><p className="text-slate-400 text-xs font-mono mb-8 tracking-wider">{dateLocation}</p><a href="/pricing" className="px-8 py-4 bg-cyan-500 text-slate-950 font-extrabold rounded-2xl text-xs shadow-xl">{ticketCta}</a></div></section>
      )
    },
    HeroBrutalistRaw: {
      fields: { bigTitle: { type: 'text' }, tagText: { type: 'text' }, description: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { bigTitle: 'RAW_POWER', tagText: '[ MULTI_PAGE_PAGE_ENGINE ]', description: 'Utilitarian print typography meets high-frequency engineering.', ctaText: 'INITIALIZE' },
      render: ({ bigTitle, tagText, description, ctaText }) => (
        <section className="py-24 px-8 bg-black text-white font-mono border-b-2 border-white"><div className="max-w-5xl mx-auto"><span className="text-cyan-400 text-xs mb-2 block">{tagText}</span><h1 className="text-6xl font-black mb-4 tracking-tighter">{bigTitle}</h1><p className="text-xs text-slate-400 mb-8">{description}</p><a href="/pricing" className="px-6 py-3 bg-white text-black font-black text-xs border border-white inline-block">{ctaText}</a></div></section>
      )
    },

    // 3. FEATURES & BENTO (15 PRESETS)
    BentoGrid: {
      fields: { title: { type: 'text' }, gradientTitle: { type: 'text' }, subhead: { type: 'text' }, card1Title: { type: 'text' }, card1Desc: { type: 'textarea' }, card2Title: { type: 'text' }, card2Desc: { type: 'textarea' }, card3Title: { type: 'text' }, card3Desc: { type: 'textarea' }, themeStyle: { type: 'select', options: [{ label: 'Glass', value: 'glass' }] }, padding: { type: 'select', options: [{ label: 'Standard', value: 'standard' }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { title: 'Engineered For Extreme Performance & Scale', gradientTitle: 'High-Velocity Modules', subhead: 'Architectural foundations built for high-throughput enterprise applications.', card1Title: 'Real-time Telemetry Engine', card1Desc: 'Sub-millisecond logging and audit trails.', card2Title: 'Zero-Trust Security Paradigm', card2Desc: 'Strict RBAC hierarchy checking.', card3Title: 'Visual No-Code Studio', card3Desc: 'Drag, drop, reorder, and customize.', themeStyle: 'glass', padding: 'standard', customClass: '', customCss: '' },
      render: ({ title, gradientTitle, subhead, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans"><div className="max-w-6xl mx-auto"><div className="text-center max-w-3xl mx-auto mb-12"><h2 className="text-3xl font-extrabold mb-3">{title} <span className="text-cyan-400">{gradientTitle}</span></h2><p className="text-slate-400 text-xs">{subhead}</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="p-6 rounded-3xl bg-[#0f111a] border border-white/10"><h3 className="text-lg font-bold mb-2 text-cyan-300 flex items-center gap-2"><Zap size={16}/>{card1Title}</h3><p className="text-xs text-slate-400">{card1Desc}</p></div><div className="p-6 rounded-3xl bg-[#0f111a] border border-white/10"><h3 className="text-lg font-bold mb-2 text-sky-300 flex items-center gap-2"><ShieldCheck size={16}/>{card2Title}</h3><p className="text-xs text-slate-400">{card2Desc}</p></div><div className="p-6 rounded-3xl bg-[#0f111a] border border-white/10"><h3 className="text-lg font-bold mb-2 text-purple-300 flex items-center gap-2"><Layout size={16}/>{card3Title}</h3><p className="text-xs text-slate-400">{card3Desc}</p></div></div></div></section>
      )
    },
    BentoAsymmetric4: {
      fields: { title: { type: 'text' }, card1Title: { type: 'text' }, card1Desc: { type: 'text' }, card2Title: { type: 'text' }, card2Desc: { type: 'text' }, card3Title: { type: 'text' }, card3Desc: { type: 'text' }, card4Title: { type: 'text' }, card4Desc: { type: 'text' } },
      defaultProps: { title: 'Modular Architecture Overview', card1Title: 'Autonomous Agent Engine', card1Desc: 'Runs background subagents cleanly.', card2Title: 'Supabase Vector DB', card2Desc: 'High-dimensional embeddings.', card3Title: 'Tailwind CSS v4', card3Desc: 'Utility-first modern styling.', card4Title: 'TypeScript 5.8', card4Desc: 'Strict type safety checks.' },
      render: ({ title, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc, card4Title, card4Desc }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-6xl mx-auto"><h2 className="text-3xl font-extrabold text-center mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="md:col-span-2 p-8 rounded-3xl bg-[#0f111a] border border-cyan-500/30"><h3 className="text-xl font-bold text-cyan-300 mb-2">{card1Title}</h3><p className="text-xs text-slate-400">{card1Desc}</p></div><div className="p-8 rounded-3xl bg-[#0f111a] border border-white/10"><h3 className="text-lg font-bold text-white mb-2">{card2Title}</h3><p className="text-xs text-slate-400">{card2Desc}</p></div><div className="p-8 rounded-3xl bg-[#0f111a] border border-white/10"><h3 className="text-lg font-bold text-white mb-2">{card3Title}</h3><p className="text-xs text-slate-400">{card3Desc}</p></div><div className="md:col-span-2 p-8 rounded-3xl bg-[#0f111a] border border-sky-500/30"><h3 className="text-xl font-bold text-sky-300 mb-2">{card4Title}</h3><p className="text-xs text-slate-400">{card4Desc}</p></div></div></div></section>
      )
    },
    BentoMetrics6: {
      fields: { title: { type: 'text' }, stat1Val: { type: 'text' }, stat1Lbl: { type: 'text' }, stat2Val: { type: 'text' }, stat2Lbl: { type: 'text' }, stat3Val: { type: 'text' }, stat3Lbl: { type: 'text' }, stat4Val: { type: 'text' }, stat4Lbl: { type: 'text' } },
      defaultProps: { title: 'Platform Metric Highlights', stat1Val: '99.99%', stat1Lbl: 'Uptime SLA', stat2Val: '< 1ms', stat2Lbl: 'DB Sync Latency', stat3Val: '500K+', stat3Lbl: 'Templates Saved', stat4Val: '100+', stat4Lbl: 'Presets Included' },
      render: ({ title, stat1Val, stat1Lbl, stat2Val, stat2Lbl, stat3Val, stat3Lbl, stat4Val, stat4Lbl }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-6"><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-cyan-400 mb-1">{stat1Val}</div><div className="text-xs text-slate-400">{stat1Lbl}</div></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-sky-400 mb-1">{stat2Val}</div><div className="text-xs text-slate-400">{stat2Lbl}</div></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-purple-400 mb-1">{stat3Val}</div><div className="text-xs text-slate-400">{stat3Lbl}</div></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-emerald-400 mb-1">{stat4Val}</div><div className="text-xs text-slate-400">{stat4Lbl}</div></div></div></div></section>
      )
    },
    FeatureListSplit: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, feature1Title: { type: 'text' }, feature1Desc: { type: 'text' }, feature2Title: { type: 'text' }, feature2Desc: { type: 'text' }, feature3Title: { type: 'text' }, feature3Desc: { type: 'text' }, cardImage: { type: 'text' } },
      defaultProps: { badge: 'CORE CAPABILITIES', title: 'Built For Complete Operational Excellence', description: 'Manage complex datasets, visual templates, and user access roles.', feature1Title: 'Automated Supabase Migrations', feature1Desc: 'Declarative database schema sync.', feature2Title: 'Granular Role Hierarchy', feature2Desc: 'Owners, Admins, and Members scoping.', feature3Title: 'Instant ZIP Export Engine', feature3Desc: '1-click export of structured JSON & HTML.', cardImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
      render: ({ badge, title, description, feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, cardImage }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div><span className="px-4 py-1.5 rounded-full text-[11px] font-extrabold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-6 uppercase inline-block"><Zap size={12}/>{badge}</span><h2 className="text-3xl font-extrabold mb-4">{title}</h2><p className="text-slate-400 text-xs mb-8">{description}</p><div className="space-y-4"><div className="flex gap-3"><CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5"/><div><strong className="text-sm block">{feature1Title}</strong><span className="text-xs text-slate-400">{feature1Desc}</span></div></div><div className="flex gap-3"><CheckCircle2 size={18} className="text-sky-400 shrink-0 mt-0.5"/><div><strong className="text-sm block">{feature2Title}</strong><span className="text-xs text-slate-400">{feature2Desc}</span></div></div><div className="flex gap-3"><CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5"/><div><strong className="text-sm block">{feature3Title}</strong><span className="text-xs text-slate-400">{feature3Desc}</span></div></div></div></div><div className="rounded-3xl overflow-hidden border border-cyan-500/30"><img src={cardImage} alt="Feature Cards" className="w-full aspect-4/3 object-cover"/></div></div></section>
      )
    },
    FeatureGridCards: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, card1Title: { type: 'text' }, card1Desc: { type: 'text' }, card2Title: { type: 'text' }, card2Desc: { type: 'text' }, card3Title: { type: 'text' }, card3Desc: { type: 'text' }, card4Title: { type: 'text' }, card4Desc: { type: 'text' } },
      defaultProps: { title: 'Enterprise Feature Suite', subhead: 'Everything required to ship high-converting web applications.', card1Title: 'Sub-ms Sync', card1Desc: 'Real-time database mutations.', card2Title: 'Puck Studio', card2Desc: 'Visual drag and drop editor.', card3Title: 'Tailwind CSS', card3Desc: 'Utility-first styling tokens.', card4Title: 'ZIP Export', card4Desc: 'Download clean production code.' },
      render: ({ title, subhead, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc, card4Title, card4Desc }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-2">{title}</h2><p className="text-slate-400 text-xs mb-10">{subhead}</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-left"><h3 className="font-bold text-sm text-cyan-300 mb-1">{card1Title}</h3><p className="text-xs text-slate-400">{card1Desc}</p></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-left"><h3 className="font-bold text-sm text-sky-300 mb-1">{card2Title}</h3><p className="text-xs text-slate-400">{card2Desc}</p></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-left"><h3 className="font-bold text-sm text-purple-300 mb-1">{card3Title}</h3><p className="text-xs text-slate-400">{card3Desc}</p></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-left"><h3 className="font-bold text-sm text-emerald-300 mb-1">{card4Title}</h3><p className="text-xs text-slate-400">{card4Desc}</p></div></div></div></section>
      )
    },
    FeatureComparisonTable: {
      fields: { title: { type: 'text' }, col1Title: { type: 'text' }, col2Title: { type: 'text' }, row1: { type: 'text' }, row2: { type: 'text' }, row3: { type: 'text' } },
      defaultProps: { title: 'Nextflow vs Legacy Builders', col1Title: 'Nextflow Studio', col2Title: 'Legacy WordPress', row1: 'Sub-second real-time DB sync', row2: 'Clean React & Tailwind props', row3: 'Zero plugin bloat or vulnerability' },
      render: ({ title, col1Title, col2Title, row1, row2, row3 }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-2 gap-4 text-left"><div className="p-6 rounded-2xl bg-[#0f111a] border border-cyan-500/40"><h3 className="text-cyan-400 font-bold mb-4">{col1Title}</h3><ul className="space-y-3 text-xs text-slate-200"><li key="r1">✓ {row1}</li><li key="r2">✓ {row2}</li><li key="r3">✓ {row3}</li></ul></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10 opacity-70"><h3 className="text-slate-400 font-bold mb-4">{col2Title}</h3><ul className="space-y-3 text-xs text-slate-400"><li key="b1">✕ Slow PHP rendering</li><li key="b2">✕ Fragile inline HTML</li><li key="b3">✕ Frequent security updates</li></ul></div></div></div></section>
      )
    },
    FeatureStepProcess: {
      fields: { title: { type: 'text' }, step1Title: { type: 'text' }, step1Desc: { type: 'text' }, step2Title: { type: 'text' }, step2Desc: { type: 'text' }, step3Title: { type: 'text' }, step3Desc: { type: 'text' } },
      defaultProps: { title: '3 Simple Steps To Production', step1Title: '1. Select Preset', step1Desc: 'Pick from 100+ Awwwards-grade section blocks.', step2Title: '2. Customize Props', step2Desc: 'Edit text, colors, backgrounds and Tailwind CSS.', step3Title: '3. Deploy & Sync', step3Desc: '1-click save to Supabase REST database.' },
      render: ({ title, step1Title, step1Desc, step2Title, step2Desc, step3Title, step3Desc }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-12">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-4">01</div><h3 className="font-bold text-base mb-2">{step1Title}</h3><p className="text-xs text-slate-400">{step1Desc}</p></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center mx-auto mb-4">02</div><h3 className="font-bold text-base mb-2">{step2Title}</h3><p className="text-xs text-slate-400">{step2Desc}</p></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center mx-auto mb-4">03</div><h3 className="font-bold text-base mb-2">{step3Title}</h3><p className="text-xs text-slate-400">{step3Desc}</p></div></div></div></section>
      )
    },
    FeatureInteractiveTabs: {
      fields: { title: { type: 'text' }, tab1Label: { type: 'text' }, tab1Content: { type: 'text' }, tab2Label: { type: 'text' }, tab2Content: { type: 'text' } },
      defaultProps: { title: 'Developer & Designer Friendly', tab1Label: 'Designer Mode', tab1Content: 'Visual drag, drop, and inline CSS tuning without code errors.', tab2Label: 'Developer Mode', tab2Content: 'Pure TypeScript definitions and 1-click JSON export.' },
      render: ({ title, tab1Label, tab1Content, tab2Label, tab2Content }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-8">{title}</h2><div className="flex justify-center gap-4 mb-8"><button className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">{tab1Label}</button><button className="px-5 py-2 rounded-xl bg-white/10 text-white font-bold text-xs">{tab2Label}</button></div><div className="p-8 rounded-3xl bg-[#090a0f] border border-white/10 text-xs text-slate-300">{tab1Content}</div></div></section>
      )
    },
    StatsCounterGrid: {
      fields: { stat1Value: { type: 'text' }, stat1Label: { type: 'text' }, stat2Value: { type: 'text' }, stat2Label: { type: 'text' }, stat3Value: { type: 'text' }, stat3Label: { type: 'text' }, stat4Value: { type: 'text' }, stat4Label: { type: 'text' } },
      defaultProps: { stat1Value: '99.99%', stat1Label: 'Uptime SLA Guarantee', stat2Value: '< 1ms', stat2Label: 'Sub-millisecond Latency', stat3Value: '500K+', stat3Label: 'Active Workflows Built', stat4Value: '24/7', stat4Label: 'Automated Supabase Sync' },
      render: ({ stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label, stat4Value, stat4Label }) => (
        <section className="py-16 px-6 bg-[#0f111a] border-y border-white/10 text-white font-sans"><div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-cyan-400 mb-2">{stat1Value}</div><p className="text-xs text-slate-400">{stat1Label}</p></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-sky-400 mb-2">{stat2Value}</div><p className="text-xs text-slate-400">{stat2Label}</p></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-purple-400 mb-2">{stat3Value}</div><p className="text-xs text-slate-400">{stat3Label}</p></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10"><div className="text-3xl font-black text-emerald-400 mb-2">{stat4Value}</div><p className="text-xs text-slate-400">{stat4Label}</p></div></div></section>
      )
    },
    StatsSplitChart: {
      fields: { title: { type: 'text' }, stat1: { type: 'text' }, stat1Label: { type: 'text' }, stat2: { type: 'text' }, stat2Label: { type: 'text' }, chartDesc: { type: 'text' } },
      defaultProps: { title: 'Telemetry Performance Analytics', stat1: '10x', stat1Label: 'Faster Page Loads', stat2: '0.00%', stat2Label: 'Data Loss Rate', chartDesc: 'Real-time stream telemetry powered by Supabase REST.' },
      render: ({ title, stat1, stat1Label, stat2, stat2Label, chartDesc }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"><div><h2 className="text-3xl font-extrabold mb-6">{title}</h2><div className="grid grid-cols-2 gap-4 mb-6"><div className="p-4 rounded-xl bg-[#0f111a] border border-cyan-500/30"><div className="text-2xl font-black text-cyan-400">{stat1}</div><div className="text-xs text-slate-400">{stat1Label}</div></div><div className="p-4 rounded-xl bg-[#0f111a] border border-sky-500/30"><div className="text-2xl font-black text-sky-400">{stat2}</div><div className="text-xs text-slate-400">{stat2Label}</div></div></div><p className="text-xs text-slate-400">{chartDesc}</p></div><div className="h-48 rounded-2xl bg-[#0f111a] border border-white/15 p-4 flex items-center justify-center text-cyan-400 font-mono text-xs">[ TELEMETRY_GRAPH_LIVE ]</div></div></section>
      )
    },
    FeatureIconRows: {
      fields: { title: { type: 'text' }, item1: { type: 'text' }, item2: { type: 'text' }, item3: { type: 'text' }, item4: { type: 'text' } },
      defaultProps: { title: 'Everything Included Standard', item1: 'Tailwind CSS v4 & Lucide Icons', item2: 'TypeScript 5.8 Strict Types', item3: 'JSZip 1-Click Code Export', item4: 'Supabase RLS Authentication' },
      render: ({ title, item1, item2, item3, item4 }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-extrabold mb-8">{title}</h2><div className="space-y-4 text-left"><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10 flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400"/><span className="text-xs font-bold">{item1}</span></div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10 flex items-center gap-3"><CheckCircle2 size={16} className="text-sky-400"/><span className="text-xs font-bold">{item2}</span></div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10 flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400"/><span className="text-xs font-bold">{item3}</span></div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10 flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400"/><span className="text-xs font-bold">{item4}</span></div></div></div></section>
      )
    },
    FeatureHoverCards: {
      fields: { title: { type: 'text' }, card1: { type: 'text' }, card2: { type: 'text' }, card3: { type: 'text' } },
      defaultProps: { title: 'Interactive Hover Modules', card1: 'Hover Glass Glow Effect', card2: '3D Elevation Tilt', card3: 'Subtle Micro Motion' },
      render: ({ title, card1, card2, card3 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="p-8 rounded-3xl bg-[#0f111a] border border-cyan-500/30 hover:border-cyan-400 transition-all font-bold text-sm text-cyan-300">{card1}</div><div className="p-8 rounded-3xl bg-[#0f111a] border border-sky-500/30 hover:border-sky-400 transition-all font-bold text-sm text-sky-300">{card2}</div><div className="p-8 rounded-3xl bg-[#0f111a] border border-purple-500/30 hover:border-purple-400 transition-all font-bold text-sm text-purple-300">{card3}</div></div></div></section>
      )
    },
    FeatureTimeline: {
      fields: { title: { type: 'text' }, milestone1: { type: 'text' }, milestone2: { type: 'text' }, milestone3: { type: 'text' } },
      defaultProps: { title: 'Product Engineering Roadmap', milestone1: 'Q1: Puck Studio Integration & 100 Presets', milestone2: 'Q2: Automated AI Visual Layout Generator', milestone3: 'Q3: Full Multi-Tenant Workspaces' },
      render: ({ title, milestone1, milestone2, milestone3 }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans"><div className="max-w-3xl mx-auto text-center"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="space-y-6 text-left border-l-2 border-cyan-500/40 pl-6"><div className="relative"><span className="w-3 h-3 rounded-full bg-cyan-400 absolute -left-[31px] top-1"/><p className="text-xs font-bold text-slate-200">{milestone1}</p></div><div className="relative"><span className="w-3 h-3 rounded-full bg-sky-400 absolute -left-[31px] top-1"/><p className="text-xs font-bold text-slate-200">{milestone2}</p></div><div className="relative"><span className="w-3 h-3 rounded-full bg-purple-400 absolute -left-[31px] top-1"/><p className="text-xs font-bold text-slate-200">{milestone3}</p></div></div></div></section>
      )
    },
    FeatureTechStackGrid: {
      fields: { title: { type: 'text' }, tech1: { type: 'text' }, tech2: { type: 'text' }, tech3: { type: 'text' }, tech4: { type: 'text' }, tech5: { type: 'text' }, tech6: { type: 'text' } },
      defaultProps: { title: 'Built With Modern Technology Stack', tech1: 'Next.js 16 (Turbopack)', tech2: 'Supabase Postgres DB', tech3: 'Puck Editor Core', tech4: 'Tailwind CSS v4', tech5: 'TypeScript 5.8', tech6: 'Lucide Vector Icons' },
      render: ({ title, tech1, tech2, tech3, tech4, tech5, tech6 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold text-slate-300"><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{tech1}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{tech2}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{tech3}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{tech4}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{tech5}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{tech6}</div></div></div></section>
      )
    },
    FeatureBentoDarkVoid: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, card1: { type: 'text' }, card2: { type: 'text' }, card3: { type: 'text' } },
      defaultProps: { title: 'Deep Dark Void Palette', subhead: 'High contrast monochrome aesthetics for developer platforms.', card1: 'Pure Carbon Surface (#050608)', card2: 'Deep Void Background (#090a0f)', card3: 'Subtle Slate Borders' },
      render: ({ title, subhead, card1, card2, card3 }) => (
        <section className="py-20 px-6 bg-[#050608] text-white font-sans text-center border-y border-white/10"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-black mb-3">{title}</h2><p className="text-slate-400 text-xs mb-10">{subhead}</p><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10 text-xs font-bold">{card1}</div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10 text-xs font-bold">{card2}</div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10 text-xs font-bold">{card3}</div></div></div></section>
      )
    },

    // 4. PORTFOLIO & SHOWCASE (12 PRESETS)
    PortfolioShowcase: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, project1Title: { type: 'text' }, project1Img: { type: 'text' }, project1Tag: { type: 'text' }, project2Title: { type: 'text' }, project2Img: { type: 'text' }, project2Tag: { type: 'text' }, padding: { type: 'select', options: [{ label: 'Standard', value: 'standard' }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { title: 'Featured Work Showcase', subhead: 'Explore high-converting platforms built using Nextflow templates.', project1Title: 'Aether Fintech Dashboard', project1Img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', project1Tag: 'FINTECH PLATFORM', project2Title: 'Cyberpulse AI Analytics', project2Img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80', project2Tag: 'ARTIFICIAL INTELLIGENCE', padding: 'standard', customClass: '', customCss: '' },
      render: ({ title, subhead, project1Title, project1Img, project1Tag, project2Title, project2Img, project2Tag }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-6xl mx-auto"><div className="text-center max-w-3xl mx-auto mb-12"><h2 className="text-3xl font-extrabold mb-3">{title}</h2><p className="text-slate-400 text-xs">{subhead}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="rounded-3xl overflow-hidden bg-[#0f111a] border border-white/10"><img src={project1Img} alt="P1" className="w-full aspect-video object-cover"/><div className="p-6"><span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">{project1Tag}</span><h3 className="text-lg font-bold">{project1Title}</h3></div></div><div className="rounded-3xl overflow-hidden bg-[#0f111a] border border-white/10"><img src={project2Img} alt="P2" className="w-full aspect-video object-cover"/><div className="p-6"><span className="text-[10px] font-bold text-sky-400 uppercase block mb-1">{project2Tag}</span><h3 className="text-lg font-bold">{project2Title}</h3></div></div></div></div></section>
      )
    },
    PortfolioMasonryGrid: {
      fields: { title: { type: 'text' }, p1Title: { type: 'text' }, p1Img: { type: 'text' }, p2Title: { type: 'text' }, p2Img: { type: 'text' }, p3Title: { type: 'text' }, p3Img: { type: 'text' } },
      defaultProps: { title: 'Selected Case Studies', p1Title: 'Nexus Mobile App', p1Img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', p2Title: 'Aura Glass SaaS', p2Img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', p3Title: 'Cyberpulse AI', p3Img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
      render: ({ title, p1Title, p1Img, p2Title, p2Img, p3Title, p3Img }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-6xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="rounded-2xl overflow-hidden bg-[#0f111a] border border-white/10 p-4"><img src={p1Img} alt="P1" className="w-full rounded-xl mb-3"/><h3 className="font-bold text-sm text-left">{p1Title}</h3></div><div className="rounded-2xl overflow-hidden bg-[#0f111a] border border-white/10 p-4"><img src={p2Img} alt="P2" className="w-full rounded-xl mb-3"/><h3 className="font-bold text-sm text-left">{p2Title}</h3></div><div className="rounded-2xl overflow-hidden bg-[#0f111a] border border-white/10 p-4"><img src={p3Img} alt="P3" className="w-full rounded-xl mb-3"/><h3 className="font-bold text-sm text-left">{p3Title}</h3></div></div></div></section>
      )
    },
    PortfolioClientCarousel: {
      fields: { title: { type: 'text' }, item1Title: { type: 'text' }, item2Title: { type: 'text' }, item3Title: { type: 'text' } },
      defaultProps: { title: 'Featured Enterprise Deliverables', item1Title: 'Project Alpha: Fintech Core', item2Title: 'Project Beta: Autonomous AI', item3Title: 'Project Gamma: Cloud Ops' },
      render: ({ title, item1Title, item2Title, item3Title }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="flex gap-6 overflow-x-auto pb-4 text-left"><div className="min-w-[280px] p-6 rounded-2xl bg-[#0f111a] border border-cyan-500/30 font-bold text-sm text-cyan-300">{item1Title}</div><div className="min-w-[280px] p-6 rounded-2xl bg-[#0f111a] border border-sky-500/30 font-bold text-sm text-sky-300">{item2Title}</div><div className="min-w-[280px] p-6 rounded-2xl bg-[#0f111a] border border-purple-500/30 font-bold text-sm text-purple-300">{item3Title}</div></div></div></section>
      )
    },
    PortfolioAppStoreScreens: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, screen1Img: { type: 'text' }, screen2Img: { type: 'text' } },
      defaultProps: { title: 'Mobile App Experience', subhead: 'Native iOS and Android application UI showcase.', screen1Img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80', screen2Img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
      render: ({ title, subhead, screen1Img, screen2Img }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-2">{title}</h2><p className="text-slate-400 text-xs mb-10">{subhead}</p><div className="flex justify-center gap-6"><div className="w-56 rounded-3xl overflow-hidden border-2 border-cyan-500/40 p-2 bg-[#090a0f]"><img src={screen1Img} alt="App 1" className="w-full rounded-2xl"/></div><div className="w-56 rounded-3xl overflow-hidden border-2 border-sky-500/40 p-2 bg-[#090a0f]"><img src={screen2Img} alt="App 2" className="w-full rounded-2xl"/></div></div></div></section>
      )
    },
    ClientLogosMarquee: {
      fields: { title: { type: 'text' }, logo1Text: { type: 'text' }, logo2Text: { type: 'text' }, logo3Text: { type: 'text' }, logo4Text: { type: 'text' }, logo5Text: { type: 'text' } },
      defaultProps: { title: 'TRUSTED BY INNOVATION TEAMS AT GLOBAL ENTERPRISES', logo1Text: 'CYBERPULSE', logo2Text: 'AETHER FINTECH', logo3Text: 'SUPABASE LABS', logo4Text: 'NEXUS CLOUD', logo5Text: 'VERCEL LABS' },
      render: ({ title, logo1Text, logo2Text, logo3Text, logo4Text, logo5Text }) => (
        <section className="py-12 px-6 bg-[#0d0f19] border-y border-white/10 text-white font-sans text-center"><p className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase mb-8">{title}</p><div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-10 opacity-70"><span className="text-xl font-black text-slate-300">{logo1Text}</span><span className="text-xl font-black text-slate-300">{logo2Text}</span><span className="text-xl font-black text-slate-300">{logo3Text}</span><span className="text-xl font-black text-slate-300">{logo4Text}</span><span className="text-xl font-black text-slate-300">{logo5Text}</span></div></section>
      )
    },
    ClientLogosGrid: {
      fields: { title: { type: 'text' }, logo1: { type: 'text' }, logo2: { type: 'text' }, logo3: { type: 'text' }, logo4: { type: 'text' }, logo5: { type: 'text' }, logo6: { type: 'text' } },
      defaultProps: { title: 'POWERING INDUSTRY LEADERS', logo1: 'MICROSOFT', logo2: 'GOOGLE', logo3: 'AMAZON', logo4: 'STRIPE', logo5: 'SUPABASE', logo6: 'VERCEL' },
      render: ({ title, logo1, logo2, logo3, logo4, logo5, logo6 }) => (
        <section className="py-16 px-6 bg-[#090a0f] text-white font-sans text-center"><p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-8">{title}</p><div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm font-black text-slate-300"><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{logo1}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{logo2}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{logo3}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{logo4}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{logo5}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10">{logo6}</div></div></section>
      )
    },
    CaseStudyDetailCard: {
      fields: { title: { type: 'text' }, clientName: { type: 'text' }, metricResult: { type: 'text' }, description: { type: 'textarea' }, ctaText: { type: 'text' } },
      defaultProps: { title: 'Featured Case Study Spotlight', clientName: 'Aether Global Bank', metricResult: '+340% Conversion Rate', description: 'Replaced legacy WordPress infrastructure with Nextflow Studio in 3 weeks.', ctaText: 'Read Full Case Study' },
      render: ({ title, clientName, metricResult, description, ctaText }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#0f111a] border border-cyan-500/40"><span className="text-xs font-bold text-cyan-400 block mb-2">{clientName}</span><h2 className="text-2xl font-extrabold mb-3">{title}</h2><div className="text-3xl font-black text-emerald-400 mb-4">{metricResult}</div><p className="text-xs text-slate-300 mb-6">{description}</p><a href="/about" className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block">{ctaText}</a></div></section>
      )
    },
    PortfolioFilterTabs: {
      fields: { title: { type: 'text' }, tabAll: { type: 'text' }, tabDesign: { type: 'text' }, tabDev: { type: 'text' } },
      defaultProps: { title: 'Explore Work By Domain', tabAll: 'All Works (48)', tabDesign: 'UI/UX Design', tabDev: 'Web Architecture' },
      render: ({ title, tabAll, tabDesign, tabDev }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-8">{title}</h2><div className="flex justify-center gap-4 text-xs font-bold"><button className="px-5 py-2 rounded-full bg-cyan-500 text-slate-950">{tabAll}</button><button className="px-5 py-2 rounded-full bg-white/10 text-white">{tabDesign}</button><button className="px-5 py-2 rounded-full bg-white/10 text-white">{tabDev}</button></div></div></section>
      )
    },
    PortfolioBeforeAfter: {
      fields: { title: { type: 'text' }, beforeTitle: { type: 'text' }, afterTitle: { type: 'text' }, description: { type: 'textarea' } },
      defaultProps: { title: 'Before & After Transformation', beforeTitle: 'Before: Monolithic PHP Site (Slow 4.2s Load)', afterTitle: 'After: Nextflow Studio Site (Instant 0.2s Load)', description: 'Drastic reduction in server cost and 10x improvement in Core Web Vitals.' },
      render: ({ title, beforeTitle, afterTitle, description }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-4">{title}</h2><p className="text-xs text-slate-400 mb-8">{description}</p><div className="grid grid-cols-2 gap-6 text-left"><div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 font-bold text-xs">{beforeTitle}</div><div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs">{afterTitle}</div></div></div></section>
      )
    },
    PortfolioVideoGrid: {
      fields: { title: { type: 'text' }, video1Title: { type: 'text' }, video2Title: { type: 'text' } },
      defaultProps: { title: 'Video Showreel Showcase', video1Title: '2026 Product Launch Reel', video2Title: 'Platform UI Walkthrough' },
      render: ({ title, video1Title, video2Title }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-44 rounded-2xl bg-[#090a0f] border border-white/10 flex items-center justify-center text-cyan-300 font-bold text-sm"><Play size={20} className="mr-2"/>{video1Title}</div><div className="h-44 rounded-2xl bg-[#090a0f] border border-white/10 flex items-center justify-center text-sky-300 font-bold text-sm"><Play size={20} className="mr-2"/>{video2Title}</div></div></div></section>
      )
    },
    PortfolioAwardBadges: {
      fields: { title: { type: 'text' }, award1: { type: 'text' }, award2: { type: 'text' }, award3: { type: 'text' } },
      defaultProps: { title: 'Industry Recognition & Accolades', award1: 'Awwwards Site of the Day 2026', award2: 'FWA Of The Month', award3: 'Red Dot Design Winner' },
      render: ({ title, award1, award2, award3 }) => (
        <section className="py-16 px-6 bg-[#090a0f] text-white font-sans text-center border-y border-white/10"><div className="max-w-4xl mx-auto"><h2 className="text-2xl font-extrabold mb-8">{title}</h2><div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-amber-300"><span className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2"><Award size={14}/>{award1}</span><span className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2"><Award size={14}/>{award2}</span><span className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2"><Award size={14}/>{award3}</span></div></div></section>
      )
    },
    PortfolioClientQuotes: {
      fields: { title: { type: 'text' }, clientName: { type: 'text' }, resultText: { type: 'text' }, quote: { type: 'textarea' } },
      defaultProps: { title: 'Direct Client Impact', clientName: 'CloudTech Systems', resultText: '$2.4M Revenue Lift', quote: '"Switching our landing templates to Nextflow Studio immediately boosted lead conversion."' },
      render: ({ title, clientName, resultText, quote }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#0f111a] border border-cyan-500/30"><div className="text-xs font-bold text-cyan-400 mb-2">{clientName}</div><div className="text-3xl font-black text-emerald-400 mb-4">{resultText}</div><p className="text-sm italic text-slate-300 leading-relaxed">{quote}</p></div></section>
      )
    },

    // 5. TESTIMONIALS & FAQ (12 PRESETS)
    Testimonials: {
      fields: { title: { type: 'text' }, quote1: { type: 'textarea' }, author1: { type: 'text' }, authorRole1: { type: 'text' }, quote2: { type: 'textarea' }, author2: { type: 'text' }, authorRole2: { type: 'text' }, padding: { type: 'select', options: [{ label: 'Standard', value: 'standard' }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { title: 'Trusted by Industry Leaders Worldwide', quote1: '"Nextflow drastically cut down our production deployment timeline from months to hours."', author1: 'Sarah Jenkins', authorRole1: 'VP Engineering, CloudTech', quote2: '"The clean props sidebar combined with inline CSS gives our team full creative control."', author2: 'Alex Rivera', authorRole2: 'Lead Architect, Nexus Labs', padding: 'standard', customClass: '', customCss: '' },
      render: ({ title, quote1, author1, authorRole1, quote2, author2, authorRole2 }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans"><div className="max-w-5xl mx-auto text-center"><h2 className="text-3xl font-extrabold mb-12">{title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"><div className="p-6 rounded-3xl bg-[#0f111a] border border-white/10"><div className="flex text-amber-400 mb-3"><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/></div><p className="text-xs text-slate-300 italic mb-4">{quote1}</p><div><strong className="text-xs font-bold text-white block">{author1}</strong><span className="text-[10px] text-cyan-400">{authorRole1}</span></div></div><div className="p-6 rounded-3xl bg-[#0f111a] border border-white/10"><div className="flex text-amber-400 mb-3"><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/><Star size={14} className="fill-current"/></div><p className="text-xs text-slate-300 italic mb-4">{quote2}</p><div><strong className="text-xs font-bold text-white block">{author2}</strong><span className="text-[10px] text-sky-400">{authorRole2}</span></div></div></div></div></section>
      )
    },
    TestimonialGrid3: {
      fields: { title: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' }, q2: { type: 'text' }, a2: { type: 'text' }, q3: { type: 'text' }, a3: { type: 'text' } },
      defaultProps: { title: 'What Creators Are Saying', q1: '"Pure engineering joy."', a1: 'Marcus Chen', q2: '"Unmatched template speed."', a2: 'Elena Rostova', q3: '"Best Next.js builder."', a3: 'David K.' },
      render: ({ title, q1, a1, q2, a2, q3, a3 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-6xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><p className="text-xs text-slate-300 italic mb-4">{q1}</p><strong className="text-xs font-bold text-cyan-400">{a1}</strong></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><p className="text-xs text-slate-300 italic mb-4">{q2}</p><strong className="text-xs font-bold text-sky-400">{a2}</strong></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><p className="text-xs text-slate-300 italic mb-4">{q3}</p><strong className="text-xs font-bold text-purple-400">{a3}</strong></div></div></div></section>
      )
    },
    TestimonialSingleHero: {
      fields: { quote: { type: 'textarea' }, authorName: { type: 'text' }, authorRole: { type: 'text' }, companyLogo: { type: 'text' } },
      defaultProps: { quote: '"Nextflow Studio allowed our design and engineering teams to ship 20 landing pages in a single afternoon with zero bugs."', authorName: 'Dr. Aris Thorne', authorRole: 'Chief Technology Officer', companyLogo: 'CYBERPULSE LABS' },
      render: ({ quote, authorName, authorRole, companyLogo }) => (
        <section className="py-24 px-6 bg-[#090a0f] text-white font-sans text-center border-y border-white/10"><div className="max-w-4xl mx-auto"><div className="text-cyan-400 font-extrabold tracking-widest text-xs uppercase mb-6">{companyLogo}</div><blockquote className="text-2xl font-bold text-slate-200 mb-8 italic">"{quote}"</blockquote><div className="font-bold text-sm text-white">{authorName}</div><div className="text-xs text-cyan-400">{authorRole}</div></div></section>
      )
    },
    TestimonialVideoCards: {
      fields: { title: { type: 'text' }, video1Author: { type: 'text' }, video2Author: { type: 'text' } },
      defaultProps: { title: 'Video Reviews From Customers', video1Author: 'Watch Interview with CTO Sarah J.', video2Author: 'Watch Review with Lead Product Alex R.' },
      render: ({ title, video1Author, video2Author }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-8 rounded-2xl bg-[#090a0f] border border-cyan-500/30 flex items-center justify-center gap-3 text-xs font-bold text-cyan-300"><Play size={18}/>{video1Author}</div><div className="p-8 rounded-2xl bg-[#090a0f] border border-sky-500/30 flex items-center justify-center gap-3 text-xs font-bold text-sky-300"><Play size={18}/>{video2Author}</div></div></div></section>
      )
    },
    TestimonialTwitterCards: {
      fields: { title: { type: 'text' }, handle1: { type: 'text' }, tweet1: { type: 'textarea' }, handle2: { type: 'text' }, tweet2: { type: 'textarea' } },
      defaultProps: { title: 'Recent Community Tweets', handle1: '@tech_founder', tweet1: 'Just deployed our new Nextflow Studio page. 100/100 Lighthouse score out of the box! 🔥', handle2: '@web_arch', tweet2: 'The 100+ presets in Nextflow changed the game for our agency. Instant save to Supabase!' },
      render: ({ title, handle1, tweet1, handle2, tweet2 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-5xl mx-auto text-center"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><div className="text-xs font-bold text-cyan-400 mb-2">{handle1}</div><p className="text-xs text-slate-300">{tweet1}</p></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><div className="text-xs font-bold text-sky-400 mb-2">{handle2}</div><p className="text-xs text-slate-300">{tweet2}</p></div></div></div></section>
      )
    },
    FaqAccordion: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, q1Title: { type: 'text' }, q1Answer: { type: 'textarea' }, q2Title: { type: 'text' }, q2Answer: { type: 'textarea' }, q3Title: { type: 'text' }, q3Answer: { type: 'textarea' } },
      defaultProps: { title: 'Frequently Asked Questions', subhead: 'Everything you need to know about Nextflow visual templates.', q1Title: 'How does Supabase synchronization work?', q1Answer: 'Every template save automatically updates the website_templates table in Supabase via REST API.', q2Title: 'Can I export templates as raw ZIP files?', q2Answer: 'Yes! Click the 1-click ZIP Export icon in the top header bar to download your template structure.', q3Title: 'Are these templates responsive on mobile?', q3Answer: '100%! Every preset is built with responsive Tailwind CSS Flexbox and Grid layouts out of the box.' },
      render: ({ title, subhead, q1Title, q1Answer, q2Title, q2Answer, q3Title, q3Answer }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-3xl mx-auto text-center mb-10"><h2 className="text-3xl font-black mb-2">{title}</h2><p className="text-slate-400 text-xs">{subhead}</p></div><div className="max-w-2xl mx-auto space-y-3 text-left"><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><HelpCircle size={15} className="text-cyan-400 shrink-0"/>{q1Title}</h3><p className="text-xs text-slate-400 pl-6">{q1Answer}</p></div><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><HelpCircle size={15} className="text-sky-400 shrink-0"/>{q2Title}</h3><p className="text-xs text-slate-400 pl-6">{q2Answer}</p></div><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><HelpCircle size={15} className="text-purple-400 shrink-0"/>{q3Title}</h3><p className="text-xs text-slate-400 pl-6">{q3Answer}</p></div></div></section>
      )
    },
    FaqGrid2Column: {
      fields: { title: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' }, q2: { type: 'text' }, a2: { type: 'text' }, q3: { type: 'text' }, a3: { type: 'text' }, q4: { type: 'text' }, a4: { type: 'text' } },
      defaultProps: { title: 'General System FAQ', q1: 'Is Nextflow open source?', a1: 'Nextflow is built on open standards React and Next.js.', q2: 'What CSS framework is used?', a2: 'Tailwind CSS v4 with full inline raw CSS support.', q3: 'Can I add custom fonts?', a3: 'Yes, select global font families in Page Settings.', q4: 'Is TypeScript required?', a4: 'No, all props are visual controls.' },
      render: ({ title, q1, a1, q2, a2, q3, a3, q4, a4 }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans"><div className="max-w-5xl mx-auto text-center"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs font-bold text-cyan-300 block mb-1">{q1}</strong><p className="text-xs text-slate-400">{a1}</p></div><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs font-bold text-sky-300 block mb-1">{q2}</strong><p className="text-xs text-slate-400">{a2}</p></div><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs font-bold text-purple-300 block mb-1">{q3}</strong><p className="text-xs text-slate-400">{a3}</p></div><div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs font-bold text-emerald-300 block mb-1">{q4}</strong><p className="text-xs text-slate-400">{a4}</p></div></div></div></section>
      )
    },
    FaqSearchable: {
      fields: { title: { type: 'text' }, placeholder: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' }, q2: { type: 'text' }, a2: { type: 'text' } },
      defaultProps: { title: 'Search Help Center Knowledge Base', placeholder: 'Type keywords e.g. Supabase, Export, Presets...', q1: 'How to trigger ZIP download?', a1: 'Click the Download icon in the top studio header bar.', q2: 'How to manage user access roles?', a2: 'Use the Admin Dashboard Users tab to edit roles.' },
      render: ({ title, placeholder, q1, a1, q2, a2 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-extrabold mb-6">{title}</h2><div className="relative max-w-md mx-auto mb-8"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" readOnly placeholder={placeholder} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f111a] border border-white/15 text-xs text-slate-300 focus:outline-none"/></div><div className="space-y-4 text-left"><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10"><strong className="text-xs font-bold text-cyan-300 block mb-1">{q1}</strong><p className="text-xs text-slate-400">{a1}</p></div><div className="p-4 rounded-xl bg-[#0f111a] border border-white/10"><strong className="text-xs font-bold text-sky-300 block mb-1">{q2}</strong><p className="text-xs text-slate-400">{a2}</p></div></div></div></section>
      )
    },
    FaqCategoryTabs: {
      fields: { title: { type: 'text' }, tab1: { type: 'text' }, tab2: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' } },
      defaultProps: { title: 'Categorized Documentation FAQs', tab1: 'Billing & Plans', tab2: 'Technical Specs', q1: 'What payment methods are supported?', a1: 'All major credit cards, Stripe, and invoice transfers.' },
      render: ({ title, tab1, tab2, q1, a1 }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-extrabold mb-6">{title}</h2><div className="flex justify-center gap-4 mb-6"><button className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">{tab1}</button><button className="px-5 py-2 rounded-xl bg-white/10 text-white font-bold text-xs">{tab2}</button></div><div className="p-6 rounded-2xl bg-[#090a0f] border border-white/10 text-left"><strong className="text-xs font-bold text-white block mb-1">{q1}</strong><p className="text-xs text-slate-400">{a1}</p></div></div></section>
      )
    },
    TrustSecurityBadges: {
      fields: { title: { type: 'text' }, badge1: { type: 'text' }, badge2: { type: 'text' }, badge3: { type: 'text' }, badge4: { type: 'text' } },
      defaultProps: { title: 'ENTERPRISE-GRADE SECURITY COMPLIANCE', badge1: 'SOC2 Type II Certified', badge2: 'ISO 27001 Certified', badge3: 'GDPR Compliant', badge4: 'Zero-Trust RBAC' },
      render: ({ title, badge1, badge2, badge3, badge4 }) => (
        <section className="py-16 px-6 bg-[#090a0f] text-white font-sans text-center border-y border-white/10"><p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-8">{title}</p><div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-cyan-300"><div className="p-4 rounded-xl bg-[#0f111a] border border-cyan-500/30 flex items-center justify-center gap-2"><ShieldCheck size={16}/>{badge1}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-sky-500/30 flex items-center justify-center gap-2"><Lock size={16}/>{badge2}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-purple-500/30 flex items-center justify-center gap-2"><ShieldAlert size={16}/>{badge3}</div><div className="p-4 rounded-xl bg-[#0f111a] border border-emerald-500/30 flex items-center justify-center gap-2"><Cpu size={16}/>{badge4}</div></div></section>
      )
    },
    CommunityDiscordCard: {
      fields: { title: { type: 'text' }, memberCount: { type: 'text' }, description: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { title: 'Join The Nextflow Developer Discord', memberCount: '50,000+ Members', description: 'Share custom presets, get help from core maintainers, and showcase your builds.', ctaText: 'Join Discord Community' },
      render: ({ title, memberCount, description, ctaText }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-3xl mx-auto p-8 rounded-3xl bg-indigo-950/40 border border-indigo-500/40"><span className="text-indigo-400 font-extrabold text-xs block mb-2">{memberCount}</span><h2 className="text-3xl font-extrabold mb-3">{title}</h2><p className="text-xs text-slate-300 mb-6">{description}</p><a href="/contact" className="px-6 py-3 bg-indigo-500 text-white font-extrabold rounded-xl text-xs inline-block">{ctaText}</a></div></section>
      )
    },
    WallOfLove: {
      fields: { title: { type: 'text' }, tweet1: { type: 'text' }, tweet2: { type: 'text' }, tweet3: { type: 'text' } },
      defaultProps: { title: 'Wall of Love From Developers', tweet1: '"Nextflow is the fastest way to turn visual ideas into Next.js code."', tweet2: '"100 presets out of the box saved us weeks of UI design."', tweet3: '"Supabase sync works like magic."' },
      render: ({ title, tweet1, tweet2, tweet3 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-6xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-xs text-slate-300 italic">{tweet1}</div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-xs text-slate-300 italic">{tweet2}</div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-xs text-slate-300 italic">{tweet3}</div></div></div></section>
      )
    },

    // 6. PRICING & CTA (15 PRESETS)
    PricingTable: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, proPrice: { type: 'text' }, proFeatures: { type: 'textarea' }, enterprisePrice: { type: 'text' }, enterpriseFeatures: { type: 'textarea' }, highlightPro: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] }, padding: { type: 'select', options: [{ label: 'Standard', value: 'standard' }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { title: 'Flexible & Scalable Pricing Tiers', subhead: 'Transparent plans designed for teams of all sizes.', proPrice: '$49/mo', proFeatures: 'Unlimited Workflows, 5 Admin Accounts, Supabase DB Sync, Puck Studio', enterprisePrice: '$199/mo', enterpriseFeatures: 'Unlimited Everything, Dedicated Support, Custom Webhooks, SSO', highlightPro: true, padding: 'standard', customClass: '', customCss: '' },
      render: ({ title, subhead, proPrice, proFeatures, enterprisePrice, enterpriseFeatures, highlightPro }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-2">{title}</h2><p className="text-slate-400 text-xs mb-10">{subhead}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"><div className={`p-8 rounded-3xl bg-[#0f111a] border ${highlightPro ? 'border-cyan-500/60 shadow-xl' : 'border-white/10'}`}><span className="text-xs font-black text-cyan-400 uppercase">PRO TIER</span><div className="text-4xl font-black my-4">{proPrice}</div><ul className="space-y-2 text-xs text-slate-300 mb-8">{proFeatures.split(',').map((f,i)=><li key={`pro-feat-${i}`}>✓ {f.trim()}</li>)}</ul><a href="/contact" className="block text-center py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">Choose Pro</a></div><div className="p-8 rounded-3xl bg-[#0f111a] border border-white/10"><span className="text-xs font-black text-slate-400 uppercase">ENTERPRISE</span><div className="text-4xl font-black my-4">{enterprisePrice}</div><ul className="space-y-2 text-xs text-slate-300 mb-8">{enterpriseFeatures.split(',').map((f,i)=><li key={`ent-feat-${i}`}>✓ {f.trim()}</li>)}</ul><a href="/contact" className="block text-center py-3 bg-white/10 text-white font-bold rounded-xl text-xs border border-white/15">Contact Sales</a></div></div></div></section>
      )
    },
    Pricing3TierToggle: {
      fields: { title: { type: 'text' }, plan1Price: { type: 'text' }, plan2Price: { type: 'text' }, plan3Price: { type: 'text' } },
      defaultProps: { title: 'Choose Your Growth Plan', plan1Price: '$19/mo', plan2Price: '$49/mo', plan3Price: '$149/mo' },
      render: ({ title, plan1Price, plan2Price, plan3Price }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-6xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><h3 className="font-bold text-xs text-slate-400">STARTER</h3><div className="text-3xl font-black my-3">{plan1Price}</div></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-cyan-500/50"><h3 className="font-bold text-xs text-cyan-400">PRO</h3><div className="text-3xl font-black my-3 text-cyan-400">{plan2Price}</div></div><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><h3 className="font-bold text-xs text-slate-400">SCALE</h3><div className="text-3xl font-black my-3">{plan3Price}</div></div></div></div></section>
      )
    },
    PricingComparisonMatrix: {
      fields: { title: { type: 'text' }, feat1: { type: 'text' }, feat2: { type: 'text' }, feat3: { type: 'text' } },
      defaultProps: { title: 'Complete Plan Feature Matrix', feat1: '100+ Visual Presets', feat2: 'Supabase REST DB Sync', feat3: 'Unlimited ZIP Exports' },
      render: ({ title, feat1, feat2, feat3 }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2><div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-left space-y-4 text-xs"><div className="flex justify-between border-b border-white/10 pb-2"><span>{feat1}</span><span className="text-cyan-400 font-bold">Included</span></div><div className="flex justify-between border-b border-white/10 pb-2"><span>{feat2}</span><span className="text-cyan-400 font-bold">Included</span></div><div className="flex justify-between border-b border-white/10 pb-2"><span>{feat3}</span><span className="text-cyan-400 font-bold">Included</span></div></div></div></section>
      )
    },
    PricingUsageBased: {
      fields: { title: { type: 'text' }, pricePerUnit: { type: 'text' }, unitName: { type: 'text' } },
      defaultProps: { title: 'Pay Only For What You Build', pricePerUnit: '$0.001', unitName: 'Per Production Request' },
      render: ({ title, pricePerUnit, unitName }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#090a0f] border border-cyan-500/40"><h2 className="text-3xl font-extrabold mb-2">{title}</h2><div className="text-4xl font-black text-cyan-400 my-4">{pricePerUnit}</div><p className="text-xs text-slate-400">{unitName}</p></div></section>
      )
    },
    PricingSinglePlan: {
      fields: { title: { type: 'text' }, price: { type: 'text' }, features: { type: 'textarea' }, ctaText: { type: 'text' } },
      defaultProps: { title: 'Single All-Access Pass', price: '$299 One-Time', features: 'Lifetime Access to 100+ Presets, Unlimited Supabase Sync, Free Updates', ctaText: 'Get Lifetime Pass' },
      render: ({ title, price, features, ctaText }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#0f111a] border border-cyan-500/50 shadow-2xl"><h2 className="text-3xl font-black mb-2">{title}</h2><div className="text-4xl font-black text-cyan-400 my-4">{price}</div><p className="text-xs text-slate-300 mb-6">{features}</p><a href="/pricing" className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-extrabold rounded-xl text-xs inline-block">{ctaText}</a></div></section>
      )
    },
    CtaBanner: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, buttonLabel: { type: 'text' }, buttonUrl: { type: 'text' }, variant: { type: 'select', options: [{ label: 'Cyan', value: 'cyan' }] }, padding: { type: 'select', options: [{ label: 'Standard', value: 'standard' }] }, customClass: { type: 'text' }, customCss: { type: 'textarea' } },
      defaultProps: { title: 'Ready to Deploy Your Next Big Project?', subhead: 'Launch high-performance visual templates directly to production.', buttonLabel: 'Launch Platform Now', buttonUrl: '/pricing', variant: 'cyan', padding: 'standard', customClass: '', customCss: '' },
      render: ({ title, subhead, buttonLabel, buttonUrl }) => (
        <section className="py-20 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 font-sans text-slate-950 text-center"><div className="max-w-4xl mx-auto"><h2 className="text-4xl font-black mb-3">{title}</h2><p className="text-sm font-medium mb-6 opacity-90">{subhead}</p><a href={buttonUrl || '/pricing'} className="px-8 py-3.5 bg-slate-950 text-white font-extrabold rounded-2xl text-xs inline-block shadow-2xl">{buttonLabel}</a></div></section>
      )
    },
    CtaSplitForm: {
      fields: { title: { type: 'text' }, description: { type: 'text' }, inputPlaceholder: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { title: 'Start Building With 100+ Presets Today', description: 'No credit card required. Instant access.', inputPlaceholder: 'Enter your work email...', buttonText: 'Get Started Free' },
      render: ({ title, description, inputPlaceholder, buttonText }) => (
        <section className="py-20 px-6 bg-[#0d0f19] text-white font-sans"><div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between"><div><h2 className="text-3xl font-extrabold mb-2">{title}</h2><p className="text-xs text-slate-400">{description}</p></div><div className="flex gap-2 w-full md:w-auto"><input type="email" readOnly placeholder={inputPlaceholder} className="px-4 py-3 rounded-xl bg-[#090a0f] border border-white/15 text-xs text-slate-200"/><button className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">{buttonText}</button></div></div></section>
      )
    },
    CtaAppDownload: {
      fields: { title: { type: 'text' }, description: { type: 'text' }, iosCta: { type: 'text' }, androidCta: { type: 'text' } },
      defaultProps: { title: 'Download Nextflow App On Mobile', description: 'Monitor live website telemetry and manage templates on the go.', iosCta: 'iOS App Store', androidCta: 'Google Play Store' },
      render: ({ title, description, iosCta, androidCta }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-extrabold mb-3">{title}</h2><p className="text-xs text-slate-400 mb-8">{description}</p><div className="flex justify-center gap-4"><a href="/contact" className="px-6 py-3 bg-white/10 border border-white/15 rounded-xl font-bold text-xs">{iosCta}</a><a href="/contact" className="px-6 py-3 bg-white/10 border border-white/15 rounded-xl font-bold text-xs">{androidCta}</a></div></div></section>
      )
    },
    CtaUrgencyTimer: {
      fields: { title: { type: 'text' }, timerText: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { title: 'Special Founding Member Offer Ends Soon', timerText: 'OFFER EXPIRES IN: 02h 15m 30s', buttonText: 'Claim 50% Off Lifetime' },
      render: ({ title, timerText, buttonText }) => (
        <section className="py-20 px-6 bg-[#050608] text-white font-sans text-center border-y border-rose-500/30"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-black mb-3">{title}</h2><div className="text-xl font-mono text-rose-400 font-bold mb-6">{timerText}</div><a href="/pricing" className="px-8 py-3.5 bg-rose-500 text-white font-extrabold rounded-xl text-xs inline-block">{buttonText}</a></div></section>
      )
    },
    CtaGlassCard: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { title: 'Frosted Glass Surface CTA', subhead: 'Upgrade your digital workflow with modern 3D glass aesthetics.', buttonText: 'Upgrade Now' },
      render: ({ title, subhead, buttonText }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-4xl mx-auto p-10 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/15 shadow-2xl"><h2 className="text-3xl font-extrabold mb-3">{title}</h2><p className="text-xs text-slate-300 mb-6">{subhead}</p><a href="/pricing" className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block">{buttonText}</a></div></section>
      )
    },
    CtaNewsletterPill: {
      fields: { title: { type: 'text' }, inputPlaceholder: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { title: 'Subscribe to Platform Updates', inputPlaceholder: 'your@email.com', buttonText: 'Subscribe' },
      render: ({ title, inputPlaceholder, buttonText }) => (
        <section className="py-16 px-6 bg-[#0d0f19] text-white font-sans text-center"><div className="max-w-2xl mx-auto p-3 rounded-full bg-[#0f111a] border border-cyan-500/40 flex items-center justify-between"><span className="text-xs font-bold pl-4 text-cyan-300">{title}</span><div className="flex gap-2"><input type="email" readOnly placeholder={inputPlaceholder} className="px-3 py-1.5 rounded-full bg-[#090a0f] text-xs text-slate-300 focus:outline-none"/><button className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-full text-xs">{buttonText}</button></div></div></section>
      )
    },
    CtaFullWidthVideo: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { title: 'Cinematic High Impact Experience', subhead: 'Turn website visitors into high-value customers.', buttonText: 'Explore Cinematic Mode' },
      render: ({ title, subhead, buttonText }) => (
        <section className="py-24 px-6 bg-[#090a0f] text-white font-sans text-center relative overflow-hidden"><div className="max-w-4xl mx-auto relative z-10"><h2 className="text-4xl font-black mb-3">{title}</h2><p className="text-sm text-slate-400 mb-8">{subhead}</p><a href="/services" className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs inline-block">{buttonText}</a></div></section>
      )
    },
    CtaBookDemoCalendar: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, calendarCta: { type: 'text' } },
      defaultProps: { title: 'Schedule a 1-on-1 Architecture Review', subhead: 'Meet with our senior system engineers to discuss custom presets.', calendarCta: 'Book 30-Min Demo' },
      render: ({ title, subhead, calendarCta }) => (
        <section className="py-20 px-6 bg-[#0f111a] text-white font-sans text-center"><div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#090a0f] border border-cyan-500/30"><Calendar size={28} className="text-cyan-400 mx-auto mb-4"/><h2 className="text-3xl font-extrabold mb-2">{title}</h2><p className="text-xs text-slate-400 mb-6">{subhead}</p><a href="/contact" className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block">{calendarCta}</a></div></section>
      )
    },
    CtaFreeTrialCard: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, freeTrialText: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { title: '14-Day Full Access Trial', subhead: 'Test all 100+ presets, Supabase DB sync, and ZIP export engine.', freeTrialText: '✓ No Credit Card Required', buttonText: 'Start Free Trial Now' },
      render: ({ title, subhead, freeTrialText, buttonText }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-center"><div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#0f111a] border border-emerald-500/40"><span className="text-xs font-bold text-emerald-400 block mb-2">{freeTrialText}</span><h2 className="text-3xl font-extrabold mb-3">{title}</h2><p className="text-xs text-slate-400 mb-6">{subhead}</p><a href="/pricing" className="px-8 py-3.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs inline-block">{buttonText}</a></div></section>
      )
    },
    CtaDarkCyberpunk: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, executeCta: { type: 'text' } },
      defaultProps: { title: '// EXECUTE_SYSTEM_DEPLOY', subhead: 'Initialize production environment and sync schema in < 1ms.', executeCta: '[ RUN DEPLOYMENT ]' },
      render: ({ title, subhead, executeCta }) => (
        <section className="py-20 px-6 bg-[#050608] text-white font-mono text-center border-t border-cyan-500/30"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-extrabold text-cyan-400 mb-3">{title}</h2><p className="text-xs text-slate-500 mb-8">{subhead}</p><a href="/pricing" className="px-8 py-3.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold text-xs inline-block">{executeCta}</a></div></section>
      )
    },

    // 7. FOOTER-SECTION (11 PRESETS)
    Footer: {
      fields: { brandName: { type: 'text' }, description: { type: 'text' }, copyrightText: { type: 'text' }, link1: { type: 'text' }, link2: { type: 'text' }, link3: { type: 'text' }, link4: { type: 'text' } },
      defaultProps: { brandName: 'NEXTFLOW.', description: 'Next-generation digital workspace and template engine.', copyrightText: '© 2026 Nextflow Inc. All rights reserved.', link1: 'Privacy Policy', link2: 'Terms of Service', link3: 'Documentation', link4: 'Status' },
      render: ({ brandName, description, copyrightText, link1, link2, link3, link4 }) => (
        <footer className="py-12 px-8 bg-[#050608] border-t border-white/10 text-white font-sans"><div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6"><div><div className="text-lg font-black text-white mb-1">{brandName}</div><p className="text-xs text-slate-400">{description}</p></div><div className="flex gap-6 text-xs text-slate-400"><a href="/about">{link1}</a><a href="/about">{link2}</a><a href="/services">{link3}</a><a href="/contact">{link4}</a></div></div><div className="border-t border-white/5 mt-8 pt-6 text-center text-[10px] text-slate-500">{copyrightText}</div></footer>
      )
    },
    FooterMinimalRail: {
      fields: { brandName: { type: 'text' }, copyrightText: { type: 'text' }, link1: { type: 'text' }, link2: { type: 'text' } },
      defaultProps: { brandName: 'AETHER', copyrightText: '© 2026 Aether Labs.', link1: 'Privacy', link2: 'Terms' },
      render: ({ brandName, copyrightText, link1, link2 }) => (
        <footer className="py-6 px-8 bg-[#050608] border-t border-white/10 font-sans text-white flex justify-between items-center text-xs"><div><strong className="text-cyan-400">{brandName}</strong> <span className="text-slate-500 text-[10px] ml-2">{copyrightText}</span></div><div className="flex gap-4 text-slate-400"><a href="/about">{link1}</a><a href="/about">{link2}</a></div></footer>
      )
    },
    FooterNewsletterBig: {
      fields: { brandName: { type: 'text' }, newsletterSubhead: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'NEXTFLOW ENGINE', newsletterSubhead: 'Get weekly updates on 100+ presets and Next.js tutorials.', copyrightText: '© 2026 Nextflow Inc.' },
      render: ({ brandName, newsletterSubhead, copyrightText }) => (
        <footer className="py-16 px-8 bg-[#090a0f] border-t border-white/10 text-white font-sans text-center"><div className="max-w-4xl mx-auto"><h3 className="text-xl font-bold mb-2">{brandName}</h3><p className="text-xs text-slate-400 mb-6">{newsletterSubhead}</p><div className="flex justify-center gap-2 max-w-md mx-auto mb-10"><input type="email" readOnly placeholder="your@email.com" className="flex-1 px-4 py-2 bg-[#0f111a] border border-white/15 rounded-xl text-xs"/><button className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">Subscribe</button></div><div className="text-[10px] text-slate-500">{copyrightText}</div></div></footer>
      )
    },
    FooterCyberpunkMono: {
      fields: { brandName: { type: 'text' }, statusText: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: '// CYBERPULSE', statusText: 'STATUS: ALL_SYSTEMS_OPERATIONAL', copyrightText: '[ END_TRANSMISSION 2026 ]' },
      render: ({ brandName, statusText, copyrightText }) => (
        <footer className="py-8 px-6 bg-[#050608] border-t border-cyan-500/40 font-mono text-white flex justify-between items-center text-xs"><div><span className="text-cyan-400 font-bold">{brandName}</span> <span className="text-emerald-400 text-[10px] ml-4">{statusText}</span></div><div className="text-slate-500 text-[10px]">{copyrightText}</div></footer>
      )
    },
    FooterAppStoreLinks: {
      fields: { brandName: { type: 'text' }, appStoreText: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'POCKET APP', appStoreText: 'Available on iOS & Android', copyrightText: '© 2026 Pocket App Ltd.' },
      render: ({ brandName, appStoreText, copyrightText }) => (
        <footer className="py-10 px-8 bg-[#0f111a] border-t border-white/10 text-white font-sans flex justify-between items-center text-xs"><div><strong className="text-white text-sm">{brandName}</strong><p className="text-[10px] text-slate-400">{appStoreText}</p></div><div className="text-[10px] text-slate-500">{copyrightText}</div></footer>
      )
    },
    FooterLuxurySerif: {
      fields: { brandName: { type: 'text' }, tagLine: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'HAUTE ARCHITECTURE', tagLine: 'Purity in design & execution.', copyrightText: 'MMXXVI All Rights Reserved.' },
      render: ({ brandName, tagLine, copyrightText }) => (
        <footer className="py-16 px-8 bg-[#090a0f] border-t border-white/10 font-serif text-white text-center"><div><div className="text-lg tracking-widest uppercase mb-2">{brandName}</div><p className="text-[10px] font-sans text-slate-400 uppercase tracking-widest mb-6">{tagLine}</p><div className="text-[10px] font-sans text-slate-500">{copyrightText}</div></div></footer>
      )
    },
    FooterMegaSiteMap: {
      fields: { brandName: { type: 'text' }, col1Title: { type: 'text' }, col2Title: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'ENTERPRISE MAP', col1Title: 'Platform Modules', col2Title: 'Developer Hub', copyrightText: '© 2026 Enterprise Flow Inc.' },
      render: ({ brandName, col1Title, col2Title, copyrightText }) => (
        <footer className="py-12 px-8 bg-[#090a0f] border-t border-white/10 text-white font-sans"><div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs"><div><strong className="text-white text-sm block mb-2">{brandName}</strong><span className="text-slate-400 text-[10px]">Multi-tenant Web Studio</span></div><div><strong className="text-cyan-400 block mb-2">{col1Title}</strong><ul className="space-y-1 text-slate-400 text-[11px]"><li key="fm1"><a href="/">Home</a></li><li key="fm2"><a href="/about">About Us</a></li><li key="fm3"><a href="/services">Services</a></li></ul></div><div><strong className="text-sky-400 block mb-2">{col2Title}</strong><ul className="space-y-1 text-slate-400 text-[11px]"><li key="fm4"><a href="/pricing">Pricing</a></li><li key="fm5"><a href="/contact">Contact</a></li></ul></div><div><strong className="text-purple-400 block mb-2">Legal</strong><ul className="space-y-1 text-slate-400 text-[11px]"><li key="fm6">Privacy Policy</li><li key="fm7">Terms of Service</li></ul></div></div><div className="border-t border-white/5 mt-8 pt-4 text-center text-[10px] text-slate-500">{copyrightText}</div></footer>
      )
    },
    FooterSocialIconsOnly: {
      fields: { brandName: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'NEXTFLOW STUDIO', copyrightText: '© 2026 Nextflow. Built with React & Tailwind.' },
      render: ({ brandName, copyrightText }) => (
        <footer className="py-10 px-6 bg-[#090a0f] border-t border-white/10 text-white font-sans text-center"><div className="text-sm font-black mb-2">{brandName}</div><div className="text-[10px] text-slate-500">{copyrightText}</div></footer>
      )
    },
    FooterGradientBorder: {
      fields: { brandName: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'STREAMLINE.', copyrightText: '© 2026 Streamline Inc.' },
      render: ({ brandName, copyrightText }) => (
        <footer className="bg-[#090a0f] font-sans text-white relative"><div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500"/><div className="px-8 py-6 flex justify-between items-center text-xs"><strong>{brandName}</strong><span className="text-slate-500 text-[10px]">{copyrightText}</span></div></footer>
      )
    },
    FooterBrutalistBox: {
      fields: { brandName: { type: 'text' }, tag: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'RAW_FOOTER', tag: '[ 100_PRESETS ]', copyrightText: '© 2026' },
      render: ({ brandName, tag, copyrightText }) => (
        <footer className="py-6 px-6 bg-black border-t-2 border-white font-mono text-white flex justify-between items-center text-xs font-bold"><div>{brandName} <span className="text-cyan-400 text-[10px]">{tag}</span></div><div>{copyrightText}</div></footer>
      )
    },
    FooterCenteredBrand: {
      fields: { brandName: { type: 'text' }, tagline: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'NEXTFLOW ENGINE', tagline: 'The visual web builder for Next.js', copyrightText: '© 2026 Nextflow' },
      render: ({ brandName, tagline, copyrightText }) => (
        <footer className="py-12 px-6 bg-[#090a0f] border-t border-white/10 text-white font-sans text-center"><div className="text-lg font-extrabold mb-1">{brandName}</div><p className="text-xs text-slate-400 mb-6">{tagline}</p><div className="text-[10px] text-slate-500">{copyrightText}</div></footer>
      )
    },

    // 8. CONTAINERS (3 PRESETS)
    FlexSection: {
      fields: {
        direction: { type: 'radio', label: 'Flex Direction', options: [{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' }] },
        justifyContent: { type: 'select', label: 'Justify Content', options: [{ label: 'Space Between', value: 'space-between' }, { label: 'Center', value: 'center' }, { label: 'Flex Start', value: 'flex-start' }] },
        alignItems: { type: 'select', label: 'Align Items', options: [{ label: 'Center', value: 'center' }, { label: 'Flex Start', value: 'flex-start' }] },
        gap: { type: 'text', label: 'Gap (e.g. 24px)' },
        width: { type: 'select', label: 'Container Width', options: [{ label: '1150px (Standard)', value: '1150px' }, { label: '100% (Full)', value: '100%' }, { label: 'Custom', value: 'custom' }] },
        customWidth: { type: 'text', label: 'Custom Width' },
        height: { type: 'select', label: 'Height', options: [{ label: 'Auto', value: 'auto' }, { label: 'Custom', value: 'custom' }] },
        customHeight: { type: 'text', label: 'Custom Height' },
        minHeight: { type: 'text', label: 'Min Height' },
        paddingTop: { type: 'text', label: 'Padding Top' },
        paddingBottom: { type: 'text', label: 'Padding Bottom' },
        paddingHorizontal: { type: 'text', label: 'Padding Left/Right' },
        padding: { type: 'text', label: 'Padding Override' },
        background: { type: 'select', label: 'Surface Preset', options: [{ label: 'Glass', value: 'glass' }, { label: 'Dark Void', value: 'dark' }, { label: 'Transparent', value: 'transparent' }] },
        bgColor: { type: 'text', label: 'Custom Background Color (Hex / CSS)' },
        textColor: { type: 'text', label: 'Custom Text Color (Hex / CSS)' },
        borderColor: { type: 'text', label: 'Custom Border Color (Hex / CSS)' },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { direction: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '24px', width: '1150px', customWidth: '', height: 'auto', customHeight: '', minHeight: '', paddingTop: '80px', paddingBottom: '80px', paddingHorizontal: '24px', padding: '', background: 'glass', bgColor: '', textColor: '', borderColor: '', customClass: '', customCss: '' },
      render: ({ direction, justifyContent, alignItems, gap, width, customWidth, height, customHeight, minHeight, paddingTop, paddingBottom, paddingHorizontal, padding, background, bgColor, textColor, borderColor, customClass, customCss }) => {
        const finalWidth = width === 'custom' ? customWidth || '100%' : width
        const finalHeight = height === 'custom' ? customHeight || 'auto' : height
        const pt = paddingTop ? (paddingTop.includes('p') ? paddingTop : `${paddingTop}`) : ''
        const pb = paddingBottom ? (paddingBottom.includes('p') ? paddingBottom : `${paddingBottom}`) : ''
        const px = paddingHorizontal ? (paddingHorizontal.includes('p') ? paddingHorizontal : `${paddingHorizontal}`) : ''
        const customStyle: React.CSSProperties = {
          width: finalWidth,
          height: finalHeight,
          minHeight: minHeight || undefined,
          paddingTop: !pt.startsWith('p') ? pt : undefined,
          paddingBottom: !pb.startsWith('p') ? pb : undefined,
          paddingLeft: !px.startsWith('p') ? px : undefined,
          paddingRight: !px.startsWith('p') ? px : undefined,
          backgroundColor: bgColor || undefined,
          color: textColor || undefined,
          borderColor: borderColor || undefined,
          ...parseCustomCss(customCss)
        }
        const classPadding = padding || `${pt.startsWith('p') ? pt : ''} ${pb.startsWith('p') ? pb : ''} ${px.startsWith('p') ? px : ''}`
        return (
          <section className={`font-sans rounded-3xl transition-all my-4 mx-auto ${classPadding} ${!bgColor && background === 'glass' ? 'bg-[#0f111a]/80 backdrop-blur-2xl border border-white/10' : !bgColor && background === 'dark' ? 'bg-[#090a0f]' : !bgColor ? '' : 'border'} ${customClass}`} style={customStyle}>
            <div className="w-full h-full"><DropZone zone="flex-content" style={{ display: 'flex', flexDirection: direction === 'column' ? 'column' : 'row', flexWrap: direction === 'column' ? 'nowrap' : 'wrap', justifyContent: justifyContent || 'space-between', alignItems: alignItems || 'center', gap: gap || '24px', width: '100%', height: '100%' }} /></div>
          </section>
        )
      }
    },
    GridColumns: {
      fields: {
        columns: { type: 'select', label: 'Grid Columns', options: [{ label: '2 Cols', value: '2' }, { label: '3 Cols', value: '3' }, { label: '4 Cols', value: '4' }] },
        gap: { type: 'text', label: 'Column Gap' },
        width: { type: 'select', label: 'Container Width', options: [{ label: '1150px (Standard)', value: '1150px' }, { label: '100%', value: '100%' }] },
        customWidth: { type: 'text', label: 'Custom Width' },
        height: { type: 'select', label: 'Height', options: [{ label: 'Auto', value: 'auto' }] },
        customHeight: { type: 'text', label: 'Custom Height' },
        paddingTop: { type: 'text', label: 'Padding Top' },
        paddingBottom: { type: 'text', label: 'Padding Bottom' },
        paddingHorizontal: { type: 'text', label: 'Padding Left/Right' },
        padding: { type: 'text', label: 'Padding Override' },
        background: { type: 'select', label: 'Surface Preset', options: [{ label: 'Glass', value: 'glass' }, { label: 'Dark Void', value: 'dark' }] },
        bgColor: { type: 'text', label: 'Custom Background Color' },
        textColor: { type: 'text', label: 'Custom Text Color' },
        borderColor: { type: 'text', label: 'Custom Border Color' },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { columns: '3', gap: '24px', width: '1150px', customWidth: '', height: 'auto', customHeight: '', paddingTop: '64px', paddingBottom: '64px', paddingHorizontal: '24px', padding: '', background: 'glass', bgColor: '', textColor: '', borderColor: '', customClass: '', customCss: '' },
      render: ({ columns, gap, width, customWidth, height, customHeight, paddingTop, paddingBottom, paddingHorizontal, padding, background, bgColor, textColor, borderColor, customClass, customCss }) => {
        const colClass = columns === '2' ? 'grid-cols-1 md:grid-cols-2' : columns === '4' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'
        const finalWidth = width === 'custom' ? customWidth || '100%' : width
        const finalHeight = height === 'custom' ? customHeight || 'auto' : height
        const pt = paddingTop ? (paddingTop.includes('p') ? paddingTop : `${paddingTop}`) : ''
        const pb = paddingBottom ? (paddingBottom.includes('p') ? paddingBottom : `${paddingBottom}`) : ''
        const px = paddingHorizontal ? (paddingHorizontal.includes('p') ? paddingHorizontal : `${paddingHorizontal}`) : ''
        const customStyle: React.CSSProperties = {
          width: finalWidth,
          height: finalHeight,
          paddingTop: !pt.startsWith('p') ? pt : undefined,
          paddingBottom: !pb.startsWith('p') ? pb : undefined,
          paddingLeft: !px.startsWith('p') ? px : undefined,
          paddingRight: !px.startsWith('p') ? px : undefined,
          backgroundColor: bgColor || undefined,
          color: textColor || undefined,
          borderColor: borderColor || undefined,
          ...parseCustomCss(customCss)
        }
        const classPadding = padding || `${pt.startsWith('p') ? pt : ''} ${pb.startsWith('p') ? pb : ''} ${px.startsWith('p') ? px : ''}`
        return (
          <section className={`font-sans my-4 mx-auto rounded-3xl ${classPadding} ${!bgColor && background === 'glass' ? 'bg-[#0f111a]/80 backdrop-blur-2xl border border-white/10' : !bgColor ? 'bg-[#090a0f]' : 'border'} ${customClass}`} style={customStyle}>
            <div className={`w-full grid ${colClass}`} style={{ gap: gap || '24px' }}>
              <div className="min-h-[120px] p-4 rounded-2xl bg-[#090a0f]/60 border border-white/10"><DropZone zone="col-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }} /></div>
              <div className="min-h-[120px] p-4 rounded-2xl bg-[#090a0f]/60 border border-white/10"><DropZone zone="col-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }} /></div>
              {columns !== '2' && <div className="min-h-[120px] p-4 rounded-2xl bg-[#090a0f]/60 border border-white/10"><DropZone zone="col-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }} /></div>}
              {columns === '4' && <div className="min-h-[120px] p-4 rounded-2xl bg-[#090a0f]/60 border border-white/10"><DropZone zone="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }} /></div>}
            </div>
          </section>
        )
      }
    },
    CardBox: {
      fields: {
        title: { type: 'text', label: 'Card Title' },
        variant: { type: 'select', label: 'Card Style', options: [{ label: 'Glass', value: 'glass' }, { label: 'Dark Void', value: 'dark' }] },
        bgColor: { type: 'text', label: 'Custom Background Color (Hex / CSS)' },
        textColor: { type: 'text', label: 'Custom Text Color (Hex / CSS)' },
        borderColor: { type: 'text', label: 'Custom Border Color (Hex / CSS)' },
        width: { type: 'select', label: 'Card Width', options: [{ label: '100%', value: '100%' }] },
        customWidth: { type: 'text', label: 'Custom Width' },
        height: { type: 'select', label: 'Card Height', options: [{ label: 'Auto', value: 'auto' }] },
        customHeight: { type: 'text', label: 'Custom Height' },
        paddingTop: { type: 'text', label: 'Padding Top' },
        paddingBottom: { type: 'text', label: 'Padding Bottom' },
        paddingHorizontal: { type: 'text', label: 'Padding Left/Right' },
        padding: { type: 'text', label: 'Padding Override' },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { title: 'Bespoke Card Box', variant: 'glass', bgColor: '', textColor: '', borderColor: '', width: '100%', customWidth: '', height: 'auto', customHeight: '', paddingTop: '32px', paddingBottom: '32px', paddingHorizontal: '32px', padding: '', customClass: '', customCss: '' },
      render: ({ title, variant, bgColor, textColor, borderColor, width, customWidth, height, customHeight, paddingTop, paddingBottom, paddingHorizontal, padding, customClass, customCss }) => {
        const finalWidth = width === 'custom' ? customWidth || '100%' : width
        const finalHeight = height === 'custom' ? customHeight || 'auto' : height
        const pt = paddingTop ? (paddingTop.includes('p') ? paddingTop : `${paddingTop}`) : ''
        const pb = paddingBottom ? (paddingBottom.includes('p') ? paddingBottom : `${paddingBottom}`) : ''
        const px = paddingHorizontal ? (paddingHorizontal.includes('p') ? paddingHorizontal : `${paddingHorizontal}`) : ''
        const customStyle: React.CSSProperties = {
          width: finalWidth,
          height: finalHeight,
          paddingTop: !pt.startsWith('p') ? pt : undefined,
          paddingBottom: !pb.startsWith('p') ? pb : undefined,
          paddingLeft: !px.startsWith('p') ? px : undefined,
          paddingRight: !px.startsWith('p') ? px : undefined,
          backgroundColor: bgColor || undefined,
          color: textColor || undefined,
          borderColor: borderColor || undefined,
          ...parseCustomCss(customCss)
        }
        const classPadding = padding || `${pt.startsWith('p') ? pt : ''} ${pb.startsWith('p') ? pb : ''} ${px.startsWith('p') ? px : ''}`
        return (
          <div className={`rounded-3xl transition-all font-sans my-2 mx-auto ${classPadding} ${!bgColor ? 'bg-[#0f111a]/80 backdrop-blur-2xl border border-white/10' : 'border'} ${customClass}`} style={customStyle}>
            {title && <h3 className="text-xl font-bold mb-4" style={{ color: textColor || '#ffffff' }}>{title}</h3>}
            <div className="min-h-[80px]"><DropZone zone="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }} /></div>
          </div>
        )
      }
    },

    // 9. ATOMIC BUILDING BLOCKS (7 PRESETS)
    Heading: {
      fields: {
        text: { type: 'text', label: 'Heading Text' },
        level: { type: 'select', label: 'Heading Level', options: [{ label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' }, { label: 'H4', value: 'h4' }] },
        fontSize: { type: 'text', label: 'Font Size (e.g. 4xl, 3xl, 36px)' },
        fontWeight: { type: 'select', label: 'Font Weight', options: [{ label: 'Bold', value: 'bold' }, { label: 'Extra Bold', value: 'extrabold' }, { label: 'Black', value: 'black' }] },
        color: { type: 'text', label: 'Text Color (Hex / CSS, e.g. #ffffff, #06b6d4)' },
        bgColor: { type: 'text', label: 'Background Color (Hex / CSS)' },
        align: { type: 'radio', label: 'Alignment', options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }] },
        gradient: { type: 'radio', label: 'Gradient Text', options: [{ label: 'Enabled', value: true }, { label: 'Disabled', value: false }] },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { text: 'Custom Page Heading Title', level: 'h2', fontSize: '4xl', fontWeight: 'bold', color: '#ffffff', bgColor: '', align: 'left', gradient: false, customClass: '', customCss: '' },
      render: ({ text, level, fontSize, fontWeight, color, bgColor, align, gradient, customClass, customCss }) => {
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
        const colorClass = gradient ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent' : ''
        const Tag = (level || 'h2') as keyof React.JSX.IntrinsicElements
        return (
          <Tag
            className={`text-3xl sm:text-4xl font-bold ${alignClass} ${colorClass} tracking-tight py-2 ${customClass}`}
            style={{
              color: gradient ? undefined : color || '#ffffff',
              backgroundColor: bgColor || undefined,
              ...parseCustomCss(customCss)
            }}
          >
            {text}
          </Tag>
        )
      }
    },
    Text: {
      fields: {
        text: { type: 'textarea', label: 'Paragraph Content Text' },
        fontSize: { type: 'text', label: 'Font Size (e.g. base, lg, 16px)' },
        color: { type: 'text', label: 'Text Color (Hex / CSS, e.g. #94a3b8)' },
        bgColor: { type: 'text', label: 'Background Color (Hex / CSS)' },
        align: { type: 'radio', label: 'Alignment', options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }] },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { text: 'Add your detailed explanation content paragraph here.', fontSize: 'base', color: '#94a3b8', bgColor: '', align: 'left', customClass: '', customCss: '' },
      render: ({ text, fontSize, color, bgColor, align, customClass, customCss }) => {
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
        return (
          <p
            className={`text-base ${alignClass} leading-relaxed py-1.5 ${customClass}`}
            style={{
              color: color || '#94a3b8',
              backgroundColor: bgColor || undefined,
              ...parseCustomCss(customCss)
            }}
          >
            {text}
          </p>
        )
      }
    },
    Button: {
      fields: {
        label: { type: 'text', label: 'Button Label' },
        url: { type: 'text', label: 'Target Link URL' },
        variant: { type: 'select', label: 'Button Style Preset', options: [{ label: 'Cyan Glow', value: 'cyan' }, { label: 'Glassmorphism', value: 'glass' }, { label: 'Outline', value: 'outline' }] },
        bgColor: { type: 'text', label: 'Custom Background Color (Hex / CSS)' },
        textColor: { type: 'text', label: 'Custom Text Color (Hex / CSS)' },
        borderColor: { type: 'text', label: 'Custom Border Color (Hex / CSS)' },
        size: { type: 'select', label: 'Button Size', options: [{ label: 'Small', value: 'sm' }, { label: 'Medium', value: 'md' }, { label: 'Large', value: 'lg' }] },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { label: 'Click Action', url: '#', variant: 'cyan', size: 'md', bgColor: '', textColor: '', borderColor: '', customClass: '', customCss: '' },
      render: ({ label, url, variant, bgColor, textColor, borderColor, customClass, customCss }) => (
        <div className="py-2">
          <a
            href={url || '#'}
            className={`inline-block px-6 py-3 bg-cyan-500 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg ${customClass}`}
            style={{
              backgroundColor: bgColor || undefined,
              color: textColor || undefined,
              borderColor: borderColor || undefined,
              ...parseCustomCss(customCss)
            }}
          >
            {label}
          </a>
        </div>
      )
    },
    Image: {
      fields: {
        src: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt Text' },
        rounded: { type: 'select', label: 'Border Radius', options: [{ label: 'None', value: 'none' }, { label: 'Large', value: 'lg' }, { label: '2XL', value: '2xl' }, { label: 'Full', value: 'full' }] },
        borderColor: { type: 'text', label: 'Custom Border Color' },
        shadowGlow: { type: 'radio', label: 'Shadow Glow', options: [{ label: 'Enabled', value: true }, { label: 'Disabled', value: false }] },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', alt: 'Artwork', rounded: '2xl', borderColor: '', shadowGlow: true, customClass: '', customCss: '' },
      render: ({ src, alt, borderColor, customClass, customCss }) => (
        <div className="py-4">
          <img
            src={src}
            alt={alt}
            className={`w-full max-w-3xl mx-auto rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] ${customClass}`}
            style={{
              borderColor: borderColor || undefined,
              ...parseCustomCss(customCss)
            }}
          />
        </div>
      )
    },
    PillBadge: {
      fields: {
        badgeText: { type: 'text', label: 'Badge Label' },
        variant: { type: 'select', label: 'Badge Style Preset', options: [{ label: 'Cyan Glow', value: 'cyan' }, { label: 'Purple Glow', value: 'purple' }, { label: 'Emerald Glow', value: 'emerald' }] },
        bgColor: { type: 'text', label: 'Custom Background Color' },
        textColor: { type: 'text', label: 'Custom Text Color' },
        borderColor: { type: 'text', label: 'Custom Border Color' },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { badgeText: 'FEATURE HIGHLIGHT', variant: 'cyan', bgColor: '', textColor: '', borderColor: '', customClass: '', customCss: '' },
      render: ({ badgeText, bgColor, textColor, borderColor, customClass, customCss }) => (
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold border uppercase tracking-widest bg-cyan-500/15 text-cyan-300 border-cyan-500/30 ${customClass}`}
          style={{
            backgroundColor: bgColor || undefined,
            color: textColor || undefined,
            borderColor: borderColor || undefined,
            ...parseCustomCss(customCss)
          }}
        >
          <Sparkles size={12}/>{badgeText}
        </span>
      )
    },
    Spacer: {
      fields: {
        height: { type: 'text', label: 'Spacer Height (e.g. 32px, 64px)' },
        bgColor: { type: 'text', label: 'Custom Background Color' },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { height: '32px', bgColor: '', customClass: '', customCss: '' },
      render: ({ height, bgColor, customClass, customCss }) => (
        <div
          className={`w-full ${customClass}`}
          style={{
            height: height || '32px',
            backgroundColor: bgColor || undefined,
            ...parseCustomCss(customCss)
          }}
        />
      )
    },
    Divider: {
      fields: {
        variant: { type: 'select', label: 'Divider Style', options: [{ label: 'Gradient', value: 'gradient' }, { label: 'Solid', value: 'solid' }, { label: 'Dashed', value: 'dashed' }] },
        color: { type: 'text', label: 'Line Color / Gradient (Hex / CSS)' },
        thickness: { type: 'text', label: 'Line Thickness (e.g. 1px, 2px)' },
        customClass: { type: 'text', label: 'Custom Tailwind Classes' },
        customCss: { type: 'textarea', label: 'Custom Inline CSS' }
      },
      defaultProps: { variant: 'gradient', color: '', thickness: '1px', customClass: '', customCss: '' },
      render: ({ variant, color, thickness, customClass, customCss }) => {
        const borderStyle = variant === 'dashed' ? 'dashed' : 'solid'
        return (
          <div
            className={`w-full my-6 ${variant === 'gradient' && !color ? 'h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent' : ''} ${customClass}`}
            style={{
              height: variant === 'gradient' ? thickness || '1px' : undefined,
              borderTop: variant !== 'gradient' ? `${thickness || '1px'} ${borderStyle} ${color || 'rgba(255,255,255,0.15)'}` : undefined,
              background: variant === 'gradient' && color ? color : undefined,
              ...parseCustomCss(customCss)
            }}
          />
        )
      }
    },
  },
}

// HELPER: PARSE RAW INLINE CSS STRING TO REACT STYLE OBJECT
function parseCustomCss(cssString?: string): React.CSSProperties {
  if (!cssString || typeof cssString !== 'string') return {}
  const styleObj: Record<string, string> = {}
  cssString.split(';').forEach(line => {
    const [key, val] = line.split(':')
    if (key && val) {
      const camelKey = key.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styleObj[camelKey] = val.trim()
    }
  })
  return styleObj as React.CSSProperties
}

export default function PuckTemplateStudio({
  template,
  onBack,
  onSave,
}: PuckTemplateStudioProps) {
  const [templateName, setTemplateName] = useState(template.name || 'Untitled Template')
  const [category, setCategory] = useState(template.category || 'Landing Page')
  const [description, setDescription] = useState(template.description || '')
  const [globalCssOpen, setGlobalCssOpen] = useState(false)
  const [globalCssCode, setGlobalCssCode] = useState(template.global_css || '')

  // MULTI-PAGE SYSTEM STATE
  const [multiPageProject, setMultiPageProject] = useState<MultiPageProjectData>(() =>
    normalizeMultiPageData(template.grapesjs_data, template.name || 'Home')
  )
  const [pageManagerOpen, setPageManagerOpen] = useState(false)

  // STUDIO ENHANCEMENTS: VIEWPORT, LIVE PREVIEW & THEMES
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [themePalette, setThemePalette] = useState<string>('cyberpunk')

  // Theme Palettes Preset Quick Switcher
  const THEME_PALETTES: Record<string, { name: string; bg: string; text: string; accent: string }> = {
    cyberpunk: { name: '⚡ Cyberpunk Neon', bg: '#090a0f', text: '#f8fafc', accent: '#06b6d4' },
    obsidian: { name: '🖤 Obsidian Gold', bg: '#050505', text: '#fef08a', accent: '#eab308' },
    midnight: { name: '🌌 Deep Midnight', bg: '#0f172a', text: '#e2e8f0', accent: '#818cf8' },
    emerald: { name: '🌿 Emerald Luxury', bg: '#022c22', text: '#ecfdf5', accent: '#10b981' },
    slate: { name: '⚪ Minimal Slate', bg: '#f8fafc', text: '#0f172a', accent: '#0284c7' }
  }

  const handleApplyGlobalTheme = (key: string) => {
    const selected = THEME_PALETTES[key]
    if (!selected) return
    setThemePalette(key)

    setMultiPageProject(prev => ({
      ...prev,
      pages: prev.pages.map(p => ({
        ...p,
        data: {
          ...p.data,
          root: {
            ...p.data.root,
            props: {
              ...p.data.root?.props,
              bodyBackground: selected.bg
            }
          }
        }
      }))
    }))

    setFeedback({ type: 'success', message: `Applied ${selected.name} Theme across all pages!` })
    setTimeout(() => setFeedback(null), 3000)
  }

  // Current Active Page data ref for Puck
  const currentActivePage = multiPageProject.pages.find(p => p.id === multiPageProject.activePageId) || multiPageProject.pages[0]

  // Memoize stable page data reference to prevent Puck store reset mid-hover/drag
  const activePageData = useMemo(() => {
    return ensureContentIds(currentActivePage.data)
  }, [currentActivePage.id, currentActivePage.data])

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Hover Component Preview State
  const [hoveredComponent, setHoveredComponent] = useState<{ type: string; y: number } | null>(null)

  // Track Puck instance / current data state
  const currentPuckDataRef = useRef<Data>(currentActivePage.data)

  // Event listener for sidebar hover component preview & internal link navigation
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      // Limit hover detection strictly to left sidebar drawer region (x < 320px)
      if (e.clientX > 320) {
        setHoveredComponent(null)
        return
      }

      // Target individual item buttons or item text nodes
      const itemEl = target.closest('button, [class*="DrawerItem"], [class*="item"], [data-puck-component]') as HTMLElement
      
      let text = (target.textContent || itemEl?.textContent || '').trim()

      if (text.includes('\n')) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
        const compKeys = Object.keys(puckConfig.components)
        const foundLine = lines.find(line => compKeys.some(k => k.toLowerCase() === line.toLowerCase()))
        text = foundLine || lines[0] || ''
      }

      if (text) {
        const compKeys = Object.keys(puckConfig.components)
        let matchedKey = compKeys.find(k => k.toLowerCase() === text.toLowerCase())
        if (!matchedKey) {
          matchedKey = compKeys.find(k => text.includes(k) && text.length < k.length + 15)
        }

        if (matchedKey) {
          const rect = (itemEl || target).getBoundingClientRect()
          setHoveredComponent({
            type: matchedKey,
            y: Math.max(60, Math.min(window.innerHeight - 320, rect.top - 10)),
          })
          return
        }
      }
      setHoveredComponent(null)
    }

    const wrapper = document.querySelector('.puck-dark-wrapper')
    if (wrapper) {
      wrapper.addEventListener('mouseover', handleMouseOver as any)
      return () => wrapper.removeEventListener('mouseover', handleMouseOver as any)
    }
  }, [])

  // Listen to link clicks inside Puck preview canvas to handle internal page navigation
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return

      // Check if href matches any page slug in the project
      const targetPage = multiPageProject.pages.find(p => p.slug === href || (href === '/' && p.isHome))
      if (targetPage && targetPage.id !== multiPageProject.activePageId) {
        e.preventDefault()
        handleSwitchPage(targetPage.id)
      }
    }

    window.addEventListener('click', handleLinkClick)
    return () => window.removeEventListener('click', handleLinkClick)
  }, [multiPageProject])

  const [mounted, setMounted] = useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // SWITCH ACTIVE PAGE
  const handleSwitchPage = (newPageId: string) => {
    if (newPageId === multiPageProject.activePageId) return

    // Save current active page data first
    setMultiPageProject(prev => {
      const updatedPages = prev.pages.map(p =>
        p.id === prev.activePageId ? { ...p, data: currentPuckDataRef.current } : p
      )
      return {
        pages: updatedPages,
        activePageId: newPageId,
      }
    })
  }

  // CREATE NEW PAGE FROM PRESET
  const handleCreatePageFromPreset = (preset: typeof PAGE_PRESETS[0]) => {
    const pageCount = multiPageProject.pages.length
    const pageName = `${preset.name} ${pageCount > 1 ? pageCount : ''}`.trim()
    const pageSlug = generatePageSlug(pageName)
    const newPageId = `page-${Date.now()}`

    const newPage: SitePage = {
      id: newPageId,
      name: pageName,
      slug: pageSlug,
      isHome: false,
      data: preset.getStarterData(pageName),
    }

    setMultiPageProject(prev => {
      const updatedPages = prev.pages.map(p =>
        p.id === prev.activePageId ? { ...p, data: currentPuckDataRef.current } : p
      )
      return {
        pages: [...updatedPages, newPage],
        activePageId: newPageId,
      }
    })

    setFeedback({ type: 'success', message: `Created new page: ${pageName} (${pageSlug})` })
    setTimeout(() => setFeedback(null), 3000)
  }

  // UPDATE PAGE META (NAME / SLUG)
  const handleUpdatePageMeta = (pageId: string, name: string, slug: string) => {
    setMultiPageProject(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id === pageId) {
          const cleanSlug = p.isHome ? '/' : (slug.startsWith('/') ? slug : `/${slug}`)
          return { ...p, name, slug: cleanSlug }
        }
        return p
      }),
    }))
  }

  // SET PAGE AS HOME PAGE (/)
  const handleSetHomePage = (pageId: string) => {
    setMultiPageProject(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id === pageId) {
          return { ...p, isHome: true, slug: '/' }
        }
        return { ...p, isHome: false, slug: p.slug === '/' ? `/${p.name.toLowerCase().replace(/\s+/g, '-')}` : p.slug }
      }),
    }))
  }

  // DUPLICATE PAGE
  const handleDuplicatePage = (pageId: string) => {
    const sourcePage = multiPageProject.pages.find(p => p.id === pageId)
    if (!sourcePage) return

    const newName = `${sourcePage.name} Copy`
    const newSlug = generatePageSlug(newName)
    const newPageId = `page-${Date.now()}`

    const duplicated: SitePage = {
      id: newPageId,
      name: newName,
      slug: newSlug,
      isHome: false,
      data: JSON.parse(JSON.stringify(sourcePage.data)),
    }

    setMultiPageProject(prev => ({
      ...prev,
      pages: [...prev.pages, duplicated],
    }))
  }

  // DELETE PAGE
  const handleDeletePage = (pageId: string) => {
    if (multiPageProject.pages.length <= 1) {
      setFeedback({ type: 'error', message: 'Cannot delete the last remaining page!' })
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    setMultiPageProject(prev => {
      const filtered = prev.pages.filter(p => p.id !== pageId)
      let newActive = prev.activePageId
      if (prev.activePageId === pageId) {
        newActive = filtered[0].id
      }
      return {
        pages: filtered,
        activePageId: newActive,
      }
    })
  }

  // Handle Save Template to Supabase
  const handlePublish = async (puckData: Data) => {
    setFeedback(null)

    // Sync latest Puck canvas data into active page state
    currentPuckDataRef.current = puckData
    const updatedPages = multiPageProject.pages.map(p =>
      p.id === multiPageProject.activePageId ? { ...p, data: puckData } : p
    )

    const finalProjectData: MultiPageProjectData = {
      pages: updatedPages,
      activePageId: multiPageProject.activePageId,
    }

    try {
      await onSave({
        name: templateName,
        category,
        description,
        grapesjs_data: finalProjectData,
        html_code: JSON.stringify(puckData.content),
        css_code: '',
        global_css: globalCssCode,
      })

      setMultiPageProject(finalProjectData)
      setFeedback({ type: 'success', message: 'Multi-Page Website saved to Supabase successfully!' })
      setTimeout(() => setFeedback(null), 3000)
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save template' })
    }
  }

  // Export Multi-Page ZIP
  const handleDownloadZip = () => {
    // Sync current active data first
    const updatedPages = multiPageProject.pages.map(p =>
      p.id === multiPageProject.activePageId ? { ...p, data: currentPuckDataRef.current } : p
    )
    const latestProject: MultiPageProjectData = { ...multiPageProject, pages: updatedPages }
    exportMultiPageZip(latestProject, templateName)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#090a0f] text-slate-200 font-sans text-xs select-none">
      {/* TOP HEADER CONTROLS BAR */}
      <header className="h-[56px] px-4 flex items-center justify-between border-b border-white/10 bg-[#0f111a] shrink-0 z-20">
        {/* Left: Back & Template Meta */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="bg-transparent font-bold text-white text-sm focus:outline-none focus:border-b focus:border-cyan-400 max-w-[180px] sm:max-w-[240px] truncate"
            />
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>

        {/* Center: PAGE SELECTOR DROPDOWN & RESPONSIVE VIEWPORT TOGGLES */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#090a0f] p-1.5 rounded-xl border border-cyan-500/30">
            <FileText size={14} className="text-cyan-400 ml-1" />
            <span className="text-[11px] font-bold text-slate-400">Page:</span>
            <select
              value={multiPageProject.activePageId}
              onChange={e => handleSwitchPage(e.target.value)}
              className="bg-[#0f111a] text-cyan-300 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {multiPageProject.pages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.isHome ? '🏠 ' : '📄 '}{page.name} ({page.slug})
                </option>
              ))}
            </select>

            <button
              onClick={() => setPageManagerOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-bold transition-all text-xs cursor-pointer ml-1"
            >
              <Settings2 size={13} /> Pages ({multiPageProject.pages.length})
            </button>
          </div>

          {/* RESPONSIVE VIEWPORT SWITCHER */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-[#090a0f] border border-white/10 gap-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${viewport === 'desktop' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Desktop Viewport (100%)"
            >
              <Monitor size={13} /> Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${viewport === 'tablet' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Tablet Viewport (768px)"
            >
              <Layout size={13} /> Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${viewport === 'mobile' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Mobile Viewport (375px)"
            >
              <Smartphone size={13} /> Mobile
            </button>
          </div>
        </div>

        {/* Right: Theme Selector, Live Preview & Actions */}
        <div className="flex items-center gap-2">
          {/* THEME PALETTE QUICK SELECTOR */}
          <div className="hidden lg:flex items-center gap-1 bg-[#090a0f] px-2 py-1 rounded-xl border border-white/10">
            <Sparkles size={13} className="text-amber-400" />
            <select
              value={themePalette}
              onChange={e => handleApplyGlobalTheme(e.target.value)}
              className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {Object.entries(THEME_PALETTES).map(([key, pal]) => (
                <option key={key} value={key} className="bg-[#0f111a] text-slate-200">
                  {pal.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 font-bold transition-all cursor-pointer"
            title="Open Interactive Full-Screen Live Preview"
          >
            <Eye size={14} /> Preview
          </button>

          <button
            onClick={() => setGlobalCssOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-bold transition-all cursor-pointer"
          >
            <Globe size={14} /> Global CSS
          </button>

          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer font-bold transition-all"
            title="Export Multi-Page ZIP Website"
          >
            <Download size={14} /> Export ZIP
          </button>
        </div>
      </header>

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className={`absolute top-16 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold shadow-xl animate-in slide-in-from-top-2 ${
          feedback.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
        }`}>
          {feedback.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* MAIN PUCK EDITOR WORKSPACE (RENDER ACTIVE PAGE DATA) */}
      <div className={`flex-1 min-h-0 overflow-hidden relative puck-dark-wrapper bg-[#06070a] transition-all duration-300 ${
        viewport === 'tablet' ? 'max-w-[768px] mx-auto border-x border-cyan-500/30 my-2 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)]' :
        viewport === 'mobile' ? 'max-w-[375px] mx-auto border-x border-cyan-500/30 my-2 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)]' :
        'w-full'
      }`}>
        {mounted ? (
          <Puck
            key="puck-studio-canvas"
            config={puckConfig}
            data={activePageData}
            onChange={(newData) => {
              currentPuckDataRef.current = ensureContentIds(newData)
            }}
            onPublish={handlePublish}
            headerTitle={`Editing: ${templateName} -> ${currentActivePage.name} (${currentActivePage.slug})`}
            iframe={{ enabled: false }}
            overrides={{
              outline: () => <div className="hidden" />,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-cyan-400 font-bold">Loading 105 Studio Presets Engine...</div>
        )}

        {/* LIVE SIDEBAR HOVER COMPONENT PREVIEW FLOATING CARD */}
        {hoveredComponent && puckConfig.components[hoveredComponent.type as keyof ComponentProps] && (
          <div
            className="fixed left-[310px] z-50 w-[500px] bg-[#0d0f19]/95 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.4)] p-4 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{ top: `${hoveredComponent.y}px` }}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/25 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-cyan-400" />
                <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                  Live Preview: {hoveredComponent.type}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded font-mono">
                Desktop View (1150px)
              </span>
            </div>

            {/* Minified Live Render Window */}
            <div className="w-full h-[220px] bg-[#090a0f] rounded-xl border border-white/10 overflow-hidden relative p-0">
              <div className="w-[1150px] min-h-[520px] transform scale-[0.4] origin-top-left pointer-events-none select-none bg-[#090a0f]">
                {(() => {
                  const compConfig = puckConfig.components[hoveredComponent.type as keyof ComponentProps] as any
                  if (!compConfig || typeof compConfig.render !== 'function') return null
                  return compConfig.render(compConfig.defaultProps || {})
                })()}
              </div>
            </div>

            <div className="mt-2.5 text-[10px] text-cyan-300 text-center font-semibold flex items-center justify-center gap-1">
              <Sparkles size={11} /> Drag or click block to insert into page canvas
            </div>
          </div>
        )}
      </div>

      {/* PAGE MANAGER MODAL (ระบบจัดการ PAGE) */}
      {pageManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-[#0d0f19] border border-cyan-500/40 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#090a0f] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-cyan-400" />
                <div>
                  <h3 className="text-base font-extrabold text-white">Multi-Page Website Manager</h3>
                  <p className="text-[11px] text-slate-400">Manage pages, routes, titles, and presets for {templateName}</p>
                </div>
              </div>
              <button onClick={() => setPageManagerOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick Add Page Presets */}
              <div>
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Plus size={14} /> Quick Add Page Preset
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {PAGE_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handleCreatePageFromPreset(preset)}
                      className="p-3 rounded-2xl bg-[#090a0f] border border-white/10 hover:border-cyan-400 hover:bg-cyan-500/10 text-left transition-all group cursor-pointer"
                    >
                      <strong className="text-xs font-extrabold text-white block mb-1 group-hover:text-cyan-300">{preset.name}</strong>
                      <span className="text-[10px] text-slate-400 block truncate">{preset.slug}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pages List */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Website Pages ({multiPageProject.pages.length})</span>
                  <span className="text-[10px] text-slate-400">Click a page row to edit inline or set as home page</span>
                </h4>

                <div className="space-y-3">
                  {multiPageProject.pages.map(page => {
                    const isActive = page.id === multiPageProject.activePageId
                    return (
                      <div
                        key={page.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isActive ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg' : 'bg-[#090a0f] border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Left: Page Icon & Name / Slug Inputs */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${page.isHome ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                            {page.isHome ? <Home size={18} /> : <FileText size={18} />}
                          </div>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={page.name}
                                onChange={e => handleUpdatePageMeta(page.id, e.target.value, page.slug)}
                                className="bg-[#0f111a] text-white font-extrabold text-xs px-2.5 py-1 rounded-lg border border-white/15 focus:outline-none focus:border-cyan-400"
                                placeholder="Page Name"
                              />
                              {page.isHome && (
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-black uppercase">
                                  HOME PAGE
                                </span>
                              )}
                              {isActive && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase">
                                  ACTIVE EDITING
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                              <span>Slug:</span>
                              <input
                                type="text"
                                disabled={page.isHome}
                                value={page.slug}
                                onChange={e => handleUpdatePageMeta(page.id, page.name, e.target.value)}
                                className={`bg-[#0f111a] font-mono text-cyan-300 text-xs px-2.5 py-1 rounded-lg border focus:outline-none focus:border-cyan-400 ${page.isHome ? 'opacity-50 border-white/10' : 'border-white/15'}`}
                                placeholder="/slug"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {!page.isHome && (
                            <button
                              onClick={() => handleSetHomePage(page.id)}
                              className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-bold text-xs cursor-pointer flex items-center gap-1"
                              title="Set as Home Page (/)"
                            >
                              <Home size={12} /> Set Home
                            </button>
                          )}

                          {!isActive && (
                            <button
                              onClick={() => {
                                handleSwitchPage(page.id)
                                setPageManagerOpen(false)
                              }}
                              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
                            >
                              Edit Page
                            </button>
                          )}

                          <button
                            onClick={() => handleDuplicatePage(page.id)}
                            className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
                            title="Duplicate Page"
                          >
                            <Copy size={14} />
                          </button>

                          {multiPageProject.pages.length > 1 && (
                            <button
                              onClick={() => handleDeletePage(page.id)}
                              className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                              title="Delete Page"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#090a0f] flex items-center justify-between">
              <span className="text-xs text-slate-400">Changes apply immediately to project page structure.</span>
              <button
                onClick={() => setPageManagerOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL CSS SYSTEM MODAL */}
      {globalCssOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0d0f19] border border-white/15 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Global CSS Class System</h3>
              </div>
              <button onClick={() => setGlobalCssOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <p className="text-slate-400 text-xs">
              Write custom CSS rules. These rules will apply globally to all pages in your website template.
            </p>

            <textarea
              rows={10}
              value={globalCssCode}
              onChange={e => setGlobalCssCode(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#06070b] border border-white/15 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 leading-relaxed"
              placeholder=".custom-card { border-radius: 16px; }"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setGlobalCssOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE LIVE PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#090a0f] text-slate-200">
          {/* Preview Header */}
          <div className="h-14 px-6 bg-[#0f111a] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <Eye size={16} className="text-purple-400" /> Live Interactive Preview
              </span>
              <span className="text-xs text-slate-400 font-mono">({templateName})</span>
            </div>

            {/* Page Navigation Tabs inside Preview */}
            <div className="flex items-center gap-2 bg-[#06070a] p-1 rounded-xl border border-white/10">
              {multiPageProject.pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => handleSwitchPage(page.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${page.id === multiPageProject.activePageId ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
                >
                  {page.isHome ? '🏠 Home' : page.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
              >
                <Download size={14} /> Export Site ZIP
              </button>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Exit Preview"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Preview Body Canvas */}
          <div className="flex-1 overflow-y-auto bg-[#090a0f] p-4 md:p-8">
            <style dangerouslySetInnerHTML={{ __html: globalCssCode }} />
            <div className={`mx-auto bg-[#090a0f] transition-all duration-300 ${
              viewport === 'tablet' ? 'max-w-[768px] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden' :
              viewport === 'mobile' ? 'max-w-[375px] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden' :
              'max-w-7xl'
            }`}>
              {Array.isArray(activePageData.content) && activePageData.content.length > 0 ? (
                activePageData.content.map((item: any, idx: number) => {
                  const compConfig = puckConfig.components[item.type as keyof ComponentProps] as any
                  if (!compConfig || typeof compConfig.render !== 'function') return null
                  return (
                    <div key={item.id || idx} className="w-full relative">
                      {compConfig.render({ ...(compConfig.defaultProps || {}), ...(item.props || {}) })}
                    </div>
                  )
                })
              ) : (
                <div className="py-32 text-center text-slate-500 font-bold">
                  This page has no elements yet. Close preview and drag blocks from the left sidebar.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
