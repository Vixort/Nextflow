import React, { useState } from 'react'
import Link from 'next/link'
import { Config, DropZone } from '@puckeditor/core'
import {
  Sparkles, Layout, Play, Star, HelpCircle,
  ShieldCheck, Zap, Lock, Award, Search, Bell, User, Menu, ChevronDown, Phone,
  Mail, Calendar, CheckCircle2, ShoppingBag, ShieldAlert, Cpu
} from 'lucide-react'

export type ComponentProps = {
  // 1. HEADER & NAVBARS (20 PRESETS)
  Navbar: { brandName: string; ctaText: string; ctaUrl: string; link1Text: string; link1Url: string; link2Text: string; link2Url: string; link3Text: string; link3Url: string; link4Text: string; link4Url: string; link5Text: string; link5Url: string; fixedTop: boolean; customClass: string; customCss: string }
  NavbarMinimal: { brandName: string; linkText: string; linkUrl: string; ctaText: string; ctaUrl: string; fixedTop: boolean }
  NavbarCentred: { brandName: string; link1: string; link1Url: string; link2: string; link2Url: string; link3: string; link3Url: string; link4: string; link4Url: string; ctaText: string; ctaUrl: string }
  NavbarFloatingPill: { brandName: string; link1: string; link1Url: string; link2: string; link2Url: string; link3: string; link3Url: string; ctaText: string; ctaUrl: string; pillGlow: boolean }
  NavbarMegaMenu: { brandName: string; solutionText: string; productText: string; resourceText: string; ctaSecondary: string; ctaPrimary: string }
  NavbarCyberpunk: { brandName: string; statusDot: string; monoStat: string; ctaText: string }
  NavbarLuxuryDark: { brandName: string; subtitle: string; ctaText: string }
  NavbarSplitCTA: { topPhone: string; topEmail: string; brandName: string; ctaText: string }
  NavbarAppHeader: { brandName: string; searchPlaceholder: string; userRole: string }
  NavbarGlassmorphism: { brandName: string; blurAmount: string; ctaText: string }
  NavbarGradientBorder: { brandName: string; gradientPreset: 'cyan-blue' | 'purple-cyan' | 'emerald-cyan'; ctaText: string }
  NavbarMobileFriendly: { brandName: string; ctaText: string }
  NavbarECommerce: { brandName: string; searchPlaceholder: string; cartCount: string; ctaText: string; link1Text: string; link1Url: string; link2Text: string; link2Url: string; link3Text: string; link3Url: string }
  NavbarNewsMagazine: { dateText: string; breakingNews: string; brandName: string; ctaText: string }
  NavbarBrutalist: { brandName: string; tagText: string; ctaText: string }
  NavbarFloatingGlass: { brandName: string; link1: string; link1Url: string; link2: string; link2Url: string; link3: string; link3Url: string; ctaText: string; ctaUrl: string }
  NavbarMinimalMonochrome: { brandName: string; link1: string; link1Url: string; link2: string; link2Url: string; link3: string; link3Url: string; ctaText: string; ctaUrl: string }
  NavbarGradientSubtle: { brandName: string; tagText: string; ctaText: string; ctaUrl: string }
  NavbarCompactSearch: { brandName: string; searchPlaceholder: string; ctaText: string; ctaUrl: string }
  NavbarDrawerMenu: { brandName: string; menuLabel: string; ctaText: string; ctaUrl: string }

  // 2. HERO SECTIONS (20 PRESETS)
  Hero: { badge: string; title: string; gradientTitle: string; description: string; primaryCta: string; primaryUrl: string; secondaryCta: string; secondaryUrl: string; align: 'center' | 'left'; themeStyle: 'dark' | 'glass' | 'neon' | 'carbon'; padding: 'compact' | 'standard' | 'spacious'; customClass: string; customCss: string }
  HeroVideoModal: { badge: string; title: string; description: string; videoPosterUrl: string; ctaLabel: string; ctaUrl: string }
  HeroSplitImage: { badge: string; title: string; description: string; imageSrc: string; primaryCta: string; primaryUrl: string; secondaryCta: string; secondaryUrl: string }
  HeroCyberpunkGlow: { badge: string; title: string; subtitle: string; ctaText: string; ctaUrl: string; terminalLog: string }
  HeroMinimalSerif: { badge: string; headline: string; subheadline: string; ctaText: string; ctaUrl: string }
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
  HeroVideoBackground: { badge: string; title: string; description: string; ctaText: string; ctaUrl: string; secondaryCta: string; secondaryUrl: string }
  HeroInteractiveCodeEditor: { badge: string; title: string; subhead: string; codeSnippet: string; ctaText: string; ctaUrl: string }
  HeroMinimalistTypography: { badge: string; mainHeading: string; subhead: string; ctaText: string; ctaUrl: string }
  HeroProductCarousel: { badge: string; title: string; description: string; ctaText: string; ctaUrl: string }
  HeroIsometricIllustration: { badge: string; title: string; description: string; ctaText: string; ctaUrl: string }
  HeroImmersiveVideo: { badgeText: string; title: string; subhead: string; videoUrl: string; posterUrl: string; ctaText: string; secondaryCta: string }
  VideoScrollParallax: { title: string; caption: string; videoUrl: string; posterUrl: string }

  // 3. FEATURES & BENTO (20 PRESETS)
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
  BentoFeatureHighlight3: { title: string; card1Title: string; card1Desc: string; card2Title: string; card2Desc: string; card3Title: string; card3Desc: string }
  FeatureComparisonGrid: { title: string; col1Name: string; col2Name: string; row1: string; row2: string; row3: string }
  FeatureInteractiveHoverGrid: { title: string; item1: string; item2: string; item3: string; item4: string }
  FeatureTerminalSnippet: { title: string; codeContent: string; description: string }
  FeatureWorkflowPipeline: { title: string; step1: string; step2: string; step3: string; step4: string }

  // 4. PORTFOLIO & SHOWCASE (20 PRESETS)
  PortfolioShowcase: { title: string; subhead: string; project1Title: string; project1Img: string; project1Tag: string; project2Title: string; project2Img: string; project2Tag: string; padding: 'compact' | 'standard'; customClass: string; customCss: string }
  PortfolioMasonryGrid: { title: string; item1Title?: string; item1Category?: string; item1Img?: string; item2Title?: string; item2Category?: string; item2Img?: string; item3Title?: string; item3Category?: string; item3Img?: string; p1Title?: string; p1Img?: string; p2Title?: string; p2Img?: string; p3Title?: string; p3Img?: string }
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
  PortfolioInteractiveGrid: { title: string; p1Name: string; p1Category: string; p2Name: string; p2Category: string }
  Portfolio3DTiltCard: { title: string; cardTitle: string; cardTag: string; description: string }
  PortfolioMetricsShowcase: { title: string; metric1: string; label1: string; metric2: string; label2: string }
  PortfolioLogoWallDark: { title: string; logo1: string; logo2: string; logo3: string; logo4: string }
  PortfolioBeforeAfterSlider: { title: string; beforeLabel: string; afterLabel: string }
  PortfolioFullBleedBanner: { title: string; subtitle: string; ctaText: string; ctaUrl: string }
  PortfolioTestimonialCard: { title: string; quote: string; clientName: string; clientRole: string }
  PortfolioHorizontalScroll: { title: string; item1: string; item2: string; item3: string }

  // LUXURY ESTATE & REAL ESTATE ATELIER PRESETS
  EstateHeroEditorial: { location: string; title: string; subtitle: string; price: string; specs: string; heroImg: string; ctaText: string; ctaUrl: string; secText: string; secUrl: string }
  EstateGridGallery: { title: string; subtitle: string; e1Title: string; e1Loc: string; e1Price: string; e1Img: string; e2Title: string; e2Loc: string; e2Price: string; e2Img: string; e3Title: string; e3Loc: string; e3Price: string; e3Img: string }
  EstateSpecsDetail: { title: string; subtitle: string; spec1Title: string; spec1Desc: string; spec2Title: string; spec2Desc: string; spec3Title: string; spec3Desc: string; spec4Title: string; spec4Desc: string }
  EstateInquiryForm: { title: string; subhead: string; buttonText: string; placeholder: string }
  EstateImageRailEditorial: { title: string; subtitle: string; item1Title: string; item1Loc: string; item1Price: string; item1Img: string; item2Title: string; item2Loc: string; item2Price: string; item2Img: string; item3Title: string; item3Loc: string; item3Price: string; item3Img: string; item4Title: string; item4Loc: string; item4Price: string; item4Img: string }
  EstateFullBleedParallaxHero: { badge: string; title: string; subtitle: string; location: string; price: string; bgImg: string; ctaText: string; ctaUrl: string; secText: string; secUrl: string }
  EstatePhilosophyQuote: { quote: string; author: string; monograph: string; bgImg: string }
  EstateArchitecturalTimeline: { title: string; subtitle: string; step1Title: string; step1Desc: string; step2Title: string; step2Desc: string; step3Title: string; step3Desc: string; step4Title: string; step4Desc: string }

  // 5. TESTIMONIALS & FAQ (20 PRESETS)
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
  TestimonialCarousel3D: { title: string; quote1: string; name1: string; quote2: string; name2: string }
  TestimonialQuoteMinimal: { quote: string; author: string; role: string }
  TestimonialCompanyGrid: { title: string; company1: string; company2: string; company3: string }
  FaqTabbedAccordion: { title: string; tab1: string; q1: string; a1: string; tab2: string; q2: string; a2: string }
  FaqInteractiveSearch: { title: string; searchPlaceholder: string; q1: string; a1: string }
  FaqCardGrid3Column: { title: string; q1: string; a1: string; q2: string; a2: string; q3: string; a3: string }
  CommunityStatsBox: { title: string; count: string; description: string; joinCta: string; joinUrl: string }
  TrustCertificatesBadge: { title: string; cert1: string; cert2: string; cert3: string }

  // 6. PRICING & CTA (20 PRESETS)
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
  PricingSliderTier: { title: string; minPrice: string; maxPrice: string; unitLabel: string }
  PricingEnterpriseCustom: { title: string; subtitle: string; feature1: string; feature2: string; ctaText: string; ctaUrl: string }
  CtaInteractiveNewsletter: { title: string; description: string; buttonText: string }
  CtaFullWidthGradient: { title: string; subhead: string; buttonText: string; buttonUrl: string }
  CtaFloatingBar: { message: string; buttonText: string; buttonUrl: string }

  // 7. FOOTERS (20 PRESETS)
  Footer: { brandName: string; description: string; copyrightText: string; link1: string; link1Url: string; link2: string; link2Url: string; link3: string; link3Url: string; link4: string; link4Url: string }
  FooterMinimalRail: { brandName: string; copyrightText: string; link1: string; link1Url: string; link2: string; link2Url: string }
  FooterNewsletterBig: { brandName: string; newsletterSubhead: string; copyrightText: string }
  FooterCyberpunkMono: { brandName: string; statusText: string; copyrightText: string }
  FooterAppStoreLinks: { brandName: string; appStoreText: string; copyrightText: string }
  FooterLuxurySerif: { brandName: string; tagLine: string; copyrightText: string }
  FooterMegaSiteMap: { brandName: string; col1Title: string; col2Title: string; copyrightText: string }
  FooterSocialIconsOnly: { brandName: string; copyrightText: string }
  FooterGradientBorder: { brandName: string; copyrightText: string }
  FooterBrutalistBox: { brandName: string; tag: string; copyrightText: string }
  FooterCenteredBrand: { brandName: string; tagline: string; copyrightText: string }
  FooterMinimalInline: { brandName: string; copyrightText: string; link1: string; link1Url: string; link2: string; link2Url: string }
  FooterMultiColumnMap: { brandName: string; col1Title: string; col2Title: string; copyrightText: string }
  FooterCyberpunkTerminal: { brandName: string; systemLog: string; copyrightText: string }
  FooterNewsletterInline: { brandName: string; placeholder: string; copyrightText: string }
  FooterBadgeRow: { brandName: string; badge1: string; badge2: string; copyrightText: string }
  FooterMinimalCentered: { brandName: string; tagline: string; copyrightText: string }
  FooterDarkGrid: { brandName: string; description: string; copyrightText: string }
  FooterFloatingPill: { brandName: string; copyrightText: string; link1: string; link1Url: string }
  FooterCompactBar: { brandName: string; copyrightText: string }

  // 8. CONTAINERS & LAYOUT (3 PRESETS)
  FlexSection: { direction: 'row' | 'column'; justifyContent: string; alignItems: string; gap: string; width: string; customWidth: string; height: string; customHeight: string; minHeight: string; paddingTop: string; paddingBottom: string; paddingHorizontal: string; padding: string; background: string; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }
  GridColumns: { columns: '2' | '3' | '4'; gap: string; width: string; customWidth: string; height: string; customHeight: string; paddingTop: string; paddingBottom: string; paddingHorizontal: string; padding: string; background: string; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }
  CardBox: { title: string; variant: 'glass' | 'neon' | 'carbon'; width: string; customWidth: string; height: string; customHeight: string; paddingTop: string; paddingBottom: string; paddingHorizontal: string; padding: string; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }

  // 9. BASIC UI ELEMENTS (12 PRESETS)
  Heading: { text: string; level: 'h1' | 'h2' | 'h3' | 'h4'; fontSize: string; fontWeight: string; color: string; bgColor?: string; align: 'left' | 'center' | 'right'; gradient: boolean; customClass: string; customCss: string }
  Text: { text: string; fontSize: string; color: string; bgColor?: string; align: 'left' | 'center' | 'right'; customClass: string; customCss: string }
  Button: { label: string; url: string; variant: 'cyan' | 'glass' | 'outline' | 'gradient'; size: 'sm' | 'md' | 'lg'; bgColor?: string; textColor?: string; borderColor?: string; customClass: string; customCss: string }
  Image: { src: string; alt: string; rounded: 'none' | 'lg' | '2xl' | 'full'; shadowGlow: boolean; borderColor?: string; customClass: string; customCss: string }
  PillBadge: { badgeText: string; variant: 'cyan' | 'purple' | 'emerald'; bgColor?: string; textColor?: string; borderColor?: string; customClass?: string; customCss?: string }
  Spacer: { height: string; bgColor?: string; customClass?: string; customCss?: string }
  Divider: { variant: 'solid' | 'dashed' | 'gradient'; color: string; thickness?: string; customClass?: string; customCss?: string }
  DividerGradient: { height: string; gradient: string }
  StatBadgePill: { label: string; value: string; variant: 'cyan' | 'purple' | 'emerald' }
  ImageLightboxFrame: { src: string; caption: string }
  VideoPlayerEmbed: { videoUrl: string; posterSrc: string }
  CodeBlockTerminal: { title: string; code: string; language: string }

  // 10. INTERACTIVE & DYNAMIC UI PRESETS
  InteractiveTabsBento: { title: string; subhead: string; tab1Title: string; tab1Content: string; tab2Title: string; tab2Content: string; tab3Title: string; tab3Content: string }
  InteractivePricingCalculator: { title: string; subhead: string; basePrice: number; unitLabel: string; buttonText: string }
  InteractiveComparisonSlider: { title: string; beforeImg: string; beforeLabel: string; afterImg: string; afterLabel: string }
  InteractiveFaqAccordionCard: { title: string; category: string; q1: string; a1: string; q2: string; a2: string; q3: string; a3: string }
  InteractiveAudioPlayerCard: { trackTitle: string; artist: string; duration: string; posterImg: string }
  InteractiveTimelineStepper: { title: string; step1: string; step1Desc: string; step2: string; step2Desc: string; step3: string; step3Desc: string; step4: string; step4Desc: string }

  // 11. CREATIVE & HERO VISUAL PRESETS
  Hero3DGlassCard: { badge: string; title: string; description: string; ctaText: string; cardImg: string }
  HeroMinimalEditorial: { issueNo: string; title: string; description: string; quote: string; ctaText: string }
  HeroSplitTerminal: { badge: string; title: string; subhead: string; terminalTitle: string; commandText: string; outputLog: string }
  HeroMarqueeBanner: { marqueeText: string; subhead: string; ctaText: string; ctaUrl: string }

  // 12. CONTENT & EDITORIAL LAYOUT PRESETS
  EditorialArticleHeader: { tag: string; title: string; authorName: string; authorRole: string; readTime: string; publishedDate: string }
  EditorialQuoteBlock: { quote: string; author: string; company: string }
  EditorialGridCards: { sectionTitle: string; c1Title: string; c1Category: string; c2Title: string; c2Category: string; c3Title: string; c3Category: string }
  EditorialStatCallout: { statValue: string; statLabel: string; headline: string; description: string }

  // 13. ECOMMERCE & PRODUCT PRESETS
  EcommerceProductGrid: { title: string; p1Name: string; p1Price: string; p1Img: string; p2Name: string; p2Price: string; p2Img: string; p3Name: string; p3Price: string; p3Img: string }
  EcommerceFeatureHighlight: { productName: string; tagline: string; price: string; description: string; feature1: string; feature2: string; mainImg: string }
  EcommercePromoBanner: { promoBadge: string; headline: string; discountCode: string; subtext: string; ctaText: string }
  EcommerceProductsRail: { title: string; subtitle: string; p1Name: string; p1Price: string; p1Img: string; p2Name: string; p2Price: string; p2Img: string; p3Name: string; p3Price: string; p3Img: string; p4Name: string; p4Price: string; p4Img: string }
  EcommerceCatalogHero: { title: string; subtitle: string; category1: string; category2: string; category3: string; category4: string; activeCategory: string; itemCount: string }
  EcommerceProductGrid6: { title: string; subtitle: string; p1Name: string; p1Price: string; p1Badge: string; p1Img: string; p2Name: string; p2Price: string; p2Badge: string; p2Img: string; p3Name: string; p3Price: string; p3Badge: string; p3Img: string; p4Name: string; p4Price: string; p4Badge: string; p4Img: string; p5Name: string; p5Price: string; p5Badge: string; p5Img: string; p6Name: string; p6Price: string; p6Badge: string; p6Img: string }
  EcommerceCartSummary: { title: string; promoCode: string; subtotal: string; shipping: string; discount: string; total: string; checkoutUrl: string }
  EcommerceStorefrontBannerSlider: { badgeText: string; title: string; subtitle: string; ctaText: string; bannerImg1: string; bannerImg2: string; feature1Tag: string; feature2Tag: string }
  EcommerceProductGrid8: { title: string; subtitle: string; p1Name: string; p1Price: string; p1OriginalPrice: string; p1Badge: string; p1Img: string; p2Name: string; p2Price: string; p2OriginalPrice: string; p2Badge: string; p2Img: string; p3Name: string; p3Price: string; p3OriginalPrice: string; p3Badge: string; p3Img: string; p4Name: string; p4Price: string; p4OriginalPrice: string; p4Badge: string; p4Img: string; p5Name: string; p5Price: string; p5OriginalPrice: string; p5Badge: string; p5Img: string; p6Name: string; p6Price: string; p6OriginalPrice: string; p6Badge: string; p6Img: string; p7Name: string; p7Price: string; p7OriginalPrice: string; p7Badge: string; p7Img: string; p8Name: string; p8Price: string; p8OriginalPrice: string; p8Badge: string; p8Img: string }

  // 14. ATOMIC UI ELEMENTS
  BadgePillDot: { text: string; variant: 'cyan' | 'purple' | 'emerald' | 'amber' }
  GradientCardWrapper: { title: string; description: string; gradientPreset: 'cyan-blue' | 'purple-cyan' | 'emerald-teal' }
  AvatarGroupStack: { title: string; countText: string }
  RatingStarsBar: { score: string; reviewCount: string; label: string }

  // 15. LUXURY REAL ESTATE & ESTATES
  EstateHeroParallaxSlider: { title: string; subtitle: string; price: string; location: string; heroImg: string }
  EstateSpecsGrid3: { title: string; sqft: string; lotSize: string; yearBuilt: string; architect: string }
  EstateFloorplanViewer: { title: string; level1Name: string; level1Size: string; level2Name: string; level2Size: string }
  EstateAmenitiesGrid: { title: string; amenity1: string; amenity2: string; amenity3: string; amenity4: string }

  // 16. CYBERPUNK & SCI-FI DARK VOID
  CyberpunkTerminalHero: { title: string; subtext: string; promptCmd: string; sysStatus: string }
  CyberpunkBentoMatrix: { title: string; b1Title: string; b1Text: string; b2Title: string; b2Text: string; b3Title: string; b3Text: string }
  CyberpunkMetricsBox: { label: string; value: string; scanCode: string }
  CyberpunkFooterMono: { brandText: string; sysLog: string; copyrightText: string }

  // 17. NEUMORPHISM & SOFT UI
  NeumorphicHeroCard: { badge: string; title: string; description: string; ctaText: string }
  NeumorphicFeatureToggle: { title: string; f1Title: string; f2Title: string; f3Title: string }
  NeumorphicPricingCard: { planName: string; price: string; period: string; buttonText: string }

  // 18. BRUTALIST & RAW PRINT
  BrutalistMonoHeader: { headline: string; subheadline: string; tagText: string }
  BrutalistBentoBox: { title: string; box1Title: string; box2Title: string; box3Title: string }
  BrutalistCalloutBanner: { warningTitle: string; bannerText: string; actionText: string }

  // 19. GLASSMORPHISM & FROST
  GlassmorphicHeroSphere: { title: string; description: string; badge: string; heroImg: string }
  GlassmorphicFeatureGrid: { title: string; card1Title: string; card2Title: string; card3Title: string }
  GlassmorphicNavbarPill: { brandName: string; link1: string; link2: string; ctaText: string }

  // 20. ENTERPRISE FINTECH & SWISS DATA
  SwissGridHero: { headline: string; description: string; stat1Value: string; stat1Label: string }
  FintechMetricChartBox: { assetPair: string; price: string; changePercent: string; volume24h: string }
  FintechComplianceBadgeRow: { title: string; badge1: string; badge2: string; badge3: string; badge4: string }

  // 21. MOBILE-FIRST APP SHOWCASE
  AppStoreHeroMockup: { title: string; tagline: string; appStoreUrl: string; playStoreUrl: string; mockupImg: string }
  AppFeatureCarousel: { title: string; f1Title: string; f1Desc: string; f2Title: string; f2Desc: string }
  AppQrDownloadBanner: { title: string; qrText: string; scanSubtext: string }

  // 22. EVENTS, KEYNOTES & CONFERENCES
  EventConferenceHero: { eventName: string; dateVenue: string; countdownText: string; registerUrl: string }
  EventSpeakerGrid: { title: string; s1Name: string; s1Role: string; s2Name: string; s2Role: string }
  EventScheduleTimeline: { title: string; slot1Time: string; slot1Title: string; slot2Time: string; slot2Title: string }

  // 23. ACADEMY & E-LEARNING
  AcademyCourseHero: { courseTitle: string; instructor: string; rating: string; enrollPrice: string }
  AcademySyllabusAccordion: { title: string; m1Title: string; m1Duration: string; m2Title: string; m2Duration: string }
  AcademyInstructorCard: { name: string; title: string; bio: string; totalStudents: string }

  // 24. WEB3, CRYPTO & DAO
  Web3HeroConnect: { protocolName: string; tvlValue: string; tokenPrice: string; connectText: string }
  Web3TokenomicsPie: { title: string; communityPct: string; treasuryPct: string; teamPct: string }
  Web3RoadmapNodes: { title: string; phase1Title: string; phase2Title: string; phase3Title: string }

  // 25. ECO & SUSTAINABILITY
  EcoHeroForest: { headline: string; description: string; carbonOffset: string }
  EcoImpactMetrics: { title: string; treesPlanted: string; co2Reduced: string; cleanEnergyMwh: string }
}

// PAGE BODY ROOT SETTINGS PROPS TYPE
export type RootProps = {
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
export const puckConfig: Config<ComponentProps, RootProps> = {
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
      const initialBg = bodyBackground === 'custom' ? customBodyBackground || '#090a0f' : bodyBackground || '#090a0f'
      const customBg = initialBg
      const customText = bodyTextColor || '#e2e8f0'

      const pt = bodyPaddingTop ? (bodyPaddingTop.includes('p') ? bodyPaddingTop : `${bodyPaddingTop}`) : ''
      const pb = bodyPaddingBottom ? (bodyPaddingBottom.includes('p') ? bodyPaddingBottom : `${bodyPaddingBottom}`) : ''
      const px = bodyPaddingHorizontal ? (bodyPaddingHorizontal.includes('p') ? bodyPaddingHorizontal : `${bodyPaddingHorizontal}`) : ''

      const bodyStyle: React.CSSProperties = {
        background: customBg,
        color: customText,
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
        <div className={`min-h-[100dvh] w-full relative ${fontFamily || 'font-sans'} ${classPadding} ${customBodyClass || ''}`} style={bodyStyle}>
          {children}
        </div>
      )
    },
  },

  // 24 CATEGORIES (215+ TOTAL PRESETS)
  categories: {
    estate_luxury: {
      title: 'Luxury Real Estate & Estates (4 Presets)',
      components: ['EstateHeroParallaxSlider', 'EstateSpecsGrid3', 'EstateFloorplanViewer', 'EstateAmenitiesGrid'],
      defaultExpanded: true,
    },
    cyber_dark: {
      title: 'Cyberpunk & Sci-Fi Dark Void (4 Presets)',
      components: ['CyberpunkTerminalHero', 'CyberpunkBentoMatrix', 'CyberpunkMetricsBox', 'CyberpunkFooterMono'],
      defaultExpanded: false,
    },
    neumorphic: {
      title: 'Neumorphism & Soft UI (3 Presets)',
      components: ['NeumorphicHeroCard', 'NeumorphicFeatureToggle', 'NeumorphicPricingCard'],
      defaultExpanded: false,
    },
    brutalist_raw: {
      title: 'Brutalist & Raw Print (3 Presets)',
      components: ['BrutalistMonoHeader', 'BrutalistBentoBox', 'BrutalistCalloutBanner'],
      defaultExpanded: false,
    },
    glassmorphism: {
      title: 'Glassmorphism & Frost (3 Presets)',
      components: ['GlassmorphicHeroSphere', 'GlassmorphicFeatureGrid', 'GlassmorphicNavbarPill'],
      defaultExpanded: false,
    },
    fintech_swiss: {
      title: 'Enterprise Fintech & Swiss Data (3 Presets)',
      components: ['SwissGridHero', 'FintechMetricChartBox', 'FintechComplianceBadgeRow'],
      defaultExpanded: false,
    },
    mobile_showcase: {
      title: 'Mobile-First App Showcase (3 Presets)',
      components: ['AppStoreHeroMockup', 'AppFeatureCarousel', 'AppQrDownloadBanner'],
      defaultExpanded: false,
    },
    events_keynote: {
      title: 'Events & Keynote Summit (3 Presets)',
      components: ['EventConferenceHero', 'EventSpeakerGrid', 'EventScheduleTimeline'],
      defaultExpanded: false,
    },
    academy_edtech: {
      title: 'Academy & E-Learning (3 Presets)',
      components: ['AcademyCourseHero', 'AcademySyllabusAccordion', 'AcademyInstructorCard'],
      defaultExpanded: false,
    },
    web3_dao: {
      title: 'Web3, Crypto & DAO (3 Presets)',
      components: ['Web3HeroConnect', 'Web3TokenomicsPie', 'Web3RoadmapNodes'],
      defaultExpanded: false,
    },
    eco_sustainability: {
      title: 'Eco & Sustainability (2 Presets)',
      components: ['EcoHeroForest', 'EcoImpactMetrics'],
      defaultExpanded: false,
    },
    interactive: {
      title: 'Interactive & Dynamic UI (6 Presets)',
      components: [
        'InteractiveTabsBento', 'InteractivePricingCalculator', 'InteractiveComparisonSlider',
        'InteractiveFaqAccordionCard', 'InteractiveAudioPlayerCard', 'InteractiveTimelineStepper'
      ],
      defaultExpanded: false,
    },
    visuals: {
      title: 'Creative & Hero Visuals (4 Presets)',
      components: [
        'Hero3DGlassCard', 'HeroMinimalEditorial', 'HeroSplitTerminal', 'HeroMarqueeBanner'
      ],
      defaultExpanded: false,
    },
    editorial: {
      title: 'Content & Editorial (4 Presets)',
      components: [
        'EditorialArticleHeader', 'EditorialQuoteBlock', 'EditorialGridCards', 'EditorialStatCallout'
      ],
      defaultExpanded: false,
    },
    ecommerce: {
      title: 'Ecommerce & Showcase (9 Presets)',
      components: [
        'EcommerceProductGrid', 'EcommerceFeatureHighlight', 'EcommercePromoBanner', 'EcommerceProductsRail', 'EcommerceCatalogHero', 'EcommerceProductGrid6', 'EcommerceCartSummary', 'EcommerceStorefrontBannerSlider', 'EcommerceProductGrid8'
      ],
      defaultExpanded: false,
    },
    navbars: {
      title: 'Header & Navbar (20 Presets)',
      components: [
        'Navbar', 'NavbarMinimal', 'NavbarCentred', 'NavbarFloatingPill', 'NavbarMegaMenu',
        'NavbarCyberpunk', 'NavbarLuxuryDark', 'NavbarSplitCTA', 'NavbarAppHeader', 'NavbarGlassmorphism',
        'NavbarGradientBorder', 'NavbarMobileFriendly', 'NavbarECommerce', 'NavbarNewsMagazine', 'NavbarBrutalist',
        'NavbarFloatingGlass', 'NavbarMinimalMonochrome', 'NavbarGradientSubtle', 'NavbarCompactSearch', 'NavbarDrawerMenu'
      ],
      defaultExpanded: false,
    },
    heros: {
      title: 'Hero-Section (23 Presets)',
      components: [
        'Hero', 'HeroVideoModal', 'HeroSplitImage', 'HeroCyberpunkGlow', 'HeroMinimalSerif',
        'HeroAppMockup', 'HeroFormCapture', 'HeroGradientSphere', 'HeroNewsletterSignup', 'Hero3DCourse',
        'HeroBentoGrid', 'HeroFloatingCards', 'HeroCountdownLaunch', 'HeroEventConference', 'HeroBrutalistRaw',
        'HeroVideoBackground', 'HeroInteractiveCodeEditor', 'HeroMinimalistTypography', 'HeroProductCarousel', 'HeroIsometricIllustration',
        'EstateFullBleedParallaxHero', 'EstateHeroEditorial', 'HeroImmersiveVideo'
      ],
      defaultExpanded: false,
    },
    features: {
      title: 'Features & Bento-Grid (22 Presets)',
      components: [
        'BentoGrid', 'BentoAsymmetric4', 'BentoMetrics6', 'FeatureListSplit', 'FeatureGridCards',
        'FeatureComparisonTable', 'FeatureStepProcess', 'FeatureInteractiveTabs', 'StatsCounterGrid', 'StatsSplitChart',
        'FeatureIconRows', 'FeatureHoverCards', 'FeatureTimeline', 'FeatureTechStackGrid', 'FeatureBentoDarkVoid',
        'BentoFeatureHighlight3', 'FeatureComparisonGrid', 'FeatureInteractiveHoverGrid', 'FeatureTerminalSnippet', 'FeatureWorkflowPipeline',
        'EstateSpecsDetail', 'EstateArchitecturalTimeline'
      ],
      defaultExpanded: false,
    },
    showcases: {
      title: 'Portfolio & Showcase (23 Presets)',
      components: [
        'PortfolioShowcase', 'PortfolioMasonryGrid', 'PortfolioClientCarousel', 'PortfolioAppStoreScreens',
        'ClientLogosMarquee', 'ClientLogosGrid', 'CaseStudyDetailCard', 'PortfolioFilterTabs',
        'PortfolioBeforeAfter', 'PortfolioVideoGrid', 'PortfolioAwardBadges', 'PortfolioClientQuotes',
        'PortfolioInteractiveGrid', 'Portfolio3DTiltCard', 'PortfolioMetricsShowcase', 'PortfolioLogoWallDark',
        'PortfolioBeforeAfterSlider', 'PortfolioFullBleedBanner', 'PortfolioTestimonialCard', 'PortfolioHorizontalScroll',
        'EstateImageRailEditorial', 'EstateGridGallery', 'VideoScrollParallax'
      ],
      defaultExpanded: false,
    },
    socialProof: {
      title: 'Testimonials & FAQ (21 Presets)',
      components: [
        'Testimonials', 'TestimonialGrid3', 'TestimonialSingleHero', 'TestimonialVideoCards', 'TestimonialTwitterCards',
        'FaqAccordion', 'FaqGrid2Column', 'FaqSearchable', 'FaqCategoryTabs', 'TrustSecurityBadges',
        'CommunityDiscordCard', 'WallOfLove',
        'TestimonialCarousel3D', 'TestimonialQuoteMinimal', 'TestimonialCompanyGrid', 'FaqTabbedAccordion',
        'FaqInteractiveSearch', 'FaqCardGrid3Column', 'CommunityStatsBox', 'TrustCertificatesBadge',
        'EstatePhilosophyQuote'
      ],
      defaultExpanded: false,
    },
    pricing: {
      title: 'Pricing & CTA-Section (21 Presets)',
      components: [
        'PricingTable', 'Pricing3TierToggle', 'PricingComparisonMatrix', 'PricingUsageBased', 'PricingSinglePlan',
        'CtaBanner', 'CtaSplitForm', 'CtaAppDownload', 'CtaUrgencyTimer', 'CtaGlassCard',
        'CtaNewsletterPill', 'CtaFullWidthVideo', 'CtaBookDemoCalendar', 'CtaFreeTrialCard', 'CtaDarkCyberpunk',
        'PricingSliderTier', 'PricingEnterpriseCustom', 'CtaInteractiveNewsletter', 'CtaFullWidthGradient', 'CtaFloatingBar',
        'EstateInquiryForm'
      ],
      defaultExpanded: false,
    },
    footers: {
      title: 'Footer-Section (20 Presets)',
      components: [
        'Footer', 'FooterMinimalRail', 'FooterNewsletterBig', 'FooterCyberpunkMono', 'FooterAppStoreLinks',
        'FooterLuxurySerif', 'FooterMegaSiteMap', 'FooterSocialIconsOnly', 'FooterGradientBorder', 'FooterBrutalistBox',
        'FooterCenteredBrand',
        'FooterMinimalInline', 'FooterMultiColumnMap', 'FooterCyberpunkTerminal', 'FooterNewsletterInline',
        'FooterBadgeRow', 'FooterMinimalCentered', 'FooterDarkGrid', 'FooterFloatingPill', 'FooterCompactBar'
      ],
      defaultExpanded: false,
    },
    containers: {
      title: 'Layout Containers (DropZones) (3 Presets)',
      components: ['FlexSection', 'GridColumns', 'CardBox'],
      defaultExpanded: false,
    },
    atomic: {
      title: 'Basic UI Elements (16 Presets)',
      components: ['Heading', 'Text', 'Button', 'Image', 'PillBadge', 'BadgePillDot', 'GradientCardWrapper', 'AvatarGroupStack', 'RatingStarsBar', 'Spacer', 'Divider', 'DividerGradient', 'StatBadgePill', 'ImageLightboxFrame', 'VideoPlayerEmbed', 'CodeBlockTerminal'],
      defaultExpanded: false,
    },
  },

  components: {
    // 1. NAVBARS (15 PRESETS)
    Navbar: {
      fields: {
        brandName: { type: 'text' },
        link1Text: { type: 'text' }, link1Url: { type: 'text' },
        link2Text: { type: 'text' }, link2Url: { type: 'text' },
        link3Text: { type: 'text' }, link3Url: { type: 'text' },
        link4Text: { type: 'text' }, link4Url: { type: 'text' },
        link5Text: { type: 'text' }, link5Url: { type: 'text' },
        ctaText: { type: 'text' }, ctaUrl: { type: 'text' },
        fixedTop: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
        customClass: { type: 'text' }, customCss: { type: 'textarea' }
      },
      defaultProps: {
        brandName: 'NEXTFLOW.',
        link1Text: 'Home', link1Url: '/',
        link2Text: 'About', link2Url: '/about',
        link3Text: 'Services', link3Url: '/services',
        link4Text: 'Pricing', link4Url: '/pricing',
        link5Text: 'Contact', link5Url: '/contact',
        ctaText: 'Sign In', ctaUrl: '/pricing',
        fixedTop: false, customClass: '', customCss: ''
      },
      render: ({ brandName, link1Text, link1Url, link2Text, link2Url, link3Text, link3Url, link4Text, link4Url, link5Text, link5Url, ctaText, ctaUrl, fixedTop, customClass, customCss }) => (
        <header className={`px-4 sm:px-8 py-4 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between font-sans text-white ${fixedTop ? 'sticky top-0 z-40' : ''} ${customClass}`} style={parseCustomCss(customCss)}>
          <div className="text-base font-black tracking-tight text-white flex items-center gap-1">{brandName}<span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /></div>
          <nav className="hidden md:flex gap-8 text-xs text-slate-300 font-semibold">
            {link1Text && <a href={link1Url || '/'} className="hover:text-cyan-400">{link1Text}</a>}
            {link2Text && <a href={link2Url || '/about'} className="hover:text-cyan-400">{link2Text}</a>}
            {link3Text && <a href={link3Url || '/services'} className="hover:text-cyan-400">{link3Text}</a>}
            {link4Text && <a href={link4Url || '/pricing'} className="hover:text-cyan-400">{link4Text}</a>}
            {link5Text && <a href={link5Url || '/contact'} className="hover:text-cyan-400">{link5Text}</a>}
          </nav>
          <a href={ctaUrl || '/pricing'} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs shadow-md">{ctaText}</a>
        </header>
      )
    },
    NavbarMinimal: {
      fields: { brandName: { type: 'text' }, linkText: { type: 'text' }, linkUrl: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' }, fixedTop: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] } },
      defaultProps: { brandName: 'AETHER', linkText: 'Overview', linkUrl: '/about', ctaText: 'Get Access', ctaUrl: '/pricing', fixedTop: false },
      render: ({ brandName, linkText, linkUrl, ctaText, ctaUrl, fixedTop }) => (
        <header className={`px-4 sm:px-6 py-3.5 bg-[#050608] border-b border-white/10 flex items-center justify-between font-sans text-white ${fixedTop ? 'sticky top-0 z-40' : ''}`}>
          <div className="font-extrabold tracking-widest text-xs uppercase text-slate-300">{brandName}</div>
          <div className="flex items-center gap-6">
            <a href={linkUrl || '/about'} className="text-xs text-slate-400">{linkText}</a>
            <a href={ctaUrl || '/pricing'} className="text-xs font-bold text-cyan-400">{ctaText}</a>
          </div>
        </header>
      )
    },
    NavbarCentred: {
      fields: { brandName: { type: 'text' }, link1: { type: 'text' }, link1Url: { type: 'text' }, link2: { type: 'text' }, link2Url: { type: 'text' }, link3: { type: 'text' }, link3Url: { type: 'text' }, link4: { type: 'text' }, link4Url: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { brandName: 'N E X U S', link1: 'Products', link1Url: '/', link2: 'Solutions', link2Url: '/services', link3: 'Docs', link3Url: '/about', link4: 'Company', link4Url: '/contact', ctaText: 'Launch App', ctaUrl: '/pricing' },
      render: ({ brandName, link1, link1Url, link2, link2Url, link3, link3Url, link4, link4Url, ctaText, ctaUrl }) => (
        <header className="px-4 sm:px-8 py-4 bg-[#0f111a]/80 backdrop-blur-2xl border-b border-white/10 font-sans text-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <nav className="hidden sm:flex gap-6 text-xs text-slate-300">
              <a href={link1Url || '/'}>{link1}</a>
              <a href={link2Url || '/services'}>{link2}</a>
            </nav>
            <div className="text-sm font-black tracking-[0.25em] text-white uppercase">{brandName}</div>
            <div className="flex items-center gap-6 text-xs">
              <a href={link3Url || '/about'} className="hidden sm:inline text-slate-300">{link3}</a>
              <a href={ctaUrl || '/pricing'} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold">{ctaText}</a>
            </div>
          </div>
        </header>
      )
    },
    NavbarFloatingPill: {
      fields: { brandName: { type: 'text' }, link1: { type: 'text' }, link1Url: { type: 'text' }, link2: { type: 'text' }, link2Url: { type: 'text' }, link3: { type: 'text' }, link3Url: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' }, pillGlow: { type: 'radio', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] } },
      defaultProps: { brandName: 'PULSE.', link1: 'Features', link1Url: '/', link2: 'Services', link2Url: '/services', link3: 'Pricing', link3Url: '/pricing', ctaText: 'Try Free', ctaUrl: '/contact', pillGlow: true },
      render: ({ brandName, link1, link1Url, link2, link2Url, link3, link3Url, ctaText, ctaUrl, pillGlow }) => (
        <div className="py-4 px-4 bg-transparent">
          <header className={`max-w-4xl mx-auto px-6 py-3 rounded-full bg-[#0f111a]/90 backdrop-blur-2xl flex items-center justify-between font-sans text-white ${pillGlow ? 'border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border border-white/15'}`}>
            <div className="text-sm font-black text-white">{brandName}</div>
            <nav className="hidden sm:flex gap-6 text-xs text-slate-300">
              <a href={link1Url || '/'}>{link1}</a>
              <a href={link2Url || '/services'}>{link2}</a>
              <a href={link3Url || '/pricing'}>{link3}</a>
            </nav>
            <a href={ctaUrl || '/contact'} className="px-5 py-2 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs">{ctaText}</a>
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
          <nav className="hidden sm:flex gap-8 text-xs text-slate-300 font-medium"><Link href="/">Architecture</Link><a href="/services">Ecosystem</a><a href="/pricing">Pricing</a></nav>
          <a href="/contact" className="px-5 py-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">{ctaText}</a>
        </header>
      )
    },
    NavbarGradientBorder: {
      fields: { brandName: { type: 'text' }, gradientPreset: { type: 'select', options: [{ label: 'Cyan-Blue', value: 'cyan-blue' }, { label: 'Purple-Cyan', value: 'purple-cyan' }] }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'STREAMLINE.', gradientPreset: 'cyan-blue', ctaText: 'Get Started' },
      render: ({ brandName, ctaText }) => (
        <header className="bg-[#090a0f] font-sans text-white relative">
          <div className="px-8 py-4 flex items-center justify-between"><div className="text-base font-black text-white">{brandName}</div><nav className="hidden sm:flex gap-8 text-xs text-slate-300 font-semibold"><Link href="/">Overview</Link><a href="/services">Specs</a><a href="/about">Docs</a></nav><a href="/pricing" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs">{ctaText}</a></div>
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
      fields: {
        brandName: { type: 'text' }, searchPlaceholder: { type: 'text' }, cartCount: { type: 'text' }, ctaText: { type: 'text' },
        link1Text: { type: 'text' }, link1Url: { type: 'text' },
        link2Text: { type: 'text' }, link2Url: { type: 'text' },
        link3Text: { type: 'text' }, link3Url: { type: 'text' }
      },
      defaultProps: {
        brandName: 'NOVA MARKET', searchPlaceholder: 'Search curated goods...', cartCount: '3', ctaText: 'Cart',
        link1Text: 'Shop', link1Url: '/shop',
        link2Text: 'Collections', link2Url: '/collections',
        link3Text: 'About', link3Url: '/about'
      },
      render: ({ brandName, searchPlaceholder, cartCount, ctaText, link1Text, link1Url, link2Text, link2Url, link3Text, link3Url }) => (
        <header className="sticky top-0 z-50 px-6 py-3.5 bg-[#0d0f19]/95 backdrop-blur-md border-b border-white/10 font-sans text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-8">
            <a href="/" className="font-black text-lg tracking-widest text-white hover:text-cyan-400 transition-colors uppercase">{brandName}</a>
            <nav className="hidden md:flex items-center gap-6">
              <a href={link1Url || '/shop'} className="text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors">{link1Text}</a>
              <a href={link2Url || '/collections'} className="text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors">{link2Text}</a>
              <a href={link3Url || '/about'} className="text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors">{link3Text}</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-52 hidden lg:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <input type="text" placeholder={searchPlaceholder} className="w-full pl-8 pr-3 py-1.5 bg-[#090a0f] border border-white/10 rounded-none text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors"/>
            </div>
            <button className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors" aria-label="Search"><Search size={16}/></button>
            <a href="/cart" className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-none border border-white/10 text-slate-300 hover:bg-white/10 transition-colors">
              <ShoppingBag size={14}/>
              <span className="text-[11px] font-bold uppercase hidden sm:inline">{ctaText}</span>
              <span className="px-1.5 py-0.5 rounded-none bg-cyan-400 text-[#090a0f] font-black text-[10px] tabular-nums">{cartCount}</span>
            </a>
            <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" aria-label="Menu"><Menu size={18}/></button>
          </div>
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
    NavbarFloatingGlass: {
      fields: {
        brandName: { type: 'text' },
        link1: { type: 'text' }, link1Url: { type: 'text' },
        link2: { type: 'text' }, link2Url: { type: 'text' },
        link3: { type: 'text' }, link3Url: { type: 'text' },
        ctaText: { type: 'text' }, ctaUrl: { type: 'text' }
      },
      defaultProps: {
        brandName: 'AETHER.GLASS',
        link1: 'Features', link1Url: '/services',
        link2: 'Showcase', link2Url: '/about',
        link3: 'Pricing', link3Url: '/pricing',
        ctaText: 'Get Early Access', ctaUrl: '/contact'
      },
      render: ({ brandName, link1, link1Url, link2, link2Url, link3, link3Url, ctaText, ctaUrl }) => (
        <div className="py-4 px-6 bg-[#06070a] font-sans">
          <header className="max-w-5xl mx-auto px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between text-white text-xs shadow-2xl">
            <div className="font-extrabold text-cyan-400 text-sm tracking-wider">{brandName}</div>
            <nav className="hidden md:flex items-center gap-6 text-slate-300 font-medium">
              <a href={link1Url || '/services'} className="hover:text-white transition-colors">{link1}</a>
              <a href={link2Url || '/about'} className="hover:text-white transition-colors">{link2}</a>
              <a href={link3Url || '/pricing'} className="hover:text-white transition-colors">{link3}</a>
            </nav>
            <a href={ctaUrl || '/contact'} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all">{ctaText}</a>
          </header>
        </div>
      )
    },
    NavbarMinimalMonochrome: {
      fields: {
        brandName: { type: 'text' },
        link1: { type: 'text' }, link1Url: { type: 'text' },
        link2: { type: 'text' }, link2Url: { type: 'text' },
        link3: { type: 'text' }, link3Url: { type: 'text' },
        ctaText: { type: 'text' }, ctaUrl: { type: 'text' }
      },
      defaultProps: { brandName: 'STUDIO NOIR', link1: 'Home', link1Url: '/', link2: 'About', link2Url: '/about', link3: 'Services', link3Url: '/services', ctaText: 'Contact', ctaUrl: '/contact' },
      render: ({ brandName, link1, link1Url, link2, link2Url, link3, link3Url, ctaText, ctaUrl }) => (
        <header className="px-8 py-5 bg-white/90 backdrop-blur-xl border-b border-neutral-200 font-serif text-neutral-900 flex justify-between items-center sticky top-0 z-40">
          <Link href="/" className="font-semibold text-base tracking-wide text-neutral-900">{brandName}</Link>
          <nav className="flex items-center gap-10 font-sans uppercase tracking-[0.18em] text-[11px] text-neutral-500">
            <a href={link1Url || '/'} className="hover:text-neutral-900 transition-colors">{link1}</a>
            <a href={link2Url || '/about'} className="hover:text-neutral-900 transition-colors">{link2}</a>
            <a href={link3Url || '/services'} className="hover:text-neutral-900 transition-colors">{link3}</a>
            <a href={ctaUrl || '/contact'} className="text-neutral-900 border-b border-neutral-900 pb-0.5 hover:border-cyan-600 hover:text-cyan-700 transition-colors">{ctaText}</a>
          </nav>
        </header>
      )
    },
    NavbarGradientSubtle: {
      fields: { brandName: { type: 'text' }, tagText: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { brandName: 'LUMINA', tagText: 'v2.4 PRO', ctaText: 'Launch Studio', ctaUrl: '/pricing' },
      render: ({ brandName, tagText, ctaText, ctaUrl }) => (
        <header className="px-6 py-3 bg-gradient-to-r from-[#0d0e15] via-[#121524] to-[#0d0e15] border-b border-cyan-500/20 font-sans text-white flex justify-between items-center text-xs">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-sm">{brandName}</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">{tagText}</span>
          </div>
          <a href={ctaUrl || '/pricing'} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold">{ctaText}</a>
        </header>
      )
    },
    NavbarCompactSearch: {
      fields: { brandName: { type: 'text' }, searchPlaceholder: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { brandName: 'VAULT ENGINE', searchPlaceholder: 'Search components...', ctaText: 'Sign In', ctaUrl: '/login' },
      render: ({ brandName, searchPlaceholder, ctaText, ctaUrl }) => (
        <header className="px-6 py-3 bg-[#0a0c14] border-b border-white/10 font-sans text-white flex justify-between items-center text-xs">
          <div className="flex items-center gap-6">
            <span className="font-black text-cyan-400">{brandName}</span>
            <div className="relative w-56 hidden sm:block">
              <input type="text" readOnly placeholder={searchPlaceholder} className="w-full px-3 py-1 bg-[#06070a] border border-white/10 rounded-lg text-xs text-slate-400" />
            </div>
          </div>
          <a href={ctaUrl || '/login'} className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white font-bold">{ctaText}</a>
        </header>
      )
    },
    NavbarDrawerMenu: {
      fields: { brandName: { type: 'text' }, menuLabel: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { brandName: 'NEXUS HUB', menuLabel: 'MENU', ctaText: 'Explore System', ctaUrl: '/services' },
      render: ({ brandName, menuLabel, ctaText, ctaUrl }) => (
        <header className="px-8 py-4 bg-[#090a0f] border-b border-white/10 font-sans text-white flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300">☰ {menuLabel}</button>
            <span className="font-black text-sm">{brandName}</span>
          </div>
          <a href={ctaUrl || '/services'} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black">{ctaText}</a>
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
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, imageSrc: { type: 'text' }, primaryCta: { type: 'text' }, primaryUrl: { type: 'text' }, secondaryCta: { type: 'text' }, secondaryUrl: { type: 'text' } },
      defaultProps: { badge: 'HIGH VELOCITY', title: 'Accelerate Development Without Code Debt', description: 'Build enterprise visual pages with clean TypeScript props.', imageSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', primaryCta: 'Start Free Trial', primaryUrl: '/pricing', secondaryCta: 'Documentation', secondaryUrl: '/about' },
      render: ({ badge, title, description, imageSrc, primaryCta, primaryUrl, secondaryCta, secondaryUrl }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-6 uppercase"><Zap size={12}/>{badge}</span><h1 className="text-4xl font-extrabold mb-4">{title}</h1><p className="text-slate-400 text-sm mb-8 leading-relaxed">{description}</p><div className="flex gap-4"><a href={primaryUrl || '/pricing'} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">{primaryCta}</a><a href={secondaryUrl || '/about'} className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/15">{secondaryCta}</a></div></div><div className="rounded-3xl overflow-hidden border border-cyan-500/30"><img src={imageSrc} alt="Hero Split" className="w-full aspect-4/3 object-cover"/></div></div></section>
      )
    },
    HeroCyberpunkGlow: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, subtitle: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' }, terminalLog: { type: 'text' } },
      defaultProps: { badge: '// SYSTEM READY', title: 'AUTONOMOUS WORKFLOW ENGINE', subtitle: 'Execute sub-millisecond database pipelines with Zero-Trust security.', ctaText: '> DEPLOY_SYSTEM', ctaUrl: '/pricing', terminalLog: '$ status: 200 OK | ping: 0.2ms' },
      render: ({ badge, title, subtitle, ctaText, ctaUrl, terminalLog }) => (
        <section className="py-24 px-6 bg-[#050608] border-b border-cyan-500/30 font-mono text-white text-center"><div className="max-w-4xl mx-auto"><span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs mb-6 inline-block">{badge}</span><h1 className="text-4xl font-extrabold text-cyan-400 mb-4">{title}</h1><p className="text-slate-400 text-xs max-w-xl mx-auto mb-8">{subtitle}</p><div className="mb-8 inline-block px-4 py-2 rounded bg-black border border-white/10 text-slate-500 text-xs">{terminalLog}</div><div><a href={ctaUrl || '/pricing'} className="px-8 py-3.5 rounded bg-cyan-500 text-slate-950 font-bold text-xs shadow-[0_0_30px_rgba(6,182,212,0.4)]">{ctaText}</a></div></div></section>
      )
    },
    HeroMinimalSerif: {
      fields: { badge: { type: 'text' }, headline: { type: 'text' }, subheadline: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { badge: 'COLLECTION 2026', headline: 'Purity in Architectural Expression', subheadline: 'Minimalist design systems engineered for discerning editorial creators.', ctaText: 'Discover Monograph', ctaUrl: '/about' },
      render: ({ badge, headline, subheadline, ctaText, ctaUrl }) => (
        <section className="py-28 px-8 bg-[#090a0f] font-serif text-white text-center"><div className="max-w-3xl mx-auto"><span className="text-[10px] font-sans tracking-[0.25em] text-slate-400 uppercase mb-6 block">{badge}</span><h1 className="text-5xl font-normal leading-tight mb-6">{headline}</h1><p className="font-sans text-xs text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">{subheadline}</p><a href={ctaUrl || '/about'} className="font-sans text-xs uppercase tracking-widest text-slate-200 border-b border-white/40 pb-1">{ctaText}</a></div></section>
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
      defaultProps: { badge: 'ACADEMY COURSE', title: 'Building Production Web Apps with Next.js 16', instructor: 'Led by Nextflow Core Engineering Team', rating: '5.0 / 5.0 Rating (1,200+ Students)', ctaText: 'Enroll Now' },
      render: ({ badge, title, instructor, rating, ctaText }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans"><div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between"><div><span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase mb-4 inline-block">{badge}</span><h1 className="text-3xl font-extrabold mb-2">{title}</h1><p className="text-xs text-slate-400 mb-1">{instructor}</p><div className="text-amber-400 text-xs font-bold mb-6">{rating}</div><a href="/pricing" className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block">{ctaText}</a></div><div className="w-64 h-44 rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-center text-cyan-400 font-extrabold text-lg shadow-xl">3D COURSE</div></div></section>
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
    HeroVideoBackground: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' }, secondaryCta: { type: 'text' }, secondaryUrl: { type: 'text' } },
      defaultProps: { badge: 'CINEMATIC EXPERIENCE', title: 'Next-Gen Visual Web Engine', description: 'Experience sub-millisecond dynamic component rendering in real-time.', ctaText: 'Start Free Trial', ctaUrl: '/pricing', secondaryCta: 'Learn More', secondaryUrl: '/about' },
      render: ({ badge, title, description, ctaText, ctaUrl, secondaryCta, secondaryUrl }) => (
        <section className="relative py-32 px-6 bg-[#040508] text-white font-sans text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-black to-[#090a0f] pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest inline-block mb-6">{badge}</span>
            <h1 className="text-5xl font-black mb-6 leading-tight text-white">{title}</h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto mb-10">{description}</p>
            <div className="flex justify-center gap-4">
              <a href={ctaUrl || '/pricing'} className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs shadow-lg">{ctaText}</a>
              <a href={secondaryUrl || '/about'} className="px-8 py-3.5 rounded-2xl bg-white/10 text-white font-bold text-xs border border-white/15">{secondaryCta}</a>
            </div>
          </div>
        </section>
      )
    },
    HeroImmersiveVideo: {
      fields: { badgeText: { type: 'text' }, title: { type: 'text' }, subhead: { type: 'textarea' }, videoUrl: { type: 'text' }, posterUrl: { type: 'text' }, ctaText: { type: 'text' }, secondaryCta: { type: 'text' } },
      defaultProps: {
        badgeText: 'FLAGSHIP CINEMATIC EXPERIENCE',
        title: 'Bespoke Studio Hardware & Modern Goods',
        subhead: 'Precision-engineered acoustic audio, artisan furniture, and minimalist daily essentials crafted for lifetime durability.',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-on-a-table-41617-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80',
        ctaText: 'Explore Flagship Store',
        secondaryCta: 'Watch Studio Film'
      },
      render: ({ badgeText, title, subhead, videoUrl, posterUrl, ctaText, secondaryCta }) => (
        <section className="relative min-h-[100dvh] w-full flex items-center justify-center font-sans text-white overflow-hidden bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl}
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-60 pointer-events-none"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/50 to-black/30 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 py-24 relative z-10 text-center">
            <span className="px-3.5 py-1 bg-white/10 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-white/20 tracking-widest inline-block mb-6 rounded-none">
              {badgeText}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
              {title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {subhead}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/shop" className="px-8 py-4 bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-none hover:bg-slate-200 transition-colors shadow-2xl">
                {ctaText}
              </a>
              <a href="/about" className="px-8 py-4 bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider border border-white/20 rounded-none hover:bg-white/20 transition-colors">
                {secondaryCta}
              </a>
            </div>
          </div>
        </section>
      )
    },
    VideoScrollParallax: {
      fields: { title: { type: 'text' }, caption: { type: 'text' }, videoUrl: { type: 'text' }, posterUrl: { type: 'text' } },
      defaultProps: {
        title: 'Beryllium Driver Acoustic Parallax',
        caption: 'Engineered with sub-micron precision for zero harmonic distortion.',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-on-a-table-41617-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=80'
      },
      render: ({ title, caption, videoUrl, posterUrl }) => (
        <section className="py-20 px-6 font-sans max-w-6xl mx-auto text-left">
          <div className="relative rounded-none overflow-hidden border border-white/10 bg-[#090a0f]">
            <video autoPlay loop muted playsInline poster={posterUrl} className="w-full aspect-video object-cover opacity-80">
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8 sm:p-12">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">[IMMERSIVE VIDEO REEL]</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{title}</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-xl">{caption}</p>
            </div>
          </div>
        </section>
      )
    },
    HeroInteractiveCodeEditor: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, subhead: { type: 'textarea' }, codeSnippet: { type: 'textarea' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { badge: 'DEV FIRST ENGINE', title: 'Code & Visual Studio Unified', subhead: 'Export production-ready TypeScript code directly from your Puck canvas.', codeSnippet: 'import { Puck } from "@puckeditor/core";\n\nexport default function App() {\n  return <Puck config={puckConfig} data={pageData} />;\n}', ctaText: 'Copy Starter Kit', ctaUrl: '/services' },
      render: ({ badge, title, subhead, codeSnippet, ctaText, ctaUrl }) => (
        <section className="py-24 px-6 bg-[#08090e] font-sans text-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-3 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 inline-block">{badge}</span>
              <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">{subhead}</p>
              <a href={ctaUrl || '/services'} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block">{ctaText}</a>
            </div>
            <div className="bg-[#040508] border border-cyan-500/30 rounded-2xl p-4 font-mono text-xs text-cyan-300 shadow-2xl">
              <div className="flex gap-1.5 mb-3"><div className="w-3 h-3 rounded-full bg-rose-500/80"/><div className="w-3 h-3 rounded-full bg-amber-500/80"/><div className="w-3 h-3 rounded-full bg-emerald-500/80"/></div>
              <pre className="overflow-x-auto text-slate-300"><code>{codeSnippet}</code></pre>
            </div>
          </div>
        </section>
      )
    },
    HeroMinimalistTypography: {
      fields: { badge: { type: 'text' }, mainHeading: { type: 'text' }, subhead: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { badge: 'ISSUE 2026', mainHeading: 'CLARITY IN DIGITAL FORM', subhead: 'Purity of typography meets modern web architecture.', ctaText: 'READ MONOGRAPH', ctaUrl: '/about' },
      render: ({ badge, mainHeading, subhead, ctaText, ctaUrl }) => (
        <section className="py-32 px-8 bg-[#090a0f] font-serif text-white text-center border-b border-white/10">
          <div className="max-w-3xl mx-auto">
            <span className="text-[10px] font-sans tracking-[0.3em] text-slate-400 uppercase mb-8 block">{badge}</span>
            <h1 className="text-5xl font-light leading-tight mb-6 tracking-wide">{mainHeading}</h1>
            <p className="font-sans text-xs text-slate-400 max-w-lg mx-auto mb-10 tracking-widest uppercase">{subhead}</p>
            <a href={ctaUrl || '/about'} className="font-sans text-xs uppercase tracking-widest text-slate-200 border-b border-white/50 pb-1 hover:border-white">{ctaText}</a>
          </div>
        </section>
      )
    },
    HeroProductCarousel: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { badge: 'FEATURED CATALOGUE', title: 'Explore Premium Site Presets', description: 'Over 150+ pre-built components designed for SaaS, E-Commerce, and Portfolios.', ctaText: 'Browse Templates', ctaUrl: '/pricing' },
      render: ({ badge, title, description, ctaText, ctaUrl }) => (
        <section className="py-20 px-6 bg-[#0a0c14] text-white font-sans text-center">
          <div className="max-w-4xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 mb-4 inline-block">{badge}</span>
            <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">{description}</p>
            <a href={ctaUrl || '/pricing'} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block">{ctaText}</a>
          </div>
        </section>
      )
    },
    HeroIsometricIllustration: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'textarea' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { badge: 'SYSTEM ARCHITECTURE', title: 'Visual Multi-Page Canvas Engine', description: 'Synchronize page state, routing, and database JSON payload cleanly.', ctaText: 'Deploy Platform', ctaUrl: '/services' },
      render: ({ badge, title, description, ctaText, ctaUrl }) => (
        <section className="py-24 px-6 bg-[#06070a] text-white font-sans border-b border-white/10">
          <div className="max-w-5xl mx-auto text-center">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6 inline-block">{badge}</span>
            <h1 className="text-4xl font-black mb-4">{title}</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">{description}</p>
            <a href={ctaUrl || '/services'} className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold text-xs inline-block">{ctaText}</a>
          </div>
        </section>
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
      defaultProps: { badge: 'ATELIER COMMITMENT', title: 'Crafted for Perfection & Longevity', description: 'Every product in our catalog undergoes rigorous quality testing and comes backed by our lifetime craftsmanship guarantee.', feature1Title: '01. Express Global Logistics', feature1Desc: 'Carbon-neutral international delivery dispatched within 24 hours.', feature2Title: '02. 30-Day In-Home Trial', feature2Desc: 'Experience our goods in your space with hassle-free returns.', feature3Title: '03. 2-Year Full Replacement', feature3Desc: 'Comprehensive manufacturer warranty on all studio electronics.', cardImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80' },
      render: ({ badge, title, description, feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, cardImage }) => (
        <section className="py-20 px-6 bg-[#090a0f] text-white font-sans">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-3.5 py-1 text-[10px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/20 uppercase tracking-widest mb-6 inline-block rounded-none">
                {badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{title}</h2>
              <p className="text-slate-300 text-xs sm:text-sm mb-8 leading-relaxed">{description}</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5"/>
                  <div><strong className="text-sm block text-white">{feature1Title}</strong><span className="text-xs text-slate-400">{feature1Desc}</span></div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5"/>
                  <div><strong className="text-sm block text-white">{feature2Title}</strong><span className="text-xs text-slate-400">{feature2Desc}</span></div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5"/>
                  <div><strong className="text-sm block text-white">{feature3Title}</strong><span className="text-xs text-slate-400">{feature3Desc}</span></div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 font-mono text-left">
                <div className="p-3 bg-white/5 border border-white/10 rounded-none">
                  <span className="text-[10px] text-slate-400 block uppercase">DISPATCH</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">24 Hours</strong>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-none">
                  <span className="text-[10px] text-slate-400 block uppercase">GUARANTEE</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">2 Years</strong>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-none">
                  <span className="text-[10px] text-slate-400 block uppercase">TRIAL</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">30 Days</strong>
                </div>
              </div>
            </div>
            <div className="rounded-none overflow-hidden border border-white/10">
              <img src={cardImage} alt="Feature Cards" className="w-full aspect-4/3 object-cover"/>
            </div>
          </div>
        </section>
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
      defaultProps: { stat1Value: '15+', stat1Label: 'Years Atelier Heritage', stat2Value: '240+', stat2Label: 'Global Villas Built', stat3Value: '12', stat3Label: 'Monograph Awards', stat4Value: '100%', stat4Label: 'Carbon Neutrality' },
      render: ({ stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label, stat4Value, stat4Label }) => (
        <section className="py-24 px-6 bg-[#111111] border-y border-zinc-800 text-[#FBFBFA]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-8 rounded-none bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center transition-colors hover:border-[#C5A880]/50">
              <div className="text-4xl md:text-5xl font-light font-serif text-[#FBFBFA] tracking-tight mb-3">{stat1Value}</div>
              <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-zinc-400 font-medium">{stat1Label}</p>
            </div>
            <div className="p-8 rounded-none bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center transition-colors hover:border-[#C5A880]/50">
              <div className="text-4xl md:text-5xl font-light font-serif text-[#FBFBFA] tracking-tight mb-3">{stat2Value}</div>
              <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-zinc-400 font-medium">{stat2Label}</p>
            </div>
            <div className="p-8 rounded-none bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center transition-colors hover:border-[#C5A880]/50">
              <div className="text-4xl md:text-5xl font-light font-serif text-[#FBFBFA] tracking-tight mb-3">{stat3Value}</div>
              <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-zinc-400 font-medium">{stat3Label}</p>
            </div>
            <div className="p-8 rounded-none bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center transition-colors hover:border-[#C5A880]/50">
              <div className="text-4xl md:text-5xl font-light font-serif text-[#FBFBFA] tracking-tight mb-3">{stat4Value}</div>
              <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-zinc-400 font-medium">{stat4Label}</p>
            </div>
          </div>
        </section>
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
    BentoFeatureHighlight3: {
      fields: { title: { type: 'text' }, card1Title: { type: 'text' }, card1Desc: { type: 'text' }, card2Title: { type: 'text' }, card2Desc: { type: 'text' }, card3Title: { type: 'text' }, card3Desc: { type: 'text' } },
      defaultProps: { title: 'High-Impact Bento Cards', card1Title: '99.99% Reliability', card1Desc: 'Enterprise SLA uptime.', card2Title: 'Sub-Millisecond Sync', card2Desc: 'Fast memory cache.', card3Title: 'Zero Lock-in', card3Desc: 'Clean JSON export.' },
      render: ({ title, card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc }) => (
        <section className="py-20 px-6 bg-[#090a0f] font-sans text-white text-center">
          <div className="max-w-5xl mx-auto mb-10"><h2 className="text-3xl font-black text-white">{title}</h2></div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 to-[#0f111a] border border-cyan-500/30"><h3 className="text-lg font-bold text-cyan-300 mb-2">{card1Title}</h3><p className="text-xs text-slate-400">{card1Desc}</p></div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 to-[#0f111a] border border-purple-500/30"><h3 className="text-lg font-bold text-purple-300 mb-2">{card2Title}</h3><p className="text-xs text-slate-400">{card2Desc}</p></div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-[#0f111a] border border-emerald-500/30"><h3 className="text-lg font-bold text-emerald-300 mb-2">{card3Title}</h3><p className="text-xs text-slate-400">{card3Desc}</p></div>
          </div>
        </section>
      )
    },
    FeatureComparisonGrid: {
      fields: { title: { type: 'text' }, col1Name: { type: 'text' }, col2Name: { type: 'text' }, row1: { type: 'text' }, row2: { type: 'text' }, row3: { type: 'text' } },
      defaultProps: { title: 'Villa Structural Comparison', col1Name: 'Monograph Alpine Villa', col2Name: 'Coastal Glass Pavilion', row1: 'Triple-Glazed Acoustic Glass Panels', row2: 'Zero-Carbon Solar Roof Integration', row3: 'Private Waterfront / Helipad Dock' },
      render: ({ title, col1Name, col2Name, row1, row2, row3 }) => (
        <section className="py-24 px-6 bg-[#111111] text-[#FBFBFA]">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-[#FBFBFA]">{title}</h2>
          </div>
          <div className="max-w-3xl mx-auto border border-zinc-800 rounded-none overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-5 bg-zinc-900/60 font-sans font-medium border-b border-zinc-800 text-zinc-400 uppercase tracking-widest text-[11px] items-center">
              <div>SPECIFICATION</div>
              <div className="text-[#C5A880] font-serif tracking-normal text-sm font-semibold">{col1Name}</div>
              <div className="text-zinc-400 font-serif tracking-normal text-sm">{col2Name}</div>
            </div>
            <div className="grid grid-cols-3 p-5 border-b border-zinc-900 text-zinc-300 items-center font-serif text-sm">
              <div>{row1}</div>
              <div className="text-[#C5A880] font-sans text-xs uppercase tracking-wider font-medium">✓ Included</div>
              <div className="text-zinc-500 font-sans text-xs uppercase tracking-wider">— Limited</div>
            </div>
            <div className="grid grid-cols-3 p-5 border-b border-zinc-900 text-zinc-300 items-center font-serif text-sm">
              <div>{row2}</div>
              <div className="text-[#C5A880] font-sans text-xs uppercase tracking-wider font-medium">✓ Included</div>
              <div className="text-zinc-500 font-sans text-xs uppercase tracking-wider">— Complex</div>
            </div>
            <div className="grid grid-cols-3 p-5 text-zinc-300 items-center font-serif text-sm">
              <div>{row3}</div>
              <div className="text-[#C5A880] font-sans text-xs uppercase tracking-wider font-medium">✓ Included</div>
              <div className="text-zinc-500 font-sans text-xs uppercase tracking-wider">Optional</div>
            </div>
          </div>
        </section>
      )
    },
    FeatureInteractiveHoverGrid: {
      fields: { title: { type: 'text' }, item1: { type: 'text' }, item2: { type: 'text' }, item3: { type: 'text' }, item4: { type: 'text' } },
      defaultProps: { title: 'Interactive Capabilities', item1: 'Dynamic Link Interceptor', item2: 'Multi-Page Canvas Re-keying', item3: 'Supabase DDL Migrations', item4: 'ZIP Offline Renderer' },
      render: ({ title, item1, item2, item3, item4 }) => (
        <section className="py-20 px-6 bg-[#080a10] font-sans text-white text-center">
          <div className="max-w-5xl mx-auto"><h2 className="text-3xl font-bold mb-10">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10 hover:border-cyan-500 transition-all text-cyan-300">{item1}</div>
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10 hover:border-sky-500 transition-all text-sky-300">{item2}</div>
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10 hover:border-purple-500 transition-all text-purple-300">{item3}</div>
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-white/10 hover:border-emerald-500 transition-all text-emerald-300">{item4}</div>
          </div></div>
        </section>
      )
    },
    FeatureTerminalSnippet: {
      fields: { title: { type: 'text' }, codeContent: { type: 'textarea' }, description: { type: 'text' } },
      defaultProps: { title: 'CLI Integration', codeContent: '$ npx nextflow init --template=aether\n$ npm run dev\n> Ready on http://localhost:3000', description: 'Deploy your visual template project in under 30 seconds.' },
      render: ({ title, codeContent, description }) => (
        <section className="py-20 px-6 bg-[#050608] font-mono text-white text-center border-y border-cyan-500/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h2>
            <p className="text-xs text-slate-400 mb-6 font-sans">{description}</p>
            <div className="p-4 rounded-xl bg-black border border-white/15 text-left text-xs text-slate-300 overflow-x-auto">
              <pre><code>{codeContent}</code></pre>
            </div>
          </div>
        </section>
      )
    },
    FeatureWorkflowPipeline: {
      fields: { title: { type: 'text' }, step1: { type: 'text' }, step2: { type: 'text' }, step3: { type: 'text' }, step4: { type: 'text' } },
      defaultProps: { title: '4-Step Production Pipeline', step1: '1. Select Preset', step2: '2. Customize Props', step3: '3. Add Pages', step4: '4. Export ZIP' },
      render: ({ title, step1, step2, step3, step4 }) => (
        <section className="py-20 px-6 bg-[#090a0f] font-sans text-white text-center">
          <div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-cyan-500/30 text-cyan-300">{step1}</div>
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-sky-500/30 text-sky-300">{step2}</div>
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-purple-500/30 text-purple-300">{step3}</div>
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-emerald-500/30 text-emerald-300">{step4}</div>
          </div></div>
        </section>
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
      fields: {
        title: { type: 'text' },
        item1Title: { type: 'text' }, item1Category: { type: 'text' }, item1Img: { type: 'text' },
        item2Title: { type: 'text' }, item2Category: { type: 'text' }, item2Img: { type: 'text' },
        item3Title: { type: 'text' }, item3Category: { type: 'text' }, item3Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Visual Material & Hardware Monograph',
        item1Title: 'Anodized Aluminum Chassis', item1Category: 'ACOUSTIC HARDWARE', item1Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
        item2Title: 'Nordic Solid Ash Grain', item2Category: 'ARTISAN FURNITURE', item2Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
        item3Title: 'Italian Lambskin Cushion', item3Category: 'TACTILE CRAFTSMANSHIP', item3Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80'
      },
      render: (props) => {
        const title = props.title || 'Visual Material & Hardware Monograph'
        const items = [
          {
            title: props.item1Title || props.p1Title || 'Anodized Aluminum Chassis',
            category: props.item1Category || 'ACOUSTIC HARDWARE',
            img: props.item1Img || props.p1Img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80'
          },
          {
            title: props.item2Title || props.p2Title || 'Nordic Solid Ash Grain',
            category: props.item2Category || 'ARTISAN FURNITURE',
            img: props.item2Img || props.p2Img || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80'
          },
          {
            title: props.item3Title || props.p3Title || 'Italian Lambskin Cushion',
            category: props.item3Category || 'TACTILE CRAFTSMANSHIP',
            img: props.item3Img || props.p3Img || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80'
          }
        ]
        return (
          <section className="py-20 px-6 bg-[#090a0f] text-white font-sans text-left">
            <div className="max-w-6xl mx-auto space-y-8">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">[MATERIAL MONOGRAPH]</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                  <div key={idx} className="group rounded-none bg-[#0a0b12] border border-white/10 overflow-hidden p-5 space-y-4 hover:border-cyan-500/40 transition-colors">
                    <div className="relative aspect-4/3 overflow-hidden border border-white/10">
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/80 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-none border border-white/20 backdrop-blur-sm">
                        {item.category}
                      </span>
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }
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
    PortfolioInteractiveGrid: {
      fields: { title: { type: 'text' }, p1Name: { type: 'text' }, p1Category: { type: 'text' }, p2Name: { type: 'text' }, p2Category: { type: 'text' } },
      defaultProps: { title: 'Interactive Portfolio Grid', p1Name: 'Fintech Dashboard v4', p1Category: 'Web App', p2Name: 'Cyberpunk E-Commerce', p2Category: 'Storefront' },
      render: ({ title, p1Name, p1Category, p2Name, p2Category }) => (
        <section className="py-20 px-6 bg-[#090a0f] font-sans text-white text-center">
          <div className="max-w-5xl mx-auto mb-8"><h2 className="text-3xl font-black">{title}</h2></div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-8 rounded-3xl bg-[#0f111a] border border-cyan-500/30 hover:border-cyan-400 transition-all"><span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">{p1Category}</span><h3 className="text-xl font-bold">{p1Name}</h3></div>
            <div className="p-8 rounded-3xl bg-[#0f111a] border border-purple-500/30 hover:border-purple-400 transition-all"><span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">{p2Category}</span><h3 className="text-xl font-bold">{p2Name}</h3></div>
          </div>
        </section>
      )
    },
    Portfolio3DTiltCard: {
      fields: { title: { type: 'text' }, cardTitle: { type: 'text' }, cardTag: { type: 'text' }, description: { type: 'textarea' } },
      defaultProps: { title: '3D Card Perspective', cardTitle: 'Aether Holographic Studio', cardTag: 'AR / VR WEB', description: 'Real-time 3D web showcase running WebGL 60FPS.' },
      render: ({ title, cardTitle, cardTag, description }) => (
        <section className="py-20 px-6 bg-[#050608] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-8">{title}</h2>
          <div className="p-10 rounded-3xl bg-gradient-to-br from-[#121524] to-[#08090e] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-left">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-2">{cardTag}</span>
            <h3 className="text-2xl font-black mb-3">{cardTitle}</h3>
            <p className="text-xs text-slate-400">{description}</p>
          </div></div>
        </section>
      )
    },
    PortfolioMetricsShowcase: {
      fields: { title: { type: 'text' }, metric1: { type: 'text' }, label1: { type: 'text' }, metric2: { type: 'text' }, label2: { type: 'text' } },
      defaultProps: { title: 'Showcase Impact Metrics', metric1: '+240%', label1: 'Conversion Increase', metric2: '0.12s', label2: 'Largest Contentful Paint' },
      render: ({ title, metric1, label1, metric2, label2 }) => (
        <section className="py-16 px-6 bg-[#0a0c14] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto"><h2 className="text-2xl font-bold mb-8">{title}</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#06070a] border border-cyan-500/30"><div className="text-4xl font-black text-cyan-400 mb-1">{metric1}</div><div className="text-xs text-slate-400">{label1}</div></div>
            <div className="p-6 rounded-2xl bg-[#06070a] border border-emerald-500/30"><div className="text-4xl font-black text-emerald-400 mb-1">{metric2}</div><div className="text-xs text-slate-400">{label2}</div></div>
          </div></div>
        </section>
      )
    },
    PortfolioLogoWallDark: {
      fields: { title: { type: 'text' }, logo1: { type: 'text' }, logo2: { type: 'text' }, logo3: { type: 'text' }, logo4: { type: 'text' } },
      defaultProps: { title: 'Trusted By Leading Design Studios', logo1: 'AETHER', logo2: 'CYBERPULSE', logo3: 'NEXUS', logo4: 'LUMINA' },
      render: ({ title, logo1, logo2, logo3, logo4 }) => (
        <section className="py-16 px-6 bg-[#050608] font-sans text-white text-center border-y border-white/10">
          <div className="max-w-5xl mx-auto"><span className="text-xs text-slate-400 uppercase tracking-widest block mb-8">{title}</span>
          <div className="flex flex-wrap justify-center gap-12 font-black text-lg text-slate-400"><span>{logo1}</span><span>{logo2}</span><span>{logo3}</span><span>{logo4}</span></div></div>
        </section>
      )
    },
    PortfolioBeforeAfterSlider: {
      fields: { title: { type: 'text' }, beforeLabel: { type: 'text' }, afterLabel: { type: 'text' } },
      defaultProps: { title: 'Visual Redesign Comparison', beforeLabel: 'Legacy Wordpress Layout', afterLabel: 'Nextflow Studio Awwwards Preset' },
      render: ({ title, beforeLabel, afterLabel }) => (
        <section className="py-20 px-6 bg-[#090a0f] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-8">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-300 font-bold text-xs">{beforeLabel}</div>
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs">{afterLabel}</div>
          </div></div>
        </section>
      )
    },
    PortfolioFullBleedBanner: {
      fields: { title: { type: 'text' }, subtitle: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { title: 'Transform Your Digital Presense Today', subtitle: 'Ship 10x faster with production-ready Nextflow templates.', ctaText: 'Explore Template Collection', ctaUrl: '/pricing' },
      render: ({ title, subtitle, ctaText, ctaUrl }) => (
        <section className="py-24 px-8 bg-gradient-to-r from-cyan-950 via-[#090a0f] to-blue-950 font-sans text-white text-center border-y border-cyan-500/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-4">{title}</h2>
            <p className="text-slate-300 text-sm mb-8">{subtitle}</p>
            <a href={ctaUrl || '/pricing'} className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs inline-block">{ctaText}</a>
          </div>
        </section>
      )
    },
    PortfolioTestimonialCard: {
      fields: { title: { type: 'text' }, quote: { type: 'textarea' }, clientName: { type: 'text' }, clientRole: { type: 'text' } },
      defaultProps: { title: 'Featured Review', quote: '"The multi-page routing and zip export system in Nextflow Studio completely changed our project delivery workflow."', clientName: 'Sarah Jenkins', clientRole: 'Head of Product, Lumina' },
      render: ({ title, quote, clientName, clientRole }) => (
        <section className="py-20 px-6 bg-[#08090e] font-sans text-white text-center">
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#0f111a] border border-white/10">
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-4">{title}</span>
            <p className="text-base italic text-slate-200 mb-6 leading-relaxed">{quote}</p>
            <div className="text-xs font-bold text-white">{clientName}</div>
            <div className="text-[10px] text-slate-400">{clientRole}</div>
          </div>
        </section>
      )
    },
    PortfolioHorizontalScroll: {
      fields: { title: { type: 'text' }, item1: { type: 'text' }, item2: { type: 'text' }, item3: { type: 'text' } },
      defaultProps: { title: 'Horizontal Work Rail', item1: 'Project 01: Cyberpunk Dashboard', item2: 'Project 02: Luxury Monograph', item3: 'Project 03: E-Commerce Storefront' },
      render: ({ title, item1, item2, item3 }) => (
        <section className="py-20 px-6 bg-[#06070a] font-sans text-white text-center">
          <div className="max-w-5xl mx-auto"><h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 text-left">
            <div className="min-w-[300px] p-6 rounded-2xl bg-[#0f111a] border border-cyan-500/30 font-bold text-xs text-cyan-300">{item1}</div>
            <div className="min-w-[300px] p-6 rounded-2xl bg-[#0f111a] border border-purple-500/30 font-bold text-xs text-purple-300">{item2}</div>
            <div className="min-w-[300px] p-6 rounded-2xl bg-[#0f111a] border border-emerald-500/30 font-bold text-xs text-emerald-300">{item3}</div>
          </div></div>
        </section>
      )
    },

    // LUXURY ESTATE & ARCHITECTURAL ATELIER COMPONENTS
    EstateHeroEditorial: {
      fields: {
        location: { type: 'text' },
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        price: { type: 'text' },
        specs: { type: 'text' },
        heroImg: { type: 'text' },
        ctaText: { type: 'text' },
        ctaUrl: { type: 'text' },
        secText: { type: 'text' },
        secUrl: { type: 'text' }
      },
      defaultProps: {
        location: 'LAKE COMO, ITALY',
        title: 'Villa Aura Glass Sanctuary',
        subtitle: 'A masterpiece of contemporary architectural design, seamlessly integrating raw travertine stone, floor-to-ceiling panoramic glass, and private alpine waterfront vistas.',
        price: '€14,500,000',
        specs: '6 BEDS • 7 BATHS • 12,400 SQ FT • PRIVATE DOCK',
        heroImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80',
        ctaText: 'Inquire Private Brief',
        ctaUrl: '/contact',
        secText: 'View Architectural Specs',
        secUrl: '/services'
      },
      render: ({ location, title, subtitle, price, specs, heroImg, ctaText, ctaUrl, secText, secUrl }) => (
        <section className="py-20 px-8 bg-[#FBFBFA] text-[#111111] font-serif border-b border-[#eaeaea]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#9B805E]">{location}</span>
                <span className="h-[1px] w-8 bg-[#C5A880]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-normal leading-[1.15] text-[#111111] tracking-tight">{title}</h1>
              <p className="font-sans text-xs text-[#787774] leading-relaxed font-light">{subtitle}</p>
              <div className="pt-2 border-t border-[#eaeaea]">
                <div className="text-2xl font-serif font-normal text-[#111111] mb-1">{price}</div>
                <div className="font-sans text-[10px] font-mono tracking-wider uppercase text-[#787774]">{specs}</div>
              </div>
              <div className="pt-4 flex flex-wrap items-center gap-4 font-sans text-xs font-medium">
                <a href={ctaUrl || '/contact'} className="px-6 py-3 bg-[#111111] text-[#FBFBFA] hover:bg-[#333333] transition-all rounded-none uppercase tracking-widest text-[10px]">{ctaText}</a>
                <a href={secUrl || '/services'} className="px-6 py-3 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-all rounded-none uppercase tracking-widest text-[10px]">{secText}</a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="relative border border-[#eaeaea] p-2 bg-white">
                <img src={heroImg} alt={title} className="w-full aspect-[4/3] object-cover filter contrast-[1.02]" />
              </div>
            </div>
          </div>
        </section>
      )
    },
    EstateGridGallery: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        e1Title: { type: 'text' }, e1Loc: { type: 'text' }, e1Price: { type: 'text' }, e1Img: { type: 'text' },
        e2Title: { type: 'text' }, e2Loc: { type: 'text' }, e2Price: { type: 'text' }, e2Img: { type: 'text' },
        e3Title: { type: 'text' }, e3Loc: { type: 'text' }, e3Price: { type: 'text' }, e3Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Featured Private Estates Collection',
        subtitle: 'Curated architectural residences crafted by Lumina Atelier.',
        e1Title: 'Obsidian Alpine Pavilion', e1Loc: 'ASPEN, COLORADO', e1Price: '$18,500,000', e1Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
        e2Title: 'Kyoto Zen Sanctuary', e2Loc: 'KYOTO, JAPAN', e2Price: '$12,000,000', e2Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
        e3Title: 'Bel Air Horizon Residence', e3Loc: 'LOS ANGELES, CA', e3Price: '$24,000,000', e3Img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&auto=format&fit=crop&q=80'
      },
      render: ({ title, subtitle, e1Title, e1Loc, e1Price, e1Img, e2Title, e2Loc, e2Price, e2Img, e3Title, e3Loc, e3Price, e3Img }) => (
        <section className="py-24 px-8 bg-[#ffffff] text-[#111111] font-serif border-b border-[#eaeaea]">
          <div className="max-w-6xl mx-auto text-left mb-16">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#9B805E] block mb-2">CURATED LISTINGS</span>
            <h2 className="text-3xl font-normal text-[#111111] mb-2">{title}</h2>
            <p className="font-sans text-xs text-[#787774] font-light">{subtitle}</p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FBFBFA] border border-[#eaeaea] p-4 text-left hover:border-[#111111] transition-all">
              <img src={e1Img} alt={e1Title} className="w-full aspect-[3/2] object-cover mb-4" />
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{e1Loc}</span>
              <h3 className="text-xl font-normal text-[#111111] mb-2">{e1Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3 mt-3">{e1Price}</div>
            </div>
            <div className="bg-[#FBFBFA] border border-[#eaeaea] p-4 text-left hover:border-[#111111] transition-all">
              <img src={e2Img} alt={e2Title} className="w-full aspect-[3/2] object-cover mb-4" />
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{e2Loc}</span>
              <h3 className="text-xl font-normal text-[#111111] mb-2">{e2Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3 mt-3">{e2Price}</div>
            </div>
            <div className="bg-[#FBFBFA] border border-[#eaeaea] p-4 text-left hover:border-[#111111] transition-all">
              <img src={e3Img} alt={e3Title} className="w-full aspect-[3/2] object-cover mb-4" />
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{e3Loc}</span>
              <h3 className="text-xl font-normal text-[#111111] mb-2">{e3Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3 mt-3">{e3Price}</div>
            </div>
          </div>
        </section>
      )
    },
    EstateSpecsDetail: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        spec1Title: { type: 'text' }, spec1Desc: { type: 'text' },
        spec2Title: { type: 'text' }, spec2Desc: { type: 'text' },
        spec3Title: { type: 'text' }, spec3Desc: { type: 'text' },
        spec4Title: { type: 'text' }, spec4Desc: { type: 'text' }
      },
      defaultProps: {
        title: 'Architectural Materiality & Engineering',
        subtitle: 'Uncompromising structural precision engineered for generations.',
        spec1Title: 'Natural Italian Travertine', spec1Desc: 'Hand-selected Roman travertine stone slabs with precision thermal isolation.',
        spec2Title: 'Triple-Glazed Panoramic Glass', spec2Desc: 'Floor-to-ceiling UV-protected acoustic glass panels with invisible framing.',
        spec3Title: 'Zero-Carbon Solar Envelope', spec3Desc: 'Integrated photovoltaic roof tiles generating 100% clean off-grid power.',
        spec4Title: 'Smart Atelier Automation', spec4Desc: 'Sub-millisecond climate, security, and ambient light automation engine.'
      },
      render: ({ title, subtitle, spec1Title, spec1Desc, spec2Title, spec2Desc, spec3Title, spec3Desc, spec4Title, spec4Desc }) => (
        <section className="py-24 px-8 bg-[#FBFBFA] text-[#111111] font-serif border-b border-[#eaeaea]">
          <div className="max-w-6xl mx-auto text-left mb-16">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#9B805E] block mb-2">MATERIAL SPECIFICATIONS</span>
            <h2 className="text-3xl font-normal text-[#111111] mb-2">{title}</h2>
            <p className="font-sans text-xs text-[#787774] font-light">{subtitle}</p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-white border border-[#eaeaea]"><strong className="text-sm font-normal text-[#111111] block mb-2">{spec1Title}</strong><p className="font-sans text-xs text-[#787774] leading-relaxed font-light">{spec1Desc}</p></div>
            <div className="p-6 bg-white border border-[#eaeaea]"><strong className="text-sm font-normal text-[#111111] block mb-2">{spec2Title}</strong><p className="font-sans text-xs text-[#787774] leading-relaxed font-light">{spec2Desc}</p></div>
            <div className="p-6 bg-white border border-[#eaeaea]"><strong className="text-sm font-normal text-[#111111] block mb-2">{spec3Title}</strong><p className="font-sans text-xs text-[#787774] leading-relaxed font-light">{spec3Desc}</p></div>
            <div className="p-6 bg-white border border-[#eaeaea]"><strong className="text-sm font-normal text-[#111111] block mb-2">{spec4Title}</strong><p className="font-sans text-xs text-[#787774] leading-relaxed font-light">{spec4Desc}</p></div>
          </div>
        </section>
      )
    },
    EstateInquiryForm: {
      fields: {
        title: { type: 'text' },
        subhead: { type: 'textarea' },
        buttonText: { type: 'text' },
        placeholder: { type: 'text' }
      },
      defaultProps: {
        title: 'Inquire for Private Estate Commissions',
        subhead: 'Our principal architects review incoming private commission briefs weekly. Confidentiality assured.',
        buttonText: 'Submit Commission Inquiry',
        placeholder: 'your.name@company.com'
      },
      render: ({ title, subhead, buttonText, placeholder }) => (
        <section className="py-24 px-8 bg-[#111111] text-[#FBFBFA] font-serif text-center">
          <div className="max-w-3xl mx-auto p-12 bg-[#1A1A1A] border border-neutral-800">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#C5A880] block mb-3">CONFIDENTIAL CONSULTATION</span>
            <h2 className="text-3xl font-normal mb-4 text-white">{title}</h2>
            <p className="font-sans text-xs text-neutral-400 mb-8 max-w-xl mx-auto font-light leading-relaxed">{subhead}</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto font-sans text-xs">
              <input type="email" readOnly placeholder={placeholder} className="flex-1 px-4 py-3 bg-[#111111] border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none" />
              <button className="px-6 py-3 bg-[#C5A880] text-[#111111] font-bold uppercase tracking-wider text-[10px] hover:bg-[#b59870] transition-all">{buttonText}</button>
            </div>
          </div>
        </section>
      )
    },
    EstateImageRailEditorial: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        item1Title: { type: 'text' }, item1Loc: { type: 'text' }, item1Price: { type: 'text' }, item1Img: { type: 'text' },
        item2Title: { type: 'text' }, item2Loc: { type: 'text' }, item2Price: { type: 'text' }, item2Img: { type: 'text' },
        item3Title: { type: 'text' }, item3Loc: { type: 'text' }, item3Price: { type: 'text' }, item3Img: { type: 'text' },
        item4Title: { type: 'text' }, item4Loc: { type: 'text' }, item4Price: { type: 'text' }, item4Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Selected Atelier Masterworks',
        subtitle: 'Horizontal architectural photo monograph. Scroll to explore active estate commissions.',
        item1Title: 'Villa Aura Glass Sanctuary', item1Loc: '01 // LAKE COMO, ITALY', item1Price: '€14,500,000', item1Img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        item2Title: 'Obsidian Alpine Pavilion', item2Loc: '02 // ASPEN, COLORADO', item2Price: '$18,500,000', item2Img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
        item3Title: 'Kyoto Zen Sanctuary', item3Loc: '03 // KYOTO, JAPAN', item3Price: '$12,000,000', item3Img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
        item4Title: 'Bel Air Horizon Residence', item4Loc: '04 // LOS ANGELES, CA', item4Price: '$24,000,000', item4Img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80'
      },
      render: ({ title, subtitle, item1Title, item1Loc, item1Price, item1Img, item2Title, item2Loc, item2Price, item2Img, item3Title, item3Loc, item3Price, item3Img, item4Title, item4Loc, item4Price, item4Img }) => (
        <section className="py-24 px-8 bg-[#FBFBFA] text-[#111111] font-serif border-b border-[#eaeaea] overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 text-left">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#9B805E] block mb-2">MONOGRAPH COLLECTION</span>
              <h2 className="text-3xl font-normal text-[#111111]">{title}</h2>
              <p className="font-sans text-xs text-[#787774] font-light mt-1">{subtitle}</p>
            </div>
            <div className="font-sans text-[10px] font-mono tracking-widest text-[#9B805E] uppercase flex items-center gap-2">
              <span>SCROLL HORIZONTALLY</span> <span className="text-base">→</span>
            </div>
          </div>
          <div className="max-w-6xl mx-auto flex gap-8 overflow-x-auto snap-x pb-6 scrollbar-none text-left">
            <div className="min-w-[340px] md:min-w-[480px] snap-start bg-white border border-[#eaeaea] p-4 transition-all hover:border-[#111111]">
              <div className="relative border border-[#eaeaea] mb-4 bg-[#FBFBFA]">
                <img src={item1Img} alt={item1Title} className="w-full aspect-[16/10] object-cover filter contrast-[1.02]" />
              </div>
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{item1Loc}</span>
              <h3 className="text-2xl font-normal text-[#111111] mb-2">{item1Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3">{item1Price}</div>
            </div>
            <div className="min-w-[340px] md:min-w-[480px] snap-start bg-white border border-[#eaeaea] p-4 transition-all hover:border-[#111111]">
              <div className="relative border border-[#eaeaea] mb-4 bg-[#FBFBFA]">
                <img src={item2Img} alt={item2Title} className="w-full aspect-[16/10] object-cover filter contrast-[1.02]" />
              </div>
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{item2Loc}</span>
              <h3 className="text-2xl font-normal text-[#111111] mb-2">{item2Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3">{item2Price}</div>
            </div>
            <div className="min-w-[340px] md:min-w-[480px] snap-start bg-white border border-[#eaeaea] p-4 transition-all hover:border-[#111111]">
              <div className="relative border border-[#eaeaea] mb-4 bg-[#FBFBFA]">
                <img src={item3Img} alt={item3Title} className="w-full aspect-[16/10] object-cover filter contrast-[1.02]" />
              </div>
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{item3Loc}</span>
              <h3 className="text-2xl font-normal text-[#111111] mb-2">{item3Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3">{item3Price}</div>
            </div>
            <div className="min-w-[340px] md:min-w-[480px] snap-start bg-white border border-[#eaeaea] p-4 transition-all hover:border-[#111111]">
              <div className="relative border border-[#eaeaea] mb-4 bg-[#FBFBFA]">
                <img src={item4Img} alt={item4Title} className="w-full aspect-[16/10] object-cover filter contrast-[1.02]" />
              </div>
              <span className="font-sans text-[9px] font-mono tracking-widest uppercase text-[#9B805E] block mb-1">{item4Loc}</span>
              <h3 className="text-2xl font-normal text-[#111111] mb-2">{item4Title}</h3>
              <div className="font-sans text-xs font-semibold text-[#111111] border-t border-[#eaeaea] pt-3">{item4Price}</div>
            </div>
          </div>
        </section>
      )
    },
    EstateFullBleedParallaxHero: {
      fields: {
        badge: { type: 'text' },
        title: { type: 'text' },
        subtitle: { type: 'text' },
        location: { type: 'text' },
        price: { type: 'text' },
        bgImg: { type: 'text' },
        ctaText: { type: 'text' }, ctaUrl: { type: 'text' },
        secText: { type: 'text' }, secUrl: { type: 'text' }
      },
      defaultProps: {
        badge: 'LUMINA ARCHITECTURAL ATELIER • MONOGRAPH 2026',
        title: 'THE ART OF STRUCTURAL PERMANENCE',
        subtitle: 'Bespoke residential sanctuaries integrating natural Roman travertine, zero-carbon solar roofs, and panoramic alpine glass.',
        location: 'LAKE COMO • ASPEN • KYOTO • BEL AIR',
        price: 'PRIVATE COMMISSIONS FROM $12.5M',
        bgImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80',
        ctaText: 'INQUIRE PRIVATE BRIEF', ctaUrl: '/contact',
        secText: 'EXPLORE MONOGRAPH', secUrl: '/services'
      },
      render: ({ badge, title, subtitle, location, price, bgImg, ctaText, ctaUrl, secText, secUrl }) => (
        <section className="relative min-h-[85vh] flex items-center justify-center py-28 px-8 text-center text-white font-serif overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={bgImg} alt={title} className="w-full h-full object-cover filter brightness-75 contrast-[1.05]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-black/60" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#C5A880] mb-4 bg-black/40 px-4 py-1.5 border border-[#C5A880]/30 backdrop-blur-md">{badge}</span>
            <h1 className="text-4xl md:text-6xl font-normal leading-tight text-white mb-6 tracking-wide drop-shadow-lg">{title}</h1>
            <p className="font-sans text-xs md:text-sm text-neutral-300 max-w-2xl font-light leading-relaxed mb-8">{subtitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs font-mono tracking-widest text-[#C5A880] uppercase mb-10 bg-black/50 p-3 border border-white/10">
              <span>📍 {location}</span>
              <span>•</span>
              <span>💎 {price}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 font-sans text-xs">
              <a href={ctaUrl} className="px-8 py-3.5 bg-[#C5A880] text-[#111111] font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl">{ctaText}</a>
              <a href={secUrl} className="px-8 py-3.5 bg-black/60 text-white font-bold uppercase tracking-widest text-[10px] border border-white/30 hover:bg-white hover:text-black transition-all backdrop-blur-md">{secText}</a>
            </div>
          </div>
        </section>
      )
    },
    EstatePhilosophyQuote: {
      fields: {
        quote: { type: 'textarea' },
        author: { type: 'text' },
        monograph: { type: 'text' },
        bgImg: { type: 'text' }
      },
      defaultProps: {
        quote: '"Architecture is the learned game, correct and magnificent, of forms assembled in the light. Purity is not the absence of detail, but the harmony of essential structure."',
        author: 'LE CORBUSIER / LUMINA MONOGRAPH',
        monograph: 'INTERNATIONAL ARCHITECTURAL ESSAY 2026',
        bgImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80'
      },
      render: ({ quote, author, monograph, bgImg }) => (
        <section className="relative py-32 px-8 text-center text-white font-serif border-y border-[#eaeaea]">
          <div className="absolute inset-0 z-0">
            <img src={bgImg} alt="Philosophy Background" className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1]" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#C5A880] block mb-6">{monograph}</span>
            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed text-neutral-100 mb-8">{quote}</blockquote>
            <div className="font-sans text-xs font-bold uppercase tracking-widest text-white">{author}</div>
          </div>
        </section>
      )
    },
    EstateArchitecturalTimeline: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        step1Title: { type: 'text' }, step1Desc: { type: 'text' },
        step2Title: { type: 'text' }, step2Desc: { type: 'text' },
        step3Title: { type: 'text' }, step3Desc: { type: 'text' },
        step4Title: { type: 'text' }, step4Desc: { type: 'text' }
      },
      defaultProps: {
        title: 'Chronological Execution Monograph',
        subtitle: 'Our 4-phase architectural process from raw land intake to structural commission handover.',
        step1Title: '01. Land & Topography Mapping', step1Desc: 'Sub-centimeter drone LIDAR topography scanning and sun-path light analysis.',
        step2Title: '02. Spatial Proportion & VR', step2Desc: 'Golden-ratio spatial blueprint modeling with 1:1 scale virtual reality walkthroughs.',
        step3Title: '03. Authentic Material Quarrying', step3Desc: 'Direct quarrying of Italian travertine stone and triple-glazed panoramic acoustic glass.',
        step4Title: '04. Off-Grid Solar Envelope', step4Desc: 'Integration of zero-carbon solar roofs, smart automation, and final atelier sign-off.'
      },
      render: ({ title, subtitle, step1Title, step1Desc, step2Title, step2Desc, step3Title, step3Desc, step4Title, step4Desc }) => (
        <section className="py-24 px-8 bg-[#FBFBFA] text-[#111111] font-serif border-b border-[#eaeaea]">
          <div className="max-w-6xl mx-auto text-left">
            <div className="mb-16 max-w-2xl">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#9B805E] block mb-2">COMMISSION PROCESS</span>
              <h2 className="text-3xl font-normal text-[#111111]">{title}</h2>
              <p className="font-sans text-xs text-[#787774] font-light mt-1">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-[#eaeaea]">
                <span className="font-sans text-xs font-mono font-bold text-[#9B805E] block mb-3">PHASE 01</span>
                <h3 className="text-lg font-normal text-[#111111] mb-2">{step1Title}</h3>
                <p className="font-sans text-xs text-[#787774] font-light leading-relaxed">{step1Desc}</p>
              </div>
              <div className="p-6 bg-white border border-[#eaeaea]">
                <span className="font-sans text-xs font-mono font-bold text-[#9B805E] block mb-3">PHASE 02</span>
                <h3 className="text-lg font-normal text-[#111111] mb-2">{step2Title}</h3>
                <p className="font-sans text-xs text-[#787774] font-light leading-relaxed">{step2Desc}</p>
              </div>
              <div className="p-6 bg-white border border-[#eaeaea]">
                <span className="font-sans text-xs font-mono font-bold text-[#9B805E] block mb-3">PHASE 03</span>
                <h3 className="text-lg font-normal text-[#111111] mb-2">{step3Title}</h3>
                <p className="font-sans text-xs text-[#787774] font-light leading-relaxed">{step3Desc}</p>
              </div>
              <div className="p-6 bg-white border border-[#eaeaea]">
                <span className="font-sans text-xs font-mono font-bold text-[#9B805E] block mb-3">PHASE 04</span>
                <h3 className="text-lg font-normal text-[#111111] mb-2">{step4Title}</h3>
                <p className="font-sans text-xs text-[#787774] font-light leading-relaxed">{step4Desc}</p>
              </div>
            </div>
          </div>
        </section>
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
        <section className="py-24 px-6 bg-[#090a0f] text-white font-sans text-center border-y border-white/10"><div className="max-w-4xl mx-auto"><div className="text-cyan-400 font-extrabold tracking-widest text-xs uppercase mb-6">{companyLogo}</div><blockquote className="text-2xl font-bold text-slate-200 mb-8 italic">&ldquo;{quote}&rdquo;</blockquote><div className="font-bold text-sm text-white">{authorName}</div><div className="text-xs text-cyan-400">{authorRole}</div></div></section>
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
    TestimonialCarousel3D: {
      fields: { title: { type: 'text' }, quote1: { type: 'textarea' }, name1: { type: 'text' }, quote2: { type: 'textarea' }, name2: { type: 'text' } },
      defaultProps: { title: '3D Testimonial Perspective', quote1: '"The speed at which we deployed our multi-page marketing site was unmatched."', name1: 'Alex Vance', quote2: '"Puck Studio components allowed us to customize every prop seamlessly."', name2: 'Elena Rostova' },
      render: ({ title, quote1, name1, quote2, name2 }) => (
        <section className="py-20 px-6 bg-[#06070a] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-black mb-8">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-[#0f111a] border border-cyan-500/30"><p className="text-xs text-slate-300 italic mb-4">{quote1}</p><strong className="text-xs text-cyan-400 font-bold">{name1}</strong></div>
            <div className="p-6 rounded-3xl bg-[#0f111a] border border-purple-500/30"><p className="text-xs text-slate-300 italic mb-4">{quote2}</p><strong className="text-xs text-purple-400 font-bold">{name2}</strong></div>
          </div></div>
        </section>
      )
    },
    TestimonialQuoteMinimal: {
      fields: { quote: { type: 'textarea' }, author: { type: 'text' }, role: { type: 'text' } },
      defaultProps: { quote: '"Design systems should feel weightless. Nextflow gives us exact architectural control without code bloat."', author: 'David Kim', role: 'Principal Architect, Cyberpulse' },
      render: ({ quote, author, role }) => (
        <section className="py-20 px-8 bg-[#090a0f] font-serif text-white text-center border-y border-white/10">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl font-light text-slate-200 italic mb-6 leading-relaxed">{quote}</p>
            <div className="font-sans text-xs font-bold uppercase tracking-widest text-cyan-400">{author}</div>
            <div className="font-sans text-[10px] text-slate-500 tracking-wider uppercase">{role}</div>
          </div>
        </section>
      )
    },
    TestimonialCompanyGrid: {
      fields: { title: { type: 'text' }, company1: { type: 'text' }, company2: { type: 'text' }, company3: { type: 'text' } },
      defaultProps: { title: 'Enterprise Clients Endorsement', company1: 'VORTEX AI', company2: 'AETHER LABS', company3: 'LUMINA OS' },
      render: ({ title, company1, company2, company3 }) => (
        <section className="py-16 px-6 bg-[#08090e] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">{title}</span>
          <div className="flex justify-center gap-8 text-xs font-extrabold text-cyan-300"><span>{company1}</span><span>{company2}</span><span>{company3}</span></div></div>
        </section>
      )
    },
    FaqTabbedAccordion: {
      fields: { title: { type: 'text' }, tab1: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' }, tab2: { type: 'text' }, q2: { type: 'text' }, a2: { type: 'text' } },
      defaultProps: { title: 'Tabbed Knowledge Center', tab1: 'General', q1: 'How do I add new pages?', a1: 'Use the Page Manager modal in the top studio header bar.', tab2: 'Export', q2: 'What is included in the ZIP?', a2: 'Offline ready HTML files with relative internal page link routing.' },
      render: ({ title, tab1, q1, a1, tab2, q2, a2 }) => (
        <section className="py-20 px-6 bg-[#0d0f19] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto"><h2 className="text-3xl font-extrabold mb-8">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#0f111a] border border-cyan-500/30"><span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">{tab1}</span><strong className="text-xs text-white block mb-1">{q1}</strong><p className="text-xs text-slate-400">{a1}</p></div>
            <div className="p-6 rounded-2xl bg-[#0f111a] border border-sky-500/30"><span className="text-[10px] font-bold text-sky-400 uppercase block mb-1">{tab2}</span><strong className="text-xs text-white block mb-1">{q2}</strong><p className="text-xs text-slate-400">{a2}</p></div>
          </div></div>
        </section>
      )
    },
    FaqInteractiveSearch: {
      fields: { title: { type: 'text' }, searchPlaceholder: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' } },
      defaultProps: { title: 'Searchable FAQ Directory', searchPlaceholder: 'Type question topic...', q1: 'Can I import project-data.json back into Puck?', a1: 'Yes, the ZIP export includes raw project-data.json for complete re-hydration.' },
      render: ({ title, searchPlaceholder, q1, a1 }) => (
        <section className="py-20 px-6 bg-[#06070a] font-sans text-white text-center">
          <div className="max-w-3xl mx-auto"><h2 className="text-3xl font-extrabold mb-4">{title}</h2>
          <input type="text" readOnly placeholder={searchPlaceholder} className="w-full px-4 py-3 rounded-xl bg-[#0f111a] border border-white/15 text-xs text-slate-300 mb-6" />
          <div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10 text-left"><strong className="text-xs text-cyan-300 block mb-1">{q1}</strong><p className="text-xs text-slate-400">{a1}</p></div></div>
        </section>
      )
    },
    FaqCardGrid3Column: {
      fields: { title: { type: 'text' }, q1: { type: 'text' }, a1: { type: 'text' }, q2: { type: 'text' }, a2: { type: 'text' }, q3: { type: 'text' }, a3: { type: 'text' } },
      defaultProps: { title: '3-Column FAQ Matrix', q1: 'Security SLA', a1: 'Zero-trust database RLS rules applied.', q2: 'Custom Presets', a2: 'Over 150+ visual block presets included.', q3: 'Tailwind Support', a3: 'Native Tailwind CSS v4 styling.' },
      render: ({ title, q1, a1, q2, a2, q3, a3 }) => (
        <section className="py-20 px-6 bg-[#090a0f] font-sans text-white text-center">
          <div className="max-w-5xl mx-auto"><h2 className="text-3xl font-extrabold mb-10">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs text-cyan-400 block mb-1">{q1}</strong><p className="text-xs text-slate-400">{a1}</p></div>
            <div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs text-sky-400 block mb-1">{q2}</strong><p className="text-xs text-slate-400">{a2}</p></div>
            <div className="p-6 rounded-2xl bg-[#0f111a] border border-white/10"><strong className="text-xs text-purple-400 block mb-1">{q3}</strong><p className="text-xs text-slate-400">{a3}</p></div>
          </div></div>
        </section>
      )
    },
    CommunityStatsBox: {
      fields: { title: { type: 'text' }, count: { type: 'text' }, description: { type: 'text' }, joinCta: { type: 'text' }, joinUrl: { type: 'text' } },
      defaultProps: { title: 'Global Creator Network', count: '100,000+ Active Builders', description: 'Collaborate with visual web developers across 40+ countries.', joinCta: 'Join Global Network', joinUrl: '/contact' },
      render: ({ title, count, description, joinCta, joinUrl }) => (
        <section className="py-20 px-6 bg-[#0b0c16] font-sans text-white text-center">
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-cyan-950/20 border border-cyan-500/30">
            <span className="text-3xl font-black text-cyan-400 block mb-2">{count}</span>
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <p className="text-xs text-slate-300 mb-6">{description}</p>
            <a href={joinUrl || '/contact'} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block">{joinCta}</a>
          </div>
        </section>
      )
    },
    TrustCertificatesBadge: {
      fields: { title: { type: 'text' }, cert1: { type: 'text' }, cert2: { type: 'text' }, cert3: { type: 'text' } },
      defaultProps: { title: 'Verified Security Certification', cert1: 'SOC2 Compliant', cert2: 'GDPR Verified', cert3: 'ISO 27001' },
      render: ({ title, cert1, cert2, cert3 }) => (
        <section className="py-12 px-6 bg-[#050608] font-sans text-white text-center border-y border-white/10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <span>{title}</span>
            <div className="flex gap-4 text-emerald-400"><span>✓ {cert1}</span><span>✓ {cert2}</span><span>✓ {cert3}</span></div>
          </div>
        </section>
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
    PricingSliderTier: {
      fields: { title: { type: 'text' }, minPrice: { type: 'text' }, maxPrice: { type: 'text' }, unitLabel: { type: 'text' } },
      defaultProps: { title: 'Dynamic Usage Pricing Calculator', minPrice: '$19/mo', maxPrice: '$299/mo', unitLabel: '10K - 1M API Calls' },
      render: ({ title, minPrice, maxPrice, unitLabel }) => (
        <section className="py-20 px-6 bg-[#0a0c14] font-sans text-white text-center">
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#06070a] border border-cyan-500/30">
            <h2 className="text-3xl font-black mb-3">{title}</h2>
            <div className="text-xs font-mono text-slate-400 mb-6">{unitLabel}</div>
            <div className="text-4xl font-extrabold text-cyan-400 mb-6">{minPrice} - {maxPrice}</div>
            <a href="/pricing" className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-block">Configure Usage Plan</a>
          </div>
        </section>
      )
    },
    PricingEnterpriseCustom: {
      fields: { title: { type: 'text' }, subtitle: { type: 'text' }, feature1: { type: 'text' }, feature2: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: { title: 'Custom Enterprise License', subtitle: 'For organizations with strict compliance, SOC2, and dedicated SLA requirements.', feature1: '✓ Dedicated Account Engineer', feature2: '✓ Unlimited Subagent Concurrency', ctaText: 'Contact Enterprise Sales', ctaUrl: '/contact' },
      render: ({ title, subtitle, feature1, feature2, ctaText, ctaUrl }) => (
        <section className="py-20 px-6 bg-[#08090e] font-sans text-white text-center">
          <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-[#0f111a] border border-purple-500/40">
            <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
            <p className="text-xs text-slate-400 mb-6">{subtitle}</p>
            <div className="flex justify-center gap-6 text-xs text-purple-300 font-bold mb-8"><span>{feature1}</span><span>{feature2}</span></div>
            <a href={ctaUrl || '/contact'} className="px-8 py-3.5 rounded-2xl bg-purple-600 text-white font-extrabold text-xs inline-block">{ctaText}</a>
          </div>
        </section>
      )
    },
    CtaInteractiveNewsletter: {
      fields: { title: { type: 'text' }, description: { type: 'textarea' }, buttonText: { type: 'text' } },
      defaultProps: { title: 'Join 50,000+ Visual Web Builders', description: 'Get weekly updates on new Awwwards presets, Next.js tutorials, and studio features.', buttonText: 'Subscribe Now' },
      render: ({ title, description, buttonText }) => (
        <section className="py-20 px-6 bg-[#06070a] font-sans text-white text-center">
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#0f111a] border border-white/10">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-xs text-slate-400 mb-6">{description}</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="email" readOnly placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/15 text-xs text-slate-300" />
              <button className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">{buttonText}</button>
            </div>
          </div>
        </section>
      )
    },
    CtaFullWidthGradient: {
      fields: { title: { type: 'text' }, subhead: { type: 'text' }, buttonText: { type: 'text' }, buttonUrl: { type: 'text' } },
      defaultProps: { title: 'Ready To Build Production Web Pages?', subhead: 'No code debt, no rigid templates. Pure TypeScript components.', buttonText: 'Launch Puck Studio', buttonUrl: '/admin' },
      render: ({ title, subhead, buttonText, buttonUrl }) => (
        <section className="py-24 px-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 font-sans text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-3">{title}</h2>
            <p className="text-slate-100 text-sm mb-8">{subhead}</p>
            <a href={buttonUrl || '/admin'} className="px-8 py-3.5 rounded-2xl bg-slate-950 text-cyan-300 border border-cyan-400 font-extrabold text-xs inline-block">{buttonText}</a>
          </div>
        </section>
      )
    },
    CtaFloatingBar: {
      fields: { message: { type: 'text' }, buttonText: { type: 'text' }, buttonUrl: { type: 'text' } },
      defaultProps: { message: '🚀 Nextflow 4.0 Multi-Page Release Available!', buttonText: 'Explore Features', buttonUrl: '/services' },
      render: ({ message, buttonText, buttonUrl }) => (
        <div className="py-3 px-6 bg-cyan-950/80 border-y border-cyan-500/40 font-sans text-white text-xs flex justify-between items-center">
          <span className="font-bold text-cyan-300">{message}</span>
          <a href={buttonUrl || '/services'} className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-extrabold text-[11px]">{buttonText}</a>
        </div>
      )
    },

    // 7. FOOTER-SECTION (11 PRESETS)
    Footer: {
      fields: {
        brandName: { type: 'text' },
        description: { type: 'text' },
        copyrightText: { type: 'text' },
        link1: { type: 'text' }, link1Url: { type: 'text' },
        link2: { type: 'text' }, link2Url: { type: 'text' },
        link3: { type: 'text' }, link3Url: { type: 'text' },
        link4: { type: 'text' }, link4Url: { type: 'text' }
      },
      defaultProps: {
        brandName: 'NEXTFLOW.',
        description: 'Next-generation digital workspace and template engine.',
        copyrightText: '© 2026 Nextflow Inc. All rights reserved.',
        link1: 'Privacy Policy', link1Url: '/about',
        link2: 'Terms of Service', link2Url: '/about',
        link3: 'Documentation', link3Url: '/services',
        link4: 'Status', link4Url: '/contact'
      },
      render: ({ brandName, description, copyrightText, link1, link1Url, link2, link2Url, link3, link3Url, link4, link4Url }) => (
        <footer className="py-12 px-8 bg-[#050608] border-t border-white/10 text-white font-sans">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="text-lg font-black text-white mb-1">{brandName}</div>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href={link1Url || '/about'}>{link1}</a>
              <a href={link2Url || '/about'}>{link2}</a>
              <a href={link3Url || '/services'}>{link3}</a>
              <a href={link4Url || '/contact'}>{link4}</a>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 text-center text-[10px] text-slate-500">{copyrightText}</div>
        </footer>
      )
    },
    FooterMinimalRail: {
      fields: {
        brandName: { type: 'text' },
        copyrightText: { type: 'text' },
        link1: { type: 'text' }, link1Url: { type: 'text' },
        link2: { type: 'text' }, link2Url: { type: 'text' }
      },
      defaultProps: { brandName: 'AETHER', copyrightText: '© 2026 Aether Labs.', link1: 'Privacy', link1Url: '/about', link2: 'Terms', link2Url: '/contact' },
      render: ({ brandName, copyrightText, link1, link1Url, link2, link2Url }) => (
        <footer className="py-6 px-8 bg-[#050608] border-t border-white/10 font-sans text-white flex justify-between items-center text-xs">
          <div><strong className="text-cyan-400">{brandName}</strong> <span className="text-slate-500 text-[10px] ml-2">{copyrightText}</span></div>
          <div className="flex gap-4 text-slate-400">
            <a href={link1Url || '/about'}>{link1}</a>
            <a href={link2Url || '/contact'}>{link2}</a>
          </div>
        </footer>
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
        <footer className="py-12 px-8 bg-[#090a0f] border-t border-white/10 text-white font-sans"><div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs"><div><strong className="text-white text-sm block mb-2">{brandName}</strong><span className="text-slate-400 text-[10px]">Multi-tenant Web Studio</span></div><div><strong className="text-cyan-400 block mb-2">{col1Title}</strong><ul className="space-y-1 text-slate-400 text-[11px]"><li key="fm1"><Link href="/">Home</Link></li><li key="fm2"><a href="/about">About Us</a></li><li key="fm3"><a href="/services">Services</a></li></ul></div><div><strong className="text-sky-400 block mb-2">{col2Title}</strong><ul className="space-y-1 text-slate-400 text-[11px]"><li key="fm4"><a href="/pricing">Pricing</a></li><li key="fm5"><a href="/contact">Contact</a></li></ul></div><div><strong className="text-purple-400 block mb-2">Legal</strong><ul className="space-y-1 text-slate-400 text-[11px]"><li key="fm6">Privacy Policy</li><li key="fm7">Terms of Service</li></ul></div></div><div className="border-t border-white/5 mt-8 pt-4 text-center text-[10px] text-slate-500">{copyrightText}</div></footer>
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
    FooterMinimalInline: {
      fields: {
        brandName: { type: 'text' }, copyrightText: { type: 'text' },
        link1: { type: 'text' }, link1Url: { type: 'text' },
        link2: { type: 'text' }, link2Url: { type: 'text' }
      },
      defaultProps: { brandName: 'AETHER STUDIO', copyrightText: '© 2026 Aether Inc.', link1: 'Documentation', link1Url: '/services', link2: 'Support', link2Url: '/contact' },
      render: ({ brandName, copyrightText, link1, link1Url, link2, link2Url }) => (
        <footer className="py-6 px-8 bg-[#050608] border-t border-white/10 font-sans text-white text-xs flex justify-between items-center">
          <div><strong className="text-cyan-400 font-extrabold">{brandName}</strong> <span className="text-slate-500 text-[10px] ml-2">{copyrightText}</span></div>
          <div className="flex gap-4 text-slate-400">
            <a href={link1Url || '/services'} className="hover:text-white">{link1}</a>
            <a href={link2Url || '/contact'} className="hover:text-white">{link2}</a>
          </div>
        </footer>
      )
    },
    FooterMultiColumnMap: {
      fields: { brandName: { type: 'text' }, col1Title: { type: 'text' }, col2Title: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'ENTERPRISE FLOW', col1Title: 'Solutions', col2Title: 'Resources', copyrightText: '© 2026 Enterprise Flow' },
      render: ({ brandName, col1Title, col2Title, copyrightText }) => (
        <footer className="py-12 px-8 bg-[#0a0c14] border-t border-white/10 font-sans text-white text-xs">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div><div className="font-extrabold text-sm text-cyan-400 mb-2">{brandName}</div><p className="text-[10px] text-slate-400">Next-generation visual web building architecture.</p></div>
            <div><strong className="text-white block mb-2">{col1Title}</strong><div className="space-y-1 text-slate-400 text-[11px]"><a href="/services" className="block">Web Engine</a><a href="/pricing" className="block">Pricing</a></div></div>
            <div><strong className="text-white block mb-2">{col2Title}</strong><div className="space-y-1 text-slate-400 text-[11px]"><a href="/about" className="block">About Us</a><a href="/contact" className="block">Contact</a></div></div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-4 text-center text-[10px] text-slate-500">{copyrightText}</div>
        </footer>
      )
    },
    FooterCyberpunkTerminal: {
      fields: { brandName: { type: 'text' }, systemLog: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: '// TERMINAL_FOOTER', systemLog: 'STATUS: 200_OK | MEM: 12MB', copyrightText: '[ END OF LINE ]' },
      render: ({ brandName, systemLog, copyrightText }) => (
        <footer className="py-6 px-6 bg-[#040508] border-t border-cyan-500/40 font-mono text-white text-xs flex justify-between items-center">
          <div className="flex items-center gap-3"><span className="text-cyan-400 font-bold">{brandName}</span><span className="text-slate-500 text-[10px]">{systemLog}</span></div>
          <div className="text-slate-500 text-[10px]">{copyrightText}</div>
        </footer>
      )
    },
    FooterNewsletterInline: {
      fields: { brandName: { type: 'text' }, placeholder: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'NEXUS NEWSLETTER', placeholder: 'Enter email address...', copyrightText: '© 2026 Nexus Hub' },
      render: ({ brandName, placeholder, copyrightText }) => (
        <footer className="py-10 px-8 bg-[#090a0f] border-t border-white/10 font-sans text-white text-xs">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-extrabold text-sm">{brandName}</div>
            <div className="flex gap-2"><input type="email" readOnly placeholder={placeholder} className="px-3 py-1.5 bg-[#0f111a] border border-white/15 rounded-lg text-xs text-slate-300"/><button className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg">Join</button></div>
            <div className="text-[10px] text-slate-500">{copyrightText}</div>
          </div>
        </footer>
      )
    },
    FooterBadgeRow: {
      fields: { brandName: { type: 'text' }, badge1: { type: 'text' }, badge2: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'LUMINA OS', badge1: 'SOC2 CERTIFIED', badge2: 'GDPR READY', copyrightText: '© 2026 Lumina' },
      render: ({ brandName, badge1, badge2, copyrightText }) => (
        <footer className="py-8 px-6 bg-[#08090e] border-t border-white/10 font-sans text-white text-xs flex justify-between items-center">
          <div><strong className="text-white text-sm">{brandName}</strong></div>
          <div className="flex gap-3 text-[10px] font-mono text-cyan-400"><span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">{badge1}</span><span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">{badge2}</span></div>
          <div className="text-[10px] text-slate-500">{copyrightText}</div>
        </footer>
      )
    },
    FooterMinimalCentered: {
      fields: { brandName: { type: 'text' }, tagline: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'MONOGRAPH STUDIO', tagline: 'Editorial web design systems', copyrightText: 'MMXXVI All Rights Reserved' },
      render: ({ brandName, tagline, copyrightText }) => (
        <footer className="py-12 px-6 bg-[#050505] border-t border-neutral-900 font-serif text-white text-center">
          <div className="text-base tracking-widest uppercase mb-1">{brandName}</div>
          <div className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest mb-4">{tagline}</div>
          <div className="text-[10px] font-sans text-neutral-600">{copyrightText}</div>
        </footer>
      )
    },
    FooterDarkGrid: {
      fields: { brandName: { type: 'text' }, description: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'CARBON GRID', description: 'High frequency cloud database sync.', copyrightText: '© 2026 Carbon Inc.' },
      render: ({ brandName, description, copyrightText }) => (
        <footer className="py-10 px-8 bg-[#090a0f] border-t border-white/10 font-sans text-white text-xs">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div><div className="font-extrabold text-sm text-cyan-400">{brandName}</div><p className="text-[10px] text-slate-400">{description}</p></div>
            <div className="text-[10px] text-slate-500">{copyrightText}</div>
          </div>
        </footer>
      )
    },
    FooterFloatingPill: {
      fields: { brandName: { type: 'text' }, copyrightText: { type: 'text' }, link1: { type: 'text' }, link1Url: { type: 'text' } },
      defaultProps: { brandName: 'AETHER', copyrightText: '© 2026 Aether Labs', link1: 'Back to Top', link1Url: '/' },
      render: ({ brandName, copyrightText, link1, link1Url }) => (
        <div className="py-6 px-6 bg-[#06070a] font-sans text-white">
          <footer className="max-w-4xl mx-auto px-6 py-3 bg-[#0f111a] border border-cyan-500/30 rounded-2xl flex justify-between items-center text-xs">
            <div><strong className="text-cyan-300">{brandName}</strong> <span className="text-slate-500 text-[10px] ml-2">{copyrightText}</span></div>
            <a href={link1Url || '/'} className="text-xs text-cyan-400 font-bold hover:underline">{link1} ↑</a>
          </footer>
        </div>
      )
    },
    FooterCompactBar: {
      fields: { brandName: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandName: 'NEXTFLOW OS', copyrightText: '© 2026 Nextflow Inc. All rights reserved.' },
      render: ({ brandName, copyrightText }) => (
        <footer className="py-4 px-6 bg-[#040508] border-t border-white/10 font-sans text-white text-xs flex justify-between items-center">
          <span className="font-bold text-slate-300">{brandName}</span>
          <span className="text-slate-500 text-[10px]">{copyrightText}</span>
        </footer>
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
    DividerGradient: {
      fields: { height: { type: 'text' }, gradient: { type: 'text' } },
      defaultProps: { height: '2px', gradient: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' },
      render: ({ height, gradient }) => (
        <div className="w-full my-8" style={{ height: height || '2px', background: gradient || 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }} />
      )
    },
    StatBadgePill: {
      fields: { label: { type: 'text' }, value: { type: 'text' }, variant: { type: 'select', options: [{ label: 'Cyan', value: 'cyan' }, { label: 'Purple', value: 'purple' }, { label: 'Emerald', value: 'emerald' }] } },
      defaultProps: { label: 'LATENCY', value: '0.4ms', variant: 'cyan' },
      render: ({ label, value, variant }) => (
        <div className="py-2 inline-block">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <span className="text-[10px] text-slate-400">{label}:</span> {value}
          </span>
        </div>
      )
    },
    ImageLightboxFrame: {
      fields: { src: { type: 'text' }, caption: { type: 'text' } },
      defaultProps: { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', caption: 'High-density telemetry dashboard overview' },
      render: ({ src, caption }) => (
        <div className="py-6 font-sans">
          <div className="rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#090a0f] p-2">
            <img src={src} alt="Lightbox" className="w-full aspect-video object-cover rounded-2xl" />
            <p className="text-[11px] text-slate-400 text-center py-2 font-mono">{caption}</p>
          </div>
        </div>
      )
    },
    VideoPlayerEmbed: {
      fields: { videoUrl: { type: 'text' }, posterSrc: { type: 'text' } },
      defaultProps: { videoUrl: '#', posterSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
      render: ({ posterSrc }) => (
        <div className="py-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video bg-[#050608]">
            <img src={posterSrc} alt="Video Poster" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button className="w-14 h-14 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-xl">▶</button>
            </div>
          </div>
        </div>
      )
    },
    CodeBlockTerminal: {
      fields: { title: { type: 'text' }, code: { type: 'textarea' }, language: { type: 'text' } },
      defaultProps: { title: 'schema.sql', code: 'CREATE TABLE public.website_templates (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  puck_data JSONB NOT NULL\n);', language: 'sql' },
      render: ({ title, code, language }) => (
        <div className="py-4 font-mono text-xs text-left">
          <div className="rounded-2xl bg-[#040508] border border-white/15 overflow-hidden shadow-2xl">
            <div className="px-4 py-2 bg-[#090a0f] border-b border-white/10 flex justify-between items-center text-[10px] text-slate-400">
              <span>{title}</span>
              <span className="uppercase text-cyan-400">{language}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-300"><code>{code}</code></pre>
          </div>
        </div>
      )
    },

    // 10. INTERACTIVE & DYNAMIC UI PRESETS
    InteractiveTabsBento: {
      fields: {
        title: { type: 'text' },
        subhead: { type: 'text' },
        tab1Title: { type: 'text' }, tab1Content: { type: 'textarea' },
        tab2Title: { type: 'text' }, tab2Content: { type: 'textarea' },
        tab3Title: { type: 'text' }, tab3Content: { type: 'textarea' }
      },
      defaultProps: {
        title: 'Dynamic Capabilities Engine',
        subhead: 'Click tabs to explore real-time architecture modules',
        tab1Title: 'High-Frequency Ingestion',
        tab1Content: 'Process 100,000 events/sec with sub-millisecond latency and zero-copy memory buffers.',
        tab2Title: 'Autonomous Failover',
        tab2Content: 'Multi-region active-active cluster failover in < 3 seconds with automated DNS routing.',
        tab3Title: 'Zero-Trust Encryption',
        tab3Content: 'End-to-end payload encryption at rest and in transit with hardware HSM key storage.'
      },
      render: ({ title, subhead, tab1Title, tab1Content, tab2Title, tab2Content, tab3Title, tab3Content }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-5xl mx-auto rounded-3xl bg-[#090a10] border border-white/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h2>
              <p className="text-sm text-slate-400 mt-2">{subhead}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-left">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 uppercase">Module 01</span>
                <h3 className="text-lg font-bold text-white mt-3">{tab1Title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{tab1Content}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-white/20 transition-all">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-400/20 text-purple-300 uppercase">Module 02</span>
                <h3 className="text-lg font-bold text-white mt-3">{tab2Title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tab2Content}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-white/20 transition-all">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-300 uppercase">Module 03</span>
                <h3 className="text-lg font-bold text-white mt-3">{tab3Title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tab3Content}</p>
              </div>
            </div>
          </div>
        </section>
      )
    },

    InteractivePricingCalculator: {
      fields: {
        title: { type: 'text' },
        subhead: { type: 'text' },
        basePrice: { type: 'number' },
        unitLabel: { type: 'text' },
        buttonText: { type: 'text' }
      },
      defaultProps: {
        title: 'Interactive Pricing Calculator',
        subhead: 'Scale your infrastructure seamlessly with transparent per-unit pricing',
        basePrice: 49,
        unitLabel: 'API Node',
        buttonText: 'Deploy Custom Cluster'
      },
      render: ({ title, subhead, basePrice, unitLabel, buttonText }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-3xl mx-auto rounded-3xl bg-[#0a0b12] border border-cyan-500/30 p-8 sm:p-12 shadow-2xl text-center relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">{subhead}</p>
            <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Selected Capacity</span>
                <p className="text-xl font-bold text-white mt-1">10 {unitLabel}s</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Estimated Total</span>
                <p className="text-3xl sm:text-4xl font-black text-white mt-1">${(basePrice || 49) * 10}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {buttonText}
            </button>
          </div>
        </section>
      )
    },

    InteractiveComparisonSlider: {
      fields: {
        title: { type: 'text' },
        beforeImg: { type: 'text' },
        beforeLabel: { type: 'text' },
        afterImg: { type: 'text' },
        afterLabel: { type: 'text' }
      },
      defaultProps: {
        title: 'Legacy Monolith vs Nextflow Microservices',
        beforeImg: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
        beforeLabel: 'Legacy Architecture (High Latency)',
        afterImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
        afterLabel: 'Nextflow Modern Stack (< 50ms)'
      },
      render: ({ title, beforeImg, beforeLabel, afterImg, afterLabel }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-rose-500/30 group">
                <img src={beforeImg} alt="Before" className="w-full aspect-video object-cover" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
                  {beforeLabel}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 group">
                <img src={afterImg} alt="After" className="w-full aspect-video object-cover" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                  {afterLabel}
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    },

    InteractiveFaqAccordionCard: {
      fields: {
        title: { type: 'text' }, category: { type: 'text' },
        q1: { type: 'text' }, a1: { type: 'textarea' },
        q2: { type: 'text' }, a2: { type: 'textarea' },
        q3: { type: 'text' }, a3: { type: 'textarea' }
      },
      defaultProps: {
        title: 'Frequently Asked Questions',
        category: 'ARCHITECTURE & DEPLOYMENT',
        q1: 'How does Nextflow handle multi-tenant isolation?',
        a1: 'We implement row-level security (RLS) policies in Postgres combined with isolated schema namespaces and JWT tenant claims.',
        q2: 'What SLA uptime guarantees are available?',
        a2: 'Enterprise tiers include a 99.99% uptime SLA with active-active multi-region failover and dedicated engineering support.',
        q3: 'Can I integrate custom webhooks and external APIs?',
        a3: 'Yes, our event bus provides native HTTP webhook dispatch with exponential retry backoff and HMAC signature verification.'
      },
      render: ({ title, category, q1, a1, q2, a2, q3, a3 }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-3xl mx-auto rounded-3xl bg-[#0d0e16] border border-white/10 p-8 shadow-2xl">
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">{category}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-6">{title}</h2>
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">{q1} <span className="text-cyan-400">+</span></h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{a1}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">{q2} <span className="text-cyan-400">+</span></h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{a2}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">{q3} <span className="text-cyan-400">+</span></h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{a3}</p>
              </div>
            </div>
          </div>
        </section>
      )
    },

    InteractiveAudioPlayerCard: {
      fields: {
        trackTitle: { type: 'text' }, artist: { type: 'text' }, duration: { type: 'text' }, posterImg: { type: 'text' }
      },
      defaultProps: {
        trackTitle: 'Architecting High-Frequency Systems',
        artist: 'Nextflow Engineering Podcast #42',
        duration: '42:18',
        posterImg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
      },
      render: ({ trackTitle, artist, duration, posterImg }) => (
        <section className="py-12 px-6 font-sans">
          <div className="max-w-xl mx-auto rounded-3xl bg-[#090a10] border border-cyan-500/30 p-6 shadow-2xl flex items-center gap-5">
            <img src={posterImg} alt="Podcast Poster" className="w-20 h-20 rounded-2xl object-cover border border-white/10 shrink-0" />
            <div className="min-w-0 flex-1 text-left">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{artist}</span>
              <h3 className="text-base font-bold text-white truncate mt-0.5">{trackTitle}</h3>
              <div className="flex items-center gap-1 mt-3">
                <div className="h-4 w-1 bg-cyan-400 rounded-full animate-pulse" />
                <div className="h-6 w-1 bg-cyan-300 rounded-full animate-pulse" />
                <div className="h-3 w-1 bg-cyan-400 rounded-full animate-pulse" />
                <div className="h-7 w-1 bg-cyan-500 rounded-full animate-pulse" />
                <div className="h-4 w-1 bg-cyan-300 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400 ml-2">{duration}</span>
              </div>
            </div>
            <button className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-transform shrink-0">
              ▶
            </button>
          </div>
        </section>
      )
    },

    InteractiveTimelineStepper: {
      fields: {
        title: { type: 'text' },
        step1: { type: 'text' }, step1Desc: { type: 'text' },
        step2: { type: 'text' }, step2Desc: { type: 'text' },
        step3: { type: 'text' }, step3Desc: { type: 'text' },
        step4: { type: 'text' }, step4Desc: { type: 'text' }
      },
      defaultProps: {
        title: 'Production Deployment Lifecycle',
        step1: '01. Architecture Review', step1Desc: 'System topology and DB schema validation',
        step2: '02. Staging Validation', step2Desc: 'Automated E2E tests and load testing',
        step3: '03. Zero-Downtime Rollout', step3Desc: 'Canary deployment with active health checks',
        step4: '04. Continuous Observability', step4Desc: 'Real-time telemetry and anomaly alerts'
      },
      render: ({ title, step1, step1Desc, step2, step2Desc, step3, step3Desc, step4, step4Desc }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-10">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="p-5 rounded-2xl bg-[#0a0b12] border border-cyan-500/40 relative">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block mb-3 animate-ping" />
                <h3 className="text-sm font-bold text-white">{step1}</h3>
                <p className="text-xs text-slate-400 mt-1">{step1Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0a0b12] border border-white/10">
                <span className="w-3 h-3 rounded-full bg-purple-400 inline-block mb-3" />
                <h3 className="text-sm font-bold text-white">{step2}</h3>
                <p className="text-xs text-slate-400 mt-1">{step2Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0a0b12] border border-white/10">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block mb-3" />
                <h3 className="text-sm font-bold text-white">{step3}</h3>
                <p className="text-xs text-slate-400 mt-1">{step3Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#0a0b12] border border-white/10">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block mb-3" />
                <h3 className="text-sm font-bold text-white">{step4}</h3>
                <p className="text-xs text-slate-400 mt-1">{step4Desc}</p>
              </div>
            </div>
          </div>
        </section>
      )
    },

    // 11. CREATIVE & HERO VISUAL PRESETS
    Hero3DGlassCard: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'text' }, ctaText: { type: 'text' }, cardImg: { type: 'text' } },
      defaultProps: {
        badge: '✦ CREATIVE MATRIX 2026',
        title: 'Designing Digital Experiences Beyond Limits',
        description: 'Empowering engineering teams with high-density UI components and automated workflow pipelines.',
        ctaText: 'Explore System Architecture',
        cardImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80'
      },
      render: ({ badge, title, description, ctaText, cardImg }) => (
        <section className="py-20 px-6 font-sans relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">{badge}</span>
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{title}</h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{description}</p>
              <button className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors shadow-lg">
                {ctaText}
              </button>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-2xl shadow-2xl p-3 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img src={cardImg} alt="Hero Card" className="w-full aspect-[4/3] object-cover rounded-2xl" />
              </div>
            </div>
          </div>
        </section>
      )
    },

    HeroMinimalEditorial: {
      fields: { issueNo: { type: 'text' }, title: { type: 'text' }, description: { type: 'text' }, quote: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: {
        issueNo: 'MONOGRAPH VOL. 08',
        title: 'Architectural Elegance & Code Permanence',
        description: 'A study in high-contrast editorial typography, minimal grid composition, and functional software design.',
        quote: '“Code should be written with the clarity of prose and the strength of steel.”',
        ctaText: 'Read Monograph'
      },
      render: ({ issueNo, title, description, quote, ctaText }) => (
        <section className="py-24 px-6 font-serif text-left max-w-5xl mx-auto border-y border-white/10">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-amber-400 block mb-4">{issueNo}</span>
          <h1 className="text-4xl sm:text-7xl font-light text-white tracking-tight leading-[0.95] mb-6">{title}</h1>
          <p className="font-sans text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">{description}</p>
          <blockquote className="border-l-2 border-amber-400 pl-4 py-1 italic text-amber-200/90 text-sm mb-8">{quote}</blockquote>
          <button className="font-sans px-6 py-3 rounded-none bg-white text-slate-950 text-xs uppercase font-extrabold tracking-widest hover:bg-amber-300 transition-colors">
            {ctaText} →
          </button>
        </section>
      )
    },

    HeroSplitTerminal: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, subhead: { type: 'text' }, terminalTitle: { type: 'text' }, commandText: { type: 'text' }, outputLog: { type: 'textarea' } },
      defaultProps: {
        badge: '⚡ CYBERPUNK ENGINE',
        title: 'Orchestrate Next.js Micro-Frontends',
        subhead: 'Automated container deployments with instant rollback capability',
        terminalTitle: 'nextflow-cli --v2',
        commandText: 'npx nextflow deploy --cluster=prod-tokyo-01',
        outputLog: '✔ Verifying JWT authentication tokens...\n✔ Validating database migrations (Supabase Postgres)...\n✔ Building Next.js 16 Server Bundle...\n🚀 Deployment deployed to https://app.nextflow.io (Latency: 18ms)'
      },
      render: ({ badge, title, subhead, terminalTitle, commandText, outputLog }) => (
        <section className="py-20 px-6 font-sans">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-left space-y-4">
              <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">{badge}</span>
              <h1 className="text-3xl sm:text-5xl font-black text-white">{title}</h1>
              <p className="text-sm text-slate-400">{subhead}</p>
            </div>
            <div className="rounded-2xl bg-[#040508] border border-cyan-500/40 font-mono text-xs text-left overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-[#090a10] border-b border-white/10 flex justify-between items-center text-[10px] text-slate-400">
                <span>{terminalTitle}</span>
                <span className="text-cyan-400">● LIVE</span>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-cyan-300">$ {commandText}</p>
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">{outputLog}</pre>
              </div>
            </div>
          </div>
        </section>
      )
    },

    HeroMarqueeBanner: {
      fields: { marqueeText: { type: 'text' }, subhead: { type: 'text' }, ctaText: { type: 'text' }, ctaUrl: { type: 'text' } },
      defaultProps: {
        marqueeText: 'NEXTFLOW STUDIO ✦ HIGH PERFORMANCE ✦ ZERO DOWNTIME ✦ ENTERPRISE READY ✦',
        subhead: 'Empowering digital transformation across global tech hubs',
        ctaText: 'Start Building Now',
        ctaUrl: '#'
      },
      render: ({ marqueeText, subhead, ctaText }) => (
        <section className="py-20 bg-[#090a0f] border-y border-white/10 font-sans overflow-hidden">
          <div className="py-4 bg-cyan-500/10 border-y border-cyan-500/30 whitespace-nowrap overflow-hidden">
            <div className="text-3xl sm:text-6xl font-black text-cyan-300 tracking-tighter uppercase inline-block animate-pulse">
              {marqueeText}
            </div>
          </div>
          <div className="mt-8 text-center max-w-xl mx-auto px-6">
            <p className="text-sm text-slate-300 mb-6">{subhead}</p>
            <button className="px-8 py-3.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors shadow-lg">
              {ctaText}
            </button>
          </div>
        </section>
      )
    },

    // 12. CONTENT & EDITORIAL LAYOUT PRESETS
    EditorialArticleHeader: {
      fields: { tag: { type: 'text' }, title: { type: 'text' }, authorName: { type: 'text' }, authorRole: { type: 'text' }, readTime: { type: 'text' }, publishedDate: { type: 'text' } },
      defaultProps: {
        tag: 'SOFTWARE ENGINEERING',
        title: 'Building Resilient Micro-Frontends with Next.js 16 App Router',
        authorName: 'Dr. Alex Vance',
        authorRole: 'Principal Systems Architect',
        readTime: '8 min read',
        publishedDate: 'August 14, 2026'
      },
      render: ({ tag, title, authorName, authorRole, readTime, publishedDate }) => (
        <header className="py-16 px-6 font-serif max-w-4xl mx-auto text-left border-b border-white/10">
          <span className="font-mono text-xs tracking-widest uppercase text-cyan-400 block mb-3">{tag}</span>
          <h1 className="text-3xl sm:text-5xl font-normal text-white leading-tight mb-6">{title}</h1>
          <div className="flex items-center gap-4 pt-4 border-t border-white/10 font-sans text-xs text-slate-400">
            <div>
              <p className="font-bold text-white">{authorName}</p>
              <p className="text-[10px] text-slate-400">{authorRole}</p>
            </div>
            <span className="ml-auto font-mono text-[10px]">{publishedDate} • {readTime}</span>
          </div>
        </header>
      )
    },

    EditorialQuoteBlock: {
      fields: { quote: { type: 'text' }, author: { type: 'text' }, company: { type: 'text' } },
      defaultProps: {
        quote: 'Simplifying complexity is the ultimate mark of engineering mastery.',
        author: 'Marcus Sterling',
        company: 'Chief Technology Officer, Lumina Atelier'
      },
      render: ({ quote, author, company }) => (
        <section className="py-16 px-6 font-serif text-center">
          <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-[#090a10] border border-amber-500/30 relative">
            <span className="text-6xl text-amber-400/40 leading-none block font-serif">“</span>
            <p className="text-xl sm:text-3xl text-amber-100 font-light leading-snug my-4">{quote}</p>
            <div className="mt-6 font-sans">
              <p className="text-sm font-bold text-white">{author}</p>
              <p className="text-xs text-amber-400/80 font-mono mt-0.5">{company}</p>
            </div>
          </div>
        </section>
      )
    },

    EditorialGridCards: {
      fields: {
        sectionTitle: { type: 'text' },
        c1Title: { type: 'text' }, c1Category: { type: 'text' },
        c2Title: { type: 'text' }, c2Category: { type: 'text' },
        c3Title: { type: 'text' }, c3Category: { type: 'text' }
      },
      defaultProps: {
        sectionTitle: 'Latest Architectural Essays',
        c1Title: 'Zero-Copy Memory Ingestion in Rust', c1Category: 'SYSTEMS',
        c2Title: 'Distributed Lock Contention Patterns', c2Category: 'DATABASES',
        c3Title: 'High-Density Telemetry Dashboards', c3Category: 'FRONTEND'
      },
      render: ({ sectionTitle, c1Title, c1Category, c2Title, c2Category, c3Title, c3Category }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-left">{sectionTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-[#0a0b12] border border-white/10 hover:border-cyan-500/40 transition-all">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{c1Category}</span>
                <h3 className="text-lg font-bold text-white mt-2">{c1Title}</h3>
                <span className="text-xs text-slate-400 mt-4 block">Read Essay →</span>
              </div>
              <div className="p-6 rounded-2xl bg-[#0a0b12] border border-white/10 hover:border-purple-500/40 transition-all">
                <span className="text-[10px] font-mono text-purple-400 font-bold">{c2Category}</span>
                <h3 className="text-lg font-bold text-white mt-2">{c2Title}</h3>
                <span className="text-xs text-slate-400 mt-4 block">Read Essay →</span>
              </div>
              <div className="p-6 rounded-2xl bg-[#0a0b12] border border-white/10 hover:border-emerald-500/40 transition-all">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{c3Category}</span>
                <h3 className="text-lg font-bold text-white mt-2">{c3Title}</h3>
                <span className="text-xs text-slate-400 mt-4 block">Read Essay →</span>
              </div>
            </div>
          </div>
        </section>
      )
    },

    EditorialStatCallout: {
      fields: { statValue: { type: 'text' }, statLabel: { type: 'text' }, headline: { type: 'text' }, description: { type: 'text' } },
      defaultProps: {
        statValue: '99.999%',
        statLabel: 'SYSTEM AVAILABILITY',
        headline: 'Engineered for Zero-Downtime Reliability',
        description: 'Our cloud topology guarantees seamless failover across three geographical regions.'
      },
      render: ({ statValue, statLabel, headline, description }) => (
        <section className="py-20 px-6 font-sans">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0a0b12] to-purple-950/40 border border-cyan-500/30 p-10 sm:p-16 flex flex-col md:flex-row items-center gap-10">
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">{statLabel}</span>
              <p className="text-5xl sm:text-7xl font-black text-white tracking-tight mt-1">{statValue}</p>
            </div>
            <div className="text-left max-w-lg border-l border-white/10 pl-6">
              <h3 className="text-xl font-bold text-white">{headline}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{description}</p>
            </div>
          </div>
        </section>
      )
    },

    // 13. ECOMMERCE & PRODUCT PRESETS
    EcommerceProductGrid: {
      fields: {
        title: { type: 'text' },
        p1Name: { type: 'text' }, p1Price: { type: 'text' }, p1Img: { type: 'text' },
        p2Name: { type: 'text' }, p2Price: { type: 'text' }, p2Img: { type: 'text' },
        p3Name: { type: 'text' }, p3Price: { type: 'text' }, p3Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Featured Developer Hardware',
        p1Name: 'Nextflow Neural Workstation', p1Price: '$3,499', p1Img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop&q=80',
        p2Name: 'Cyberdeck OLED Terminal', p2Price: '$1,299', p2Img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
        p3Name: 'Quantum Audio Monitoring Desk', p3Price: '$899', p3Img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80'
      },
      render: ({ title, p1Name, p1Price, p1Img, p2Name, p2Price, p2Img, p3Name, p3Price, p3Img }) => (
        <section className="py-20 px-6 font-sans">
          <div className="max-w-6xl mx-auto text-left">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">[CATALOG]</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-8">Hand-selected goods from independent studios worldwide.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-none bg-[#0a0b12] border border-white/10 overflow-hidden p-5 space-y-4">
                <img src={p1Img} alt={p1Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{p1Name}</h3>
                  <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p1Price}</span>
                </div>
                <button className="w-full py-3 rounded-none bg-white text-slate-950 font-extrabold text-xs uppercase hover:bg-slate-200 transition-colors">Add to Cart</button>
              </div>
              <div className="rounded-none bg-[#0a0b12] border border-white/10 overflow-hidden p-5 space-y-4">
                <img src={p2Img} alt={p2Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{p2Name}</h3>
                  <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p2Price}</span>
                </div>
                <button className="w-full py-3 rounded-none bg-white text-slate-950 font-extrabold text-xs uppercase hover:bg-slate-200 transition-colors">Add to Cart</button>
              </div>
              <div className="rounded-none bg-[#0a0b12] border border-white/10 overflow-hidden p-5 space-y-4">
                <img src={p3Img} alt={p3Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{p3Name}</h3>
                  <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p3Price}</span>
                </div>
                <button className="w-full py-3 rounded-none bg-white text-slate-950 font-extrabold text-xs uppercase hover:bg-slate-200 transition-colors">Add to Cart</button>
              </div>
            </div>
          </div>
        </section>
      )
    },

    EcommerceFeatureHighlight: {
      fields: { productName: { type: 'text' }, tagline: { type: 'text' }, price: { type: 'text' }, description: { type: 'textarea' }, feature1: { type: 'text' }, feature2: { type: 'text' }, mainImg: { type: 'text' } },
      defaultProps: {
        productName: 'Aura Studio Wireless Headphones Pro',
        tagline: 'FLAGSHIP ACOUSTIC HARDWARE',
        price: '$349.00',
        description: 'Hand-assembled active noise-cancelling headphones crafted with brushed aluminum and authentic Italian lambskin leather.',
        feature1: '45dB Hybrid Active Noise Suppression',
        feature2: '40-Hour Continuous Battery Life',
        mainImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80'
      },
      render: ({ productName, tagline, price, description, feature1, feature2, mainImg }) => (
        <section className="py-20 px-6 font-sans">
          <div className="max-w-5xl mx-auto rounded-none bg-[#090a0f] border border-white/10 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center text-left">
            <div>
              <img src={mainImg} alt={productName} className="w-full aspect-square object-cover rounded-none border border-white/10" />
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{tagline}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{productName}</h2>
              <p className="text-lg font-mono font-black text-white mt-1">{price}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
              <ul className="space-y-2 text-xs font-bold text-slate-200">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> {feature1}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> {feature2}</li>
              </ul>
              <button className="w-full py-3.5 rounded-none bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors">Order Now</button>
            </div>
          </div>
        </section>
      )
    },

    EcommercePromoBanner: {
      fields: { promoBadge: { type: 'text' }, headline: { type: 'text' }, discountCode: { type: 'text' }, subtext: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: {
        promoBadge: 'AUTUMN COLLECTION PROMO',
        headline: 'Exclusive 20% Off Launch Promotion',
        discountCode: 'STUDIO20',
        subtext: 'Applied automatically at checkout for all new studio patrons.',
        ctaText: 'Claim Discount Code'
      },
      render: ({ promoBadge, headline, discountCode, subtext, ctaText }) => (
        <section className="py-12 px-6 font-sans">
          <div className="max-w-5xl mx-auto rounded-none bg-slate-900 border border-slate-800 p-8 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="text-left text-white space-y-2">
              <span className="px-3 py-1 bg-white/10 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-none tracking-widest border border-white/20">{promoBadge}</span>
              <h3 className="text-xl sm:text-3xl font-extrabold">{headline}</h3>
              <p className="text-xs text-slate-300">{subtext}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="px-5 py-2.5 bg-black font-mono font-black text-cyan-400 text-base mb-3 text-center border border-white/10">
                {discountCode}
              </div>
              <button className="px-6 py-3 bg-white text-slate-950 font-extrabold text-xs uppercase hover:bg-slate-200 transition-colors rounded-none">{ctaText}</button>
            </div>
          </div>
        </section>
      )
    },

    EcommerceProductsRail: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        p1Name: { type: 'text' }, p1Price: { type: 'text' }, p1Img: { type: 'text' },
        p2Name: { type: 'text' }, p2Price: { type: 'text' }, p2Img: { type: 'text' },
        p3Name: { type: 'text' }, p3Price: { type: 'text' }, p3Img: { type: 'text' },
        p4Name: { type: 'text' }, p4Price: { type: 'text' }, p4Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Flagship Goods Monograph Rail',
        subtitle: 'Swipe or scroll horizontally to explore bespoke studio hardware.',
        p1Name: 'Aura Studio Wireless Headphones Pro', p1Price: '$349.00', p1Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        p2Name: 'Nordic Ash Lounge Chair', p2Price: '$490.00', p2Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80',
        p3Name: 'Minimalist Chronograph Watch', p3Price: '$189.00', p3Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        p4Name: 'Precision Desktop Audio Node', p4Price: '$279.00', p4Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80'
      },
      render: ({ title, subtitle, p1Name, p1Price, p1Img, p2Name, p2Price, p2Img, p3Name, p3Price, p3Img, p4Name, p4Price, p4Img }) => (
        <section className="py-20 px-6 font-sans text-left bg-[#090a0f] text-white">
          <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">[PRODUCTS RAIL]</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{title}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
            </div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider hidden sm:inline-block">← SWIPE CAROUSEL →</span>
          </div>
          <div className="max-w-7xl mx-auto flex overflow-x-auto gap-6 pb-6 snap-x">
            <div className="rounded-none bg-[#0a0b12] border border-white/10 p-5 space-y-4 min-w-[280px] sm:min-w-[320px] shrink-0 snap-start">
              <img src={p1Img} alt={p1Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-white line-clamp-1">{p1Name}</h3>
                <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p1Price}</span>
              </div>
              <button className="w-full py-3 bg-white text-slate-950 font-extrabold text-xs uppercase rounded-none hover:bg-slate-200 transition-colors">Add to Cart</button>
            </div>
            <div className="rounded-none bg-[#0a0b12] border border-white/10 p-5 space-y-4 min-w-[280px] sm:min-w-[320px] shrink-0 snap-start">
              <img src={p2Img} alt={p2Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-white line-clamp-1">{p2Name}</h3>
                <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p2Price}</span>
              </div>
              <button className="w-full py-3 bg-white text-slate-950 font-extrabold text-xs uppercase rounded-none hover:bg-slate-200 transition-colors">Add to Cart</button>
            </div>
            <div className="rounded-none bg-[#0a0b12] border border-white/10 p-5 space-y-4 min-w-[280px] sm:min-w-[320px] shrink-0 snap-start">
              <img src={p3Img} alt={p3Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-white line-clamp-1">{p3Name}</h3>
                <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p3Price}</span>
              </div>
              <button className="w-full py-3 bg-white text-slate-950 font-extrabold text-xs uppercase rounded-none hover:bg-slate-200 transition-colors">Add to Cart</button>
            </div>
            <div className="rounded-none bg-[#0a0b12] border border-white/10 p-5 space-y-4 min-w-[280px] sm:min-w-[320px] shrink-0 snap-start">
              <img src={p4Img} alt={p4Name} className="w-full aspect-square object-cover rounded-none border border-white/10" />
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-white line-clamp-1">{p4Name}</h3>
                <span className="text-sm font-mono font-black text-cyan-400 shrink-0 ml-2">{p4Price}</span>
              </div>
              <button className="w-full py-3 bg-white text-slate-950 font-extrabold text-xs uppercase rounded-none hover:bg-slate-200 transition-colors">Add to Cart</button>
            </div>
          </div>
        </section>
      )
    },

    EcommerceCatalogHero: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        category1: { type: 'text' },
        category2: { type: 'text' },
        category3: { type: 'text' },
        category4: { type: 'text' },
        activeCategory: { type: 'text' },
        itemCount: { type: 'text' }
      },
      defaultProps: {
        title: 'Flagship Storefront & Studio Catalog',
        subtitle: 'Explore our complete monograph of bespoke acoustic audio, artisan furniture, and minimalist daily essentials.',
        category1: 'ALL OBJECTS',
        category2: 'ACOUSTIC AUDIO',
        category3: 'ARTISAN FURNITURE',
        category4: 'CHRONOGRAPHS',
        activeCategory: 'ALL OBJECTS',
        itemCount: '24 STORE ITEMS'
      },
      render: ({ title, subtitle, category1, category2, category3, category4, activeCategory, itemCount }) => (
        <section className="pt-16 pb-10 px-6 font-sans text-left bg-[#090a0f] text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3 py-1 bg-white/10 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-none tracking-widest border border-white/20 inline-block">
                  [STOREFRONT CATALOG]
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{title}</h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{subtitle}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <div className="p-3 bg-[#0a0b12] border border-white/10 text-slate-300">
                  <span className="text-[10px] text-slate-500 block uppercase">CATALOG STATUS</span>
                  <strong className="text-cyan-400 font-bold">{itemCount}</strong>
                </div>
                <div className="p-3 bg-[#0a0b12] border border-white/10 text-slate-300 hidden sm:block">
                  <span className="text-[10px] text-slate-500 block uppercase">SORT ORDER</span>
                  <strong className="text-white font-bold">FEATURED FIRST</strong>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {[category1, category2, category3, category4].filter(Boolean).map((cat, idx) => {
                  const isActive = cat.toLowerCase() === (activeCategory || category1).toLowerCase()
                  return (
                    <button
                      key={idx}
                      className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-none border transition-colors ${
                        isActive
                          ? 'bg-white text-slate-950 border-white'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
              <span className="text-[11px] font-mono text-slate-400 hidden lg:inline-block uppercase tracking-wider">
                FREE EXPRESS SHIPPING ON ORDERS OVER $150
              </span>
            </div>
          </div>
        </section>
      )
    },

    EcommerceProductGrid6: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        p1Name: { type: 'text' }, p1Price: { type: 'text' }, p1Badge: { type: 'text' }, p1Img: { type: 'text' },
        p2Name: { type: 'text' }, p2Price: { type: 'text' }, p2Badge: { type: 'text' }, p2Img: { type: 'text' },
        p3Name: { type: 'text' }, p3Price: { type: 'text' }, p3Badge: { type: 'text' }, p3Img: { type: 'text' },
        p4Name: { type: 'text' }, p4Price: { type: 'text' }, p4Badge: { type: 'text' }, p4Img: { type: 'text' },
        p5Name: { type: 'text' }, p5Price: { type: 'text' }, p5Badge: { type: 'text' }, p5Img: { type: 'text' },
        p6Name: { type: 'text' }, p6Price: { type: 'text' }, p6Badge: { type: 'text' }, p6Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Catalog Grid Hardware & Essentials',
        subtitle: 'Hand-assembled goods with carbon-neutral dispatch and 2-year warranty.',
        p1Name: 'Aura Studio Wireless Headphones Pro', p1Price: '$349.00', p1Badge: 'FLAGSHIP', p1Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
        p2Name: 'Nordic Ash Lounge Chair', p2Price: '$490.00', p2Badge: 'ARTISAN', p2Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80',
        p3Name: 'Minimalist Chronograph Watch', p3Price: '$189.00', p3Badge: 'LIMITED', p3Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        p4Name: 'Precision Desktop Audio Node', p4Price: '$279.00', p4Badge: 'NEW RELEASE', p4Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        p5Name: 'Beryllium Driver Studio Monitors', p5Price: '$590.00', p5Badge: 'STUDIO SPEC', p5Img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop&q=80',
        p6Name: 'Italian Lambskin Carry Case', p6Badge: 'BESPOKE', p6Price: '$129.00', p6Img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80'
      },
      render: ({ title, subtitle, p1Name, p1Price, p1Badge, p1Img, p2Name, p2Price, p2Badge, p2Img, p3Name, p3Price, p3Badge, p3Img, p4Name, p4Price, p4Badge, p4Img, p5Name, p5Price, p5Badge, p5Img, p6Name, p6Price, p6Badge, p6Img }) => {
        const products = [
          { name: p1Name, price: p1Price, badge: p1Badge, img: p1Img },
          { name: p2Name, price: p2Price, badge: p2Badge, img: p2Img },
          { name: p3Name, price: p3Price, badge: p3Badge, img: p3Img },
          { name: p4Name, price: p4Price, badge: p4Badge, img: p4Img },
          { name: p5Name, price: p5Price, badge: p5Badge, img: p5Img },
          { name: p6Name, price: p6Price, badge: p6Badge, img: p6Img }
        ]
        return (
          <section className="py-16 px-6 font-sans text-left bg-[#090a0f] text-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">[CATALOG GRID]</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{title}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item, i) => (
                  <div key={i} className="group rounded-none bg-[#0a0b12] border border-white/10 p-5 space-y-4 hover:border-cyan-500/40 transition-colors">
                    <div className="relative overflow-hidden border border-white/10 aspect-square">
                      {item.badge && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/80 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-none border border-white/20 backdrop-blur-sm">
                          {item.badge}
                        </span>
                      )}
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">{item.name}</h3>
                        <span className="text-sm font-mono font-black text-cyan-400 shrink-0">{item.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                        <div className="flex items-center gap-0.5">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">(4.9)</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-white text-slate-950 font-extrabold text-xs uppercase rounded-none hover:bg-slate-200 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }
    },

    EcommerceCartSummary: {
      fields: {
        title: { type: 'text' },
        promoCode: { type: 'text' },
        subtotal: { type: 'text' },
        shipping: { type: 'text' },
        discount: { type: 'text' },
        total: { type: 'text' },
        checkoutUrl: { type: 'text' }
      },
      defaultProps: {
        title: 'Shopping Cart & Order Summary',
        promoCode: 'STUDIO20',
        subtotal: '$839.00',
        shipping: 'FREE EXPRESS DISPATCH',
        discount: '-$167.80',
        total: '$671.20',
        checkoutUrl: '/checkout'
      },
      render: ({ title, promoCode, subtotal, shipping, discount, total, checkoutUrl }) => (
        <section className="py-16 px-6 font-sans text-left bg-[#090a0f] text-white">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">[STORE CART]</span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{title}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Review selected studio items, promotional discounts, and shipping details.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-none bg-[#0a0b12] border border-white/10 p-5 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" alt="Product 1" className="w-20 h-20 object-cover rounded-none border border-white/10 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">FLAGSHIP AUDIO</span>
                      <h3 className="text-sm font-bold text-white">Aura Studio Wireless Headphones Pro</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Matte Black / Beryllium Driver</p>
                      <strong className="text-xs font-mono text-cyan-300 block mt-1">$349.00</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="flex items-center border border-white/10 bg-white/5">
                      <button className="px-3 py-1 text-slate-300 hover:text-white">-</button>
                      <span className="px-3 py-1 text-xs text-white font-bold">1</span>
                      <button className="px-3 py-1 text-slate-300 hover:text-white">+</button>
                    </div>
                    <strong className="text-sm font-bold text-white">$349.00</strong>
                  </div>
                </div>

                <div className="rounded-none bg-[#0a0b12] border border-white/10 p-5 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80" alt="Product 2" className="w-20 h-20 object-cover rounded-none border border-white/10 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">ARTISAN LIVING</span>
                      <h3 className="text-sm font-bold text-white">Nordic Ash Lounge Chair</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Natural Ash / Charcoal Wool</p>
                      <strong className="text-xs font-mono text-cyan-300 block mt-1">$490.00</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="flex items-center border border-white/10 bg-white/5">
                      <button className="px-3 py-1 text-slate-300 hover:text-white">-</button>
                      <span className="px-3 py-1 text-xs text-white font-bold">1</span>
                      <button className="px-3 py-1 text-slate-300 hover:text-white">+</button>
                    </div>
                    <strong className="text-sm font-bold text-white">$490.00</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-none bg-[#0a0b12] border border-white/10 p-6 space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">Order Summary</h2>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal (2 Items)</span>
                    <span className="font-mono font-bold text-white">{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Express Air Dispatch</span>
                    <span className="font-mono text-cyan-400 font-bold">{shipping}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount ({promoCode})</span>
                    <span className="font-mono font-bold">{discount}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">FINAL AMOUNT</span>
                    <strong className="text-2xl font-mono font-black text-white">{total}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">TAX INCLUDED</span>
                </div>
                <a href={checkoutUrl || '/cart'} className="w-full py-4 bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-none hover:bg-slate-200 transition-colors block text-center">
                  PROCEED TO SECURE CHECKOUT
                </a>
              </div>
            </div>
          </div>
        </section>
      )
    },

    EcommerceStorefrontBannerSlider: {
      fields: {
        badgeText: { type: 'text' },
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        ctaText: { type: 'text' },
        bannerImg1: { type: 'text' },
        bannerImg2: { type: 'text' },
        feature1Tag: { type: 'text' },
        feature2Tag: { type: 'text' }
      },
      defaultProps: {
        badgeText: 'FLASH STOREFRONT SALE',
        title: 'Bespoke Acoustic & Modern Hardware Showcase',
        subtitle: 'Up to 30% off selected flagship studio audio and artisan furniture.',
        ctaText: 'EXPLORE FLASH SALE',
        bannerImg1: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&auto=format&fit=crop&q=80',
        bannerImg2: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
        feature1Tag: 'AUDIO HARDWARE -20%',
        feature2Tag: 'ARTISAN FURNITURE -30%'
      },
      render: ({ badgeText, title, subtitle, ctaText, bannerImg1, bannerImg2, feature1Tag, feature2Tag }) => (
        <section className="py-12 px-6 font-sans text-left bg-[#090a0f] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative rounded-none overflow-hidden border border-white/10 min-h-[380px] flex items-end p-8 sm:p-12 group">
              <img src={bannerImg1} alt="Main Banner" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-3 max-w-xl">
                <span className="px-3 py-1 bg-cyan-400 text-slate-950 text-[10px] font-mono font-black uppercase rounded-none tracking-widest inline-block">
                  {badgeText}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">{title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{subtitle}</p>
                <button className="mt-4 px-6 py-3 bg-white text-slate-950 font-extrabold text-xs uppercase rounded-none hover:bg-slate-200 transition-colors">
                  {ctaText}
                </button>
              </div>
            </div>
            <div className="relative rounded-none overflow-hidden border border-white/10 min-h-[380px] flex flex-col justify-between p-8 group">
              <img src={bannerImg2} alt="Sub Banner" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 bg-white/10 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-none border border-white/20 backdrop-blur-sm">
                  {feature1Tag}
                </span>
                <span className="px-2.5 py-1 bg-white/10 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded-none border border-white/20 backdrop-blur-sm">
                  {feature2Tag}
                </span>
              </div>
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">[CURATED SPOTLIGHT]</span>
                <h3 className="text-xl font-extrabold text-white">Nordic Ash Living Series</h3>
                <p className="text-xs text-slate-300">Handcrafted solid wood furniture dispatched directly from Oslo atelier.</p>
              </div>
            </div>
          </div>
        </section>
      )
    },

    EcommerceProductGrid8: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        p1Name: { type: 'text' }, p1Price: { type: 'text' }, p1OriginalPrice: { type: 'text' }, p1Badge: { type: 'text' }, p1Img: { type: 'text' },
        p2Name: { type: 'text' }, p2Price: { type: 'text' }, p2OriginalPrice: { type: 'text' }, p2Badge: { type: 'text' }, p2Img: { type: 'text' },
        p3Name: { type: 'text' }, p3Price: { type: 'text' }, p3OriginalPrice: { type: 'text' }, p3Badge: { type: 'text' }, p3Img: { type: 'text' },
        p4Name: { type: 'text' }, p4Price: { type: 'text' }, p4OriginalPrice: { type: 'text' }, p4Badge: { type: 'text' }, p4Img: { type: 'text' },
        p5Name: { type: 'text' }, p5Price: { type: 'text' }, p5OriginalPrice: { type: 'text' }, p5Badge: { type: 'text' }, p5Img: { type: 'text' },
        p6Name: { type: 'text' }, p6Price: { type: 'text' }, p6OriginalPrice: { type: 'text' }, p6Badge: { type: 'text' }, p6Img: { type: 'text' },
        p7Name: { type: 'text' }, p7Price: { type: 'text' }, p7OriginalPrice: { type: 'text' }, p7Badge: { type: 'text' }, p7Img: { type: 'text' },
        p8Name: { type: 'text' }, p8Price: { type: 'text' }, p8OriginalPrice: { type: 'text' }, p8Badge: { type: 'text' }, p8Img: { type: 'text' }
      },
      defaultProps: {
        title: 'Full Storefront Product Catalog',
        subtitle: 'Browse all 24 curated goods with real-time stock availability and express dispatch.',
        p1Name: 'Aura Studio Wireless Headphones Pro', p1Price: '$349.00', p1OriginalPrice: '$420.00', p1Badge: 'BESTSELLER', p1Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
        p2Name: 'Nordic Ash Lounge Chair', p2Price: '$490.00', p2OriginalPrice: '$580.00', p2Badge: 'HANDCRAFTED', p2Img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80',
        p3Name: 'Minimalist Chronograph Watch', p3Price: '$189.00', p3OriginalPrice: '$230.00', p3Badge: 'HOT DEAL', p3Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        p4Name: 'Precision Desktop Audio Node', p4Price: '$279.00', p4OriginalPrice: '$340.00', p4Badge: 'NEW', p4Img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        p5Name: 'Beryllium Driver Studio Monitors', p5Price: '$590.00', p5OriginalPrice: '$690.00', p5Badge: 'STUDIO SPEC', p5Img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop&q=80',
        p6Name: 'Italian Lambskin Carry Case', p6Price: '$129.00', p6OriginalPrice: '$160.00', p6Badge: 'BESPOKE', p6Img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80',
        p7Name: 'Minimalist Matte Ceramic Vase', p7Price: '$89.00', p7OriginalPrice: '$110.00', p7Badge: 'POPULAR', p7Img: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=900&auto=format&fit=crop&q=80',
        p8Name: 'Anodized Titanium Fountain Pen', p8Price: '$95.00', p8OriginalPrice: '$125.00', p8Badge: 'LIMITED', p8Img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=900&auto=format&fit=crop&q=80'
      },
      render: ({ title, subtitle, p1Name, p1Price, p1OriginalPrice, p1Badge, p1Img, p2Name, p2Price, p2OriginalPrice, p2Badge, p2Img, p3Name, p3Price, p3OriginalPrice, p3Badge, p3Img, p4Name, p4Price, p4OriginalPrice, p4Badge, p4Img, p5Name, p5Price, p5OriginalPrice, p5Badge, p5Img, p6Name, p6Price, p6OriginalPrice, p6Badge, p6Img, p7Name, p7Price, p7OriginalPrice, p7Badge, p7Img, p8Name, p8Price, p8OriginalPrice, p8Badge, p8Img }) => {
        const items = [
          { name: p1Name, price: p1Price, original: p1OriginalPrice, badge: p1Badge, img: p1Img },
          { name: p2Name, price: p2Price, original: p2OriginalPrice, badge: p2Badge, img: p2Img },
          { name: p3Name, price: p3Price, original: p3OriginalPrice, badge: p3Badge, img: p3Img },
          { name: p4Name, price: p4Price, original: p4OriginalPrice, badge: p4Badge, img: p4Img },
          { name: p5Name, price: p5Price, original: p5OriginalPrice, badge: p5Badge, img: p5Img },
          { name: p6Name, price: p6Price, original: p6OriginalPrice, badge: p6Badge, img: p6Img },
          { name: p7Name, price: p7Price, original: p7OriginalPrice, badge: p7Badge, img: p7Img },
          { name: p8Name, price: p8Price, original: p8OriginalPrice, badge: p8Badge, img: p8Img }
        ]
        return (
          <section className="py-16 px-6 font-sans text-left bg-[#090a0f] text-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">[FULL STORE CATALOG]</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{title}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, i) => (
                  <div key={i} className="group rounded-none bg-[#0a0b12] border border-white/10 p-4 space-y-3 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative overflow-hidden border border-white/10 aspect-square">
                        {item.badge && (
                          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-black/80 text-cyan-300 text-[9px] font-mono font-bold uppercase rounded-none border border-white/20 backdrop-blur-sm">
                            {item.badge}
                          </span>
                        )}
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <strong className="text-cyan-400 font-bold">{item.price}</strong>
                          {item.original && <span className="line-through text-slate-500 text-[11px]">{item.original}</span>}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                          </div>
                          <span className="font-mono text-slate-500">(4.9)</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2.5 bg-white text-slate-950 font-extrabold text-[11px] uppercase rounded-none hover:bg-slate-200 transition-colors mt-2">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }
    },

    // 14. ATOMIC UI ELEMENTS
    BadgePillDot: {
      fields: { text: { type: 'text' }, variant: { type: 'select', options: [{ label: 'Cyan', value: 'cyan' }, { label: 'Purple', value: 'purple' }, { label: 'Emerald', value: 'emerald' }, { label: 'Amber', value: 'amber' }] } },
      defaultProps: { text: '● SYSTEM OPERATIONAL', variant: 'emerald' },
      render: ({ text }) => (
        <div className="py-2 inline-block">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {text}
          </span>
        </div>
      )
    },

    GradientCardWrapper: {
      fields: { title: { type: 'text' }, description: { type: 'textarea' }, gradientPreset: { type: 'select', options: [{ label: 'Cyan Blue', value: 'cyan-blue' }, { label: 'Purple Cyan', value: 'purple-cyan' }, { label: 'Emerald Teal', value: 'emerald-teal' }] } },
      defaultProps: { title: 'High-Density Compute Node', description: 'Dedicated bare-metal server instance with GPU acceleration and 10Gbps unmetered uplink.', gradientPreset: 'cyan-blue' },
      render: ({ title, description }) => (
        <div className="p-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 my-6 font-sans">
          <div className="p-8 rounded-[22px] bg-[#090a10] text-left">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{description}</p>
          </div>
        </div>
      )
    },

    AvatarGroupStack: {
      fields: { title: { type: 'text' }, countText: { type: 'text' } },
      defaultProps: { title: 'Trusted by 2,500+ Engineers', countText: '+2,480 Active Teams' },
      render: ({ title, countText }) => (
        <div className="py-4 flex items-center gap-4 font-sans inline-flex">
          <div className="flex -space-x-3">
            <img className="w-8 h-8 rounded-full border-2 border-[#090a0f]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar 1" />
            <img className="w-8 h-8 rounded-full border-2 border-[#090a0f]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar 2" />
            <img className="w-8 h-8 rounded-full border-2 border-[#090a0f]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Avatar 3" />
          </div>
          <div className="text-left text-xs">
            <p className="font-bold text-white">{title}</p>
            <p className="text-[10px] text-cyan-400 font-mono">{countText}</p>
          </div>
        </div>
      )
    },

    RatingStarsBar: {
      fields: { score: { type: 'text' }, reviewCount: { type: 'text' }, label: { type: 'text' } },
      defaultProps: { score: '4.9/5.0', reviewCount: '1,240 Reviews', label: 'ENTERPRISE RATING' },
      render: ({ score, reviewCount }) => (
        <div className="py-3 inline-flex items-center gap-3 font-sans px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-white">{score}</span>
          <span className="text-[10px] font-mono text-slate-400">({reviewCount})</span>
        </div>
      )
    },

    // 15. LUXURY REAL ESTATE & ESTATES
    EstateHeroParallaxSlider: {
      fields: { title: { type: 'text' }, subtitle: { type: 'text' }, price: { type: 'text' }, location: { type: 'text' }, heroImg: { type: 'text' } },
      defaultProps: {
        title: 'The Glass Pavilion at Crestview Estates',
        subtitle: 'ARCHITECTURAL RESIDENCE VOL. IX',
        price: '$18,500,000',
        location: 'Beverly Hills, California',
        heroImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80'
      },
      render: ({ title, subtitle, price, location, heroImg }) => (
        <section className="relative h-[85vh] w-full font-serif overflow-hidden">
          <img src={heroImg} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-12 left-8 right-8 max-w-6xl mx-auto text-left text-white flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase text-amber-300 block mb-2">{subtitle}</span>
              <h1 className="text-3xl sm:text-6xl font-light leading-tight">{title}</h1>
              <p className="font-sans text-xs text-slate-300 mt-2">📍 {location}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-sans text-xs text-amber-300 uppercase tracking-widest block font-mono">OFFERED AT</span>
              <p className="font-mono text-3xl sm:text-5xl font-light text-white">{price}</p>
            </div>
          </div>
        </section>
      )
    },

    EstateSpecsGrid3: {
      fields: { title: { type: 'text' }, sqft: { type: 'text' }, lotSize: { type: 'text' }, yearBuilt: { type: 'text' }, architect: { type: 'text' } },
      defaultProps: { title: 'Architectural Specifications', sqft: '14,200 SQ FT', lotSize: '2.4 ACRES', yearBuilt: '2025', architect: 'Foster & Partners' },
      render: ({ title, sqft, lotSize, yearBuilt, architect }) => (
        <section className="py-16 px-6 font-serif max-w-5xl mx-auto border-b border-white/10">
          <h2 className="text-xl text-amber-200 font-light mb-8 text-left uppercase tracking-widest">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] text-amber-400/80 block uppercase">INTERIOR SPACE</span>
              <p className="font-sans text-xl font-bold text-white mt-1">{sqft}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] text-amber-400/80 block uppercase">GROUND LOT</span>
              <p className="font-sans text-xl font-bold text-white mt-1">{lotSize}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] text-amber-400/80 block uppercase">COMPLETION</span>
              <p className="font-sans text-xl font-bold text-white mt-1">{yearBuilt}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] text-amber-400/80 block uppercase">DESIGN STUDIO</span>
              <p className="font-sans text-sm font-bold text-white mt-1.5">{architect}</p>
            </div>
          </div>
        </section>
      )
    },

    EstateFloorplanViewer: {
      fields: { title: { type: 'text' }, level1Name: { type: 'text' }, level1Size: { type: 'text' }, level2Name: { type: 'text' }, level2Size: { type: 'text' } },
      defaultProps: { title: 'Estate Footprint & Floorplan Layout', level1Name: 'Ground Level & Grand Salon', level1Size: '8,400 Sq Ft', level2Name: 'Upper Penthouse Suite', level2Size: '5,800 Sq Ft' },
      render: ({ title, level1Name, level1Size, level2Name, level2Size }) => (
        <section className="py-16 px-6 font-serif max-w-5xl mx-auto">
          <h2 className="text-2xl text-white font-light mb-8 text-left">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-sans">
            <div className="p-6 rounded-2xl bg-[#090a10] border border-amber-500/30">
              <span className="font-mono text-xs text-amber-400">FLOOR 01</span>
              <h3 className="text-lg font-bold text-white mt-1">{level1Name}</h3>
              <p className="text-xs text-slate-400">{level1Size}</p>
              <div className="mt-4 aspect-video rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xs font-mono text-slate-500">
                [SVG FLOORPLAN FOOTPRINT VIEW 01]
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#090a10] border border-amber-500/30">
              <span className="font-mono text-xs text-amber-400">FLOOR 02</span>
              <h3 className="text-lg font-bold text-white mt-1">{level2Name}</h3>
              <p className="text-xs text-slate-400">{level2Size}</p>
              <div className="mt-4 aspect-video rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xs font-mono text-slate-500">
                [SVG FLOORPLAN FOOTPRINT VIEW 02]
              </div>
            </div>
          </div>
        </section>
      )
    },

    EstateAmenitiesGrid: {
      fields: { title: { type: 'text' }, amenity1: { type: 'text' }, amenity2: { type: 'text' }, amenity3: { type: 'text' }, amenity4: { type: 'text' } },
      defaultProps: { title: 'Bespoke Private Amenities', amenity1: 'Infinity Lap Pool & Spa', amenity2: 'Temperature-Controlled Wine Cellar', amenity3: 'Private Rooftop Helipad', amenity4: 'Dolby Atmos Screening Room' },
      render: ({ title, amenity1, amenity2, amenity3, amenity4 }) => (
        <section className="py-16 px-6 font-serif max-w-5xl mx-auto text-left">
          <h2 className="text-2xl text-white font-light mb-8">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 text-lg">✦</span>
              <h3 className="text-sm font-bold text-white mt-2">{amenity1}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 text-lg">✦</span>
              <h3 className="text-sm font-bold text-white mt-2">{amenity2}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 text-lg">✦</span>
              <h3 className="text-sm font-bold text-white mt-2">{amenity3}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 text-lg">✦</span>
              <h3 className="text-sm font-bold text-white mt-2">{amenity4}</h3>
            </div>
          </div>
        </section>
      )
    },

    // 16. CYBERPUNK & SCI-FI DARK VOID
    CyberpunkTerminalHero: {
      fields: { title: { type: 'text' }, subtext: { type: 'text' }, promptCmd: { type: 'text' }, sysStatus: { type: 'text' } },
      defaultProps: { title: 'SYSTEM OVERRIDE // NODE 09', subtext: 'Autonomous Matrix Protocol Active', promptCmd: 'nextflow init --cyberpunk-v2', sysStatus: 'ONLINE / ENCRYPTED' },
      render: ({ title, subtext, promptCmd, sysStatus }) => (
        <section className="py-20 px-6 font-mono text-left bg-black text-emerald-400 border-y border-emerald-500/40">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-emerald-600 border-b border-emerald-900 pb-2">
              <span>SYS_MONITOR // V2.04</span>
              <span>[ STATUS: {sysStatus} ]</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black text-emerald-400 tracking-wider animate-pulse">{title}</h1>
            <p className="text-sm text-emerald-300/80">{subtext}</p>
            <div className="p-4 rounded bg-emerald-950/40 border border-emerald-500/50 text-xs">
              <span className="text-emerald-300">$ {promptCmd}</span>
            </div>
          </div>
        </section>
      )
    },

    CyberpunkBentoMatrix: {
      fields: { title: { type: 'text' }, b1Title: { type: 'text' }, b1Text: { type: 'text' }, b2Title: { type: 'text' }, b2Text: { type: 'text' }, b3Title: { type: 'text' }, b3Text: { type: 'text' } },
      defaultProps: { title: 'CYBER MATRIX MODULES', b1Title: 'NEURAL LINK BUS', b1Text: '100Gbps optic link', b2Title: 'QUANTUM HSM ENCRYPTION', b2Text: '2048-bit RSA keys', b3Title: 'AUTONOMOUS AGENTS', b3Text: 'Self-healing cluster' },
      render: ({ title, b1Title, b1Text, b2Title, b2Text, b3Title, b3Text }) => (
        <section className="py-16 px-6 font-mono text-left">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-widest">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded bg-emerald-950/20 border border-emerald-500/40 hover:bg-emerald-950/40 transition-colors">
                <span className="text-[10px] text-emerald-600">NODE_01</span>
                <h3 className="text-base font-bold text-emerald-300 mt-1">{b1Title}</h3>
                <p className="text-xs text-emerald-400/70 mt-2">{b1Text}</p>
              </div>
              <div className="p-5 rounded bg-purple-950/20 border border-purple-500/40 hover:bg-purple-950/40 transition-colors">
                <span className="text-[10px] text-purple-600">NODE_02</span>
                <h3 className="text-base font-bold text-purple-300 mt-1">{b2Title}</h3>
                <p className="text-xs text-purple-400/70 mt-2">{b2Text}</p>
              </div>
              <div className="p-5 rounded bg-cyan-950/20 border border-cyan-500/40 hover:bg-cyan-950/40 transition-colors">
                <span className="text-[10px] text-cyan-600">NODE_03</span>
                <h3 className="text-base font-bold text-cyan-300 mt-1">{b3Title}</h3>
                <p className="text-xs text-cyan-400/70 mt-2">{b3Text}</p>
              </div>
            </div>
          </div>
        </section>
      )
    },

    CyberpunkMetricsBox: {
      fields: { label: { type: 'text' }, value: { type: 'text' }, scanCode: { type: 'text' } },
      defaultProps: { label: 'LATENCY TELEMETRY', value: '0.004 MS', scanCode: '0x88F9A' },
      render: ({ label, value, scanCode }) => (
        <div className="py-4 inline-block font-mono text-left">
          <div className="p-4 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-400">
            <span className="text-[10px] text-emerald-600 block">{label} // {scanCode}</span>
            <p className="text-3xl font-black mt-1 text-emerald-300">{value}</p>
          </div>
        </div>
      )
    },

    CyberpunkFooterMono: {
      fields: { brandText: { type: 'text' }, sysLog: { type: 'text' }, copyrightText: { type: 'text' } },
      defaultProps: { brandText: 'NEXTFLOW CYBERPUNK LABS', sysLog: 'ALL CLUSTERS OPERATIONAL // 0 ERRORS REPORTED', copyrightText: '© 2026 NEXTFLOW CYBERPUNK' },
      render: ({ brandText, sysLog, copyrightText }) => (
        <footer className="py-12 px-6 font-mono text-left border-t border-emerald-500/30 bg-black text-emerald-500 text-xs">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-emerald-400">{brandText}</p>
              <p className="text-[10px] text-emerald-700 mt-1">{sysLog}</p>
            </div>
            <span className="text-[10px] text-emerald-800">{copyrightText}</span>
          </div>
        </footer>
      )
    },

    // 17. NEUMORPHISM & SOFT UI
    NeumorphicHeroCard: {
      fields: { badge: { type: 'text' }, title: { type: 'text' }, description: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { badge: 'SOFT UI EXPERIENCE', title: 'Tactile Interfaces Built for Comfort', description: 'Soft extruded surfaces with organic shadows that mimic real physical buttons.', ctaText: 'Touch Experience' },
      render: ({ badge, title, description, ctaText }) => (
        <section className="py-20 px-6 font-sans">
          <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-[#1e2029] shadow-[15px_15px_30px_#14151b,-15px_-15px_30px_#282b37] text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1e2029] text-cyan-400 shadow-[inset_3px_3px_6px_#14151b,inset_-3px_-3px_6px_#282b37]">{badge}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">{title}</h1>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">{description}</p>
            <button className="mt-8 px-8 py-3.5 rounded-2xl bg-[#1e2029] text-cyan-400 font-bold text-xs uppercase shadow-[8px_8px_16px_#14151b,-8px_-8px_16px_#282b37] hover:shadow-[inset_4px_4px_8px_#14151b,inset_-4px_-4px_8px_#282b37] transition-all">
              {ctaText}
            </button>
          </div>
        </section>
      )
    },

    NeumorphicFeatureToggle: {
      fields: { title: { type: 'text' }, f1Title: { type: 'text' }, f2Title: { type: 'text' }, f3Title: { type: 'text' } },
      defaultProps: { title: 'Soft UI Tactile Modules', f1Title: 'Haptic Feedback', f2Title: 'Adaptive Lighting', f3Title: 'Depth Perception' },
      render: ({ title, f1Title, f2Title, f3Title }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-4xl mx-auto text-left">
            <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#1e2029] shadow-[10px_10px_20px_#14151b,-10px_-10px_20px_#282b37]">
                <h3 className="text-base font-bold text-white">{f1Title}</h3>
              </div>
              <div className="p-6 rounded-2xl bg-[#1e2029] shadow-[10px_10px_20px_#14151b,-10px_-10px_20px_#282b37]">
                <h3 className="text-base font-bold text-white">{f2Title}</h3>
              </div>
              <div className="p-6 rounded-2xl bg-[#1e2029] shadow-[10px_10px_20px_#14151b,-10px_-10px_20px_#282b37]">
                <h3 className="text-base font-bold text-white">{f3Title}</h3>
              </div>
            </div>
          </div>
        </section>
      )
    },

    NeumorphicPricingCard: {
      fields: { planName: { type: 'text' }, price: { type: 'text' }, period: { type: 'text' }, buttonText: { type: 'text' } },
      defaultProps: { planName: 'Tactile Pro Plan', price: '$79', period: '/month', buttonText: 'Select Pro Plan' },
      render: ({ planName, price, period, buttonText }) => (
        <section className="py-12 px-6 font-sans">
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#1e2029] shadow-[15px_15px_30px_#14151b,-15px_-15px_30px_#282b37] text-center">
            <h3 className="text-xl font-bold text-white">{planName}</h3>
            <p className="text-4xl font-black text-cyan-400 my-4">{price}<span className="text-xs text-slate-400 font-normal">{period}</span></p>
            <button className="w-full py-3.5 rounded-2xl bg-[#1e2029] text-white font-bold text-xs uppercase shadow-[8px_8px_16px_#14151b,-8px_-8px_16px_#282b37]">
              {buttonText}
            </button>
          </div>
        </section>
      )
    },

    // 18. BRUTALIST & RAW PRINT
    BrutalistMonoHeader: {
      fields: { headline: { type: 'text' }, subheadline: { type: 'text' }, tagText: { type: 'text' } },
      defaultProps: { headline: 'RAW UNFILTERED CODE', subheadline: 'NO GRADIENTS. NO SHADOWS. PURE FUNCTION.', tagText: 'BRUTALIST VOL. 01' },
      render: ({ headline, subheadline, tagText }) => (
        <section className="py-20 px-6 font-mono text-left bg-yellow-400 text-black border-y-4 border-black">
          <div className="max-w-5xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-black text-yellow-400 text-xs font-black uppercase">{tagText}</span>
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-none">{headline}</h1>
            <p className="text-sm font-bold tracking-widest">{subheadline}</p>
          </div>
        </section>
      )
    },

    BrutalistBentoBox: {
      fields: { title: { type: 'text' }, box1Title: { type: 'text' }, box2Title: { type: 'text' }, box3Title: { type: 'text' } },
      defaultProps: { title: 'RAW COMPONENTS', box1Title: '01 / SYSTEM KERNEL', box2Title: '02 / MEMORY BUFFER', box3Title: '03 / DATA STREAM' },
      render: ({ title, box1Title, box2Title, box3Title }) => (
        <section className="py-16 px-6 font-mono text-left bg-white text-black">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black uppercase mb-8 underline decoration-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border-4 border-black bg-yellow-300 shadow-[8px_8px_0px_#000]">
                <h3 className="text-lg font-black">{box1Title}</h3>
              </div>
              <div className="p-6 border-4 border-black bg-cyan-300 shadow-[8px_8px_0px_#000]">
                <h3 className="text-lg font-black">{box2Title}</h3>
              </div>
              <div className="p-6 border-4 border-black bg-rose-300 shadow-[8px_8px_0px_#000]">
                <h3 className="text-lg font-black">{box3Title}</h3>
              </div>
            </div>
          </div>
        </section>
      )
    },

    BrutalistCalloutBanner: {
      fields: { warningTitle: { type: 'text' }, bannerText: { type: 'text' }, actionText: { type: 'text' } },
      defaultProps: { warningTitle: 'CRITICAL SYSTEM NOTICE', bannerText: 'HIGH DENSITY MEMORY ALLOCATION DETECTED', actionText: 'ACKNOWLEDGE' },
      render: ({ warningTitle, bannerText, actionText }) => (
        <section className="py-8 px-6 font-mono text-left">
          <div className="max-w-4xl mx-auto p-6 bg-black border-4 border-yellow-400 text-yellow-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[8px_8px_0px_#eab308]">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-rose-500">⚠ {warningTitle}</span>
              <p className="text-base font-extrabold mt-1">{bannerText}</p>
            </div>
            <button className="px-6 py-3 bg-yellow-400 text-black font-black text-xs uppercase border-2 border-black hover:bg-yellow-300 transition-colors">
              {actionText}
            </button>
          </div>
        </section>
      )
    },

    // 19. GLASSMORPHISM & FROST
    GlassmorphicHeroSphere: {
      fields: { title: { type: 'text' }, description: { type: 'text' }, badge: { type: 'text' }, heroImg: { type: 'text' } },
      defaultProps: { badge: '✨ FROSTED GLASS 2026', title: 'Translucent Horizons & Floating Glass', description: 'Deep frosted blur layers over organic gradient glow spheres.', heroImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
      render: ({ badge, title, description }) => (
        <section className="py-24 px-6 font-sans relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-500 to-purple-600 blur-[120px] rounded-full pointer-events-none opacity-60" />
          <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-center relative z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-cyan-300 border border-white/20">{badge}</span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-4">{title}</h1>
            <p className="text-sm text-slate-200 mt-3">{description}</p>
          </div>
        </section>
      )
    },

    GlassmorphicFeatureGrid: {
      fields: { title: { type: 'text' }, card1Title: { type: 'text' }, card2Title: { type: 'text' }, card3Title: { type: 'text' } },
      defaultProps: { title: 'Glass Architecture Modules', card1Title: 'Refractive Blur Engine', card2Title: 'Ambient Light Pass', card3Title: 'Multi-Depth Stacking' },
      render: ({ title, card1Title, card2Title, card3Title }) => (
        <section className="py-16 px-6 font-sans">
          <div className="max-w-5xl mx-auto text-left">
            <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15">
                <h3 className="text-lg font-bold text-white">{card1Title}</h3>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15">
                <h3 className="text-lg font-bold text-white">{card2Title}</h3>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15">
                <h3 className="text-lg font-bold text-white">{card3Title}</h3>
              </div>
            </div>
          </div>
        </section>
      )
    },

    GlassmorphicNavbarPill: {
      fields: { brandName: { type: 'text' }, link1: { type: 'text' }, link2: { type: 'text' }, ctaText: { type: 'text' } },
      defaultProps: { brandName: 'FROST UI', link1: 'Solutions', link2: 'Specs', ctaText: 'Launch App' },
      render: ({ brandName, link1, link2, ctaText }) => (
        <nav className="py-4 px-6 font-sans">
          <div className="max-w-3xl mx-auto p-3 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-between">
            <span className="font-extrabold text-white text-sm ml-3">{brandName}</span>
            <div className="flex gap-6 text-xs text-slate-300 font-bold">
              <span>{link1}</span>
              <span>{link2}</span>
            </div>
            <button className="px-5 py-2 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase">{ctaText}</button>
          </div>
        </nav>
      )
    },

    // 20. ENTERPRISE FINTECH & SWISS DATA
    SwissGridHero: {
      fields: { headline: { type: 'text' }, description: { type: 'text' }, stat1Value: { type: 'text' }, stat1Label: { type: 'text' } },
      defaultProps: { headline: 'PRECISION FINTECH INFRASTRUCTURE', description: 'Architected according to strict Swiss modular grid principles.', stat1Value: '$4.2B+', stat1Label: 'DAILY SETTLEMENT VOLUME' },
      render: ({ headline, description, stat1Value, stat1Label }) => (
        <section className="py-24 px-6 font-sans text-left max-w-6xl mx-auto border-b border-white/15">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <span className="font-mono text-xs text-cyan-400 font-bold tracking-widest block mb-2">SWISS DESIGN SYSTEM</span>
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">{headline}</h1>
              <p className="text-slate-400 text-sm mt-4">{description}</p>
            </div>
            <div className="md:col-span-4 border-l border-white/15 pl-6">
              <p className="font-mono text-4xl sm:text-5xl font-black text-white">{stat1Value}</p>
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mt-1">{stat1Label}</span>
            </div>
          </div>
        </section>
      )
    },

    FintechMetricChartBox: {
      fields: { assetPair: { type: 'text' }, price: { type: 'text' }, changePercent: { type: 'text' }, volume24h: { type: 'text' } },
      defaultProps: { assetPair: 'BTC / USD', price: '$94,250.00', changePercent: '+4.82%', volume24h: '$12.4B' },
      render: ({ assetPair, price, changePercent, volume24h }) => (
        <div className="py-4 inline-block font-mono text-left">
          <div className="p-6 rounded-2xl bg-[#090a10] border border-emerald-500/30 min-w-[280px]">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-bold text-white">{assetPair}</span>
              <span className="text-emerald-400 font-bold">{changePercent}</span>
            </div>
            <p className="text-3xl font-black text-white mt-2">{price}</p>
            <span className="text-[10px] text-slate-500 block mt-2">24H VOL: {volume24h}</span>
          </div>
        </div>
      )
    },

    FintechComplianceBadgeRow: {
      fields: { title: { type: 'text' }, badge1: { type: 'text' }, badge2: { type: 'text' }, badge3: { type: 'text' }, badge4: { type: 'text' } },
      defaultProps: { title: 'ENTERPRISE SECURITY COMPLIANCE', badge1: 'SOC2 TYPE II', badge2: 'ISO 27001', badge3: 'HIPAA READY', badge4: 'GDPR COMPLIANT' },
      render: ({ title, badge1, badge2, badge3, badge4 }) => (
        <section className="py-12 px-6 font-mono text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest block mb-4">{title}</span>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-cyan-300">{badge1}</span>
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-purple-300">{badge2}</span>
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-emerald-300">{badge3}</span>
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-amber-300">{badge4}</span>
          </div>
        </section>
      )
    },

    // 21. MOBILE-FIRST APP SHOWCASE
    AppStoreHeroMockup: {
      fields: { title: { type: 'text' }, tagline: { type: 'text' }, appStoreUrl: { type: 'text' }, playStoreUrl: { type: 'text' }, mockupImg: { type: 'text' } },
      defaultProps: { title: 'Nextflow Mobile Companion', tagline: 'Manage high-density telemetry from your pocket', appStoreUrl: '#', playStoreUrl: '#', mockupImg: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80' },
      render: ({ title, tagline, mockupImg }) => (
        <section className="py-20 px-6 font-sans">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center text-left">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold">MOBILE APP V3.0</span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{title}</h1>
              <p className="text-sm text-slate-300">{tagline}</p>
            </div>
            <div className="flex justify-center">
              <img src={mockupImg} alt={title} className="w-64 rounded-[40px] border-4 border-slate-700 shadow-2xl" />
            </div>
          </div>
        </section>
      )
    },

    AppFeatureCarousel: {
      fields: { title: { type: 'text' }, f1Title: { type: 'text' }, f1Desc: { type: 'text' }, f2Title: { type: 'text' }, f2Desc: { type: 'text' } },
      defaultProps: { title: 'Mobile Features', f1Title: 'Push Notifications', f1Desc: 'Instant alert dispatch', f2Title: 'Biometric Auth', f2Desc: 'FaceID authentication' },
      render: ({ title, f1Title, f1Desc, f2Title, f2Desc }) => (
        <section className="py-12 px-6 font-sans text-left max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#090a10] border border-white/10">
              <h3 className="text-base font-bold text-white">{f1Title}</h3>
              <p className="text-xs text-slate-400 mt-1">{f1Desc}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#090a10] border border-white/10">
              <h3 className="text-base font-bold text-white">{f2Title}</h3>
              <p className="text-xs text-slate-400 mt-1">{f2Desc}</p>
            </div>
          </div>
        </section>
      )
    },

    AppQrDownloadBanner: {
      fields: { title: { type: 'text' }, qrText: { type: 'text' }, scanSubtext: { type: 'text' } },
      defaultProps: { title: 'Scan to Download Mobile App', qrText: '[ QR CODE SCANNER ]', scanSubtext: 'Compatible with iOS 18+ and Android 15+' },
      render: ({ title, qrText, scanSubtext }) => (
        <section className="py-12 px-6 font-sans">
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#0a0b12] border border-cyan-500/30 flex items-center gap-6 text-left">
            <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center font-mono text-[9px] text-cyan-300 shrink-0">
              {qrText}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 mt-1">{scanSubtext}</p>
            </div>
          </div>
        </section>
      )
    },

    // 22. EVENTS, KEYNOTES & CONFERENCES
    EventConferenceHero: {
      fields: { eventName: { type: 'text' }, dateVenue: { type: 'text' }, countdownText: { type: 'text' }, registerUrl: { type: 'text' } },
      defaultProps: { eventName: 'NEXTFLOW TECH SUMMIT 2026', dateVenue: 'OCTOBER 24-26 • TOKYO INTERNATIONAL FORUM', countdownText: 'STARTS IN: 42 DAYS 14 HOURS', registerUrl: '#' },
      render: ({ eventName, dateVenue, countdownText }) => (
        <section className="py-20 px-6 font-sans text-center bg-gradient-to-b from-[#090a10] to-[#121422] border-y border-white/10">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">{dateVenue}</span>
          <h1 className="text-3xl sm:text-6xl font-black text-white mt-4">{eventName}</h1>
          <p className="font-mono text-xs text-slate-400 mt-4">{countdownText}</p>
        </section>
      )
    },

    EventSpeakerGrid: {
      fields: { title: { type: 'text' }, s1Name: { type: 'text' }, s1Role: { type: 'text' }, s2Name: { type: 'text' }, s2Role: { type: 'text' } },
      defaultProps: { title: 'Featured Keynote Speakers', s1Name: 'Elena Rostova', s1Role: 'VP of Engineering, Lumina', s2Name: 'Kenji Sato', s2Role: 'Founder, Tokyo AI Lab' },
      render: ({ title, s1Name, s1Role, s2Name, s2Role }) => (
        <section className="py-16 px-6 font-sans text-left max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#090a10] border border-white/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">{s1Name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{s1Role}</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-[#090a10] border border-white/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">{s2Name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{s2Role}</p>
              </div>
            </div>
          </div>
        </section>
      )
    },

    EventScheduleTimeline: {
      fields: { title: { type: 'text' }, slot1Time: { type: 'text' }, slot1Title: { type: 'text' }, slot2Time: { type: 'text' }, slot2Title: { type: 'text' } },
      defaultProps: { title: 'Summit Track Schedule', slot1Time: '09:00 AM', slot1Title: 'Keynote: The Future of Autonomous Systems', slot2Time: '11:00 AM', slot2Title: 'Workshop: High-Density Telemetry Ingestion' },
      render: ({ title, slot1Time, slot1Title, slot2Time, slot2Title }) => (
        <section className="py-12 px-6 font-sans text-left max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 items-center">
              <span className="font-mono text-xs text-cyan-400 font-bold">{slot1Time}</span>
              <h3 className="text-sm font-bold text-white">{slot1Title}</h3>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 items-center">
              <span className="font-mono text-xs text-cyan-400 font-bold">{slot2Time}</span>
              <h3 className="text-sm font-bold text-white">{slot2Title}</h3>
            </div>
          </div>
        </section>
      )
    },

    // 23. ACADEMY & E-LEARNING
    AcademyCourseHero: {
      fields: { courseTitle: { type: 'text' }, instructor: { type: 'text' }, rating: { type: 'text' }, enrollPrice: { type: 'text' } },
      defaultProps: { courseTitle: 'Mastering High-Frequency Next.js Architectures', instructor: 'Dr. Alex Vance', rating: '4.9 / 5.0 Rating (1.4k reviews)', enrollPrice: '$199' },
      render: ({ courseTitle, instructor, rating, enrollPrice }) => (
        <section className="py-20 px-6 font-sans text-left max-w-5xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold">NEXTFLOW ACADEMY</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">{courseTitle}</h1>
          <p className="text-xs text-slate-400 mt-2">Instructor: {instructor} • {rating}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-black text-white font-mono">{enrollPrice}</span>
            <button className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase">Enroll Course</button>
          </div>
        </section>
      )
    },

    AcademySyllabusAccordion: {
      fields: { title: { type: 'text' }, m1Title: { type: 'text' }, m1Duration: { type: 'text' }, m2Title: { type: 'text' }, m2Duration: { type: 'text' } },
      defaultProps: { title: 'Course Syllabus Breakdown', m1Title: 'Module 01: Micro-Frontend Ingestion', m1Duration: '2.5 Hours', m2Title: 'Module 02: Supabase RLS Multi-Tenancy', m2Duration: '3.0 Hours' },
      render: ({ title, m1Title, m1Duration, m2Title, m2Duration }) => (
        <section className="py-12 px-6 font-sans text-left max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#090a10] border border-white/10 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">{m1Title}</h3>
              <span className="font-mono text-xs text-slate-400">{m1Duration}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#090a10] border border-white/10 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">{m2Title}</h3>
              <span className="font-mono text-xs text-slate-400">{m2Duration}</span>
            </div>
          </div>
        </section>
      )
    },

    AcademyInstructorCard: {
      fields: { name: { type: 'text' }, title: { type: 'text' }, bio: { type: 'textarea' }, totalStudents: { type: 'text' } },
      defaultProps: { name: 'Dr. Alex Vance', title: 'Principal Systems Architect', bio: 'Former Lead Infrastructure Engineer at Vercel with 12+ years of distributed systems experience.', totalStudents: '14,200 Students' },
      render: ({ name, title, bio, totalStudents }) => (
        <section className="py-12 px-6 font-sans text-left max-w-3xl mx-auto">
          <div className="p-6 rounded-3xl bg-[#0a0b12] border border-cyan-500/30 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-xs text-cyan-400 font-mono">{title}</p>
              <p className="text-xs text-slate-300 mt-2">{bio}</p>
              <span className="text-[10px] font-mono text-slate-400 block mt-2 font-bold">{totalStudents}</span>
            </div>
          </div>
        </section>
      )
    },

    // 24. WEB3, CRYPTO & DAO
    Web3HeroConnect: {
      fields: { protocolName: { type: 'text' }, tvlValue: { type: 'text' }, tokenPrice: { type: 'text' }, connectText: { type: 'text' } },
      defaultProps: { protocolName: 'NEXTFLOW DECENTRALISED NODE NETWORK', tvlValue: '$142.8M TVL', tokenPrice: '$12.45 FX', connectText: 'Connect Web3 Wallet' },
      render: ({ protocolName, tvlValue, tokenPrice, connectText }) => (
        <section className="py-20 px-6 font-mono text-left max-w-5xl mx-auto border-y border-purple-500/30">
          <div className="flex items-center gap-4 text-xs text-purple-400 mb-2">
            <span>● MAINNET OPERATIONAL</span>
            <span>TVL: {tvlValue}</span>
            <span>TOKEN: {tokenPrice}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider">{protocolName}</h1>
          <button className="mt-6 px-8 py-3.5 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase hover:bg-purple-500 transition-colors">
            {connectText}
          </button>
        </section>
      )
    },

    Web3TokenomicsPie: {
      fields: { title: { type: 'text' }, communityPct: { type: 'text' }, treasuryPct: { type: 'text' }, teamPct: { type: 'text' } },
      defaultProps: { title: 'Protocol Tokenomics Allocation', communityPct: '60% Community DAO Pool', treasuryPct: '25% Ecosystem Treasury', teamPct: '15% Core Developers (4yr Vesting)' },
      render: ({ title, communityPct, treasuryPct, teamPct }) => (
        <section className="py-12 px-6 font-mono text-left max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-purple-400 mb-6">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40">
              <span className="text-xs text-purple-300 font-bold">{communityPct}</span>
            </div>
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <span className="text-xs text-cyan-300 font-bold">{treasuryPct}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 font-bold">{teamPct}</span>
            </div>
          </div>
        </section>
      )
    },

    Web3RoadmapNodes: {
      fields: { title: { type: 'text' }, phase1Title: { type: 'text' }, phase2Title: { type: 'text' }, phase3Title: { type: 'text' } },
      defaultProps: { title: 'Decentralization Roadmap', phase1Title: 'Phase 1: Testnet Launch', phase2Title: 'Phase 2: DAO Governance', phase3Title: 'Phase 3: Cross-Chain Bridge' },
      render: ({ title, phase1Title, phase2Title, phase3Title }) => (
        <section className="py-12 px-6 font-mono text-left max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/50">
              <span className="text-xs text-purple-300 font-bold">[COMPLETED] {phase1Title}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-300 font-bold">[IN PROGRESS] {phase2Title}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 font-bold">[PLANNED] {phase3Title}</span>
            </div>
          </div>
        </section>
      )
    },

    // 25. ECO & SUSTAINABILITY
    EcoHeroForest: {
      fields: { headline: { type: 'text' }, description: { type: 'text' }, carbonOffset: { type: 'text' } },
      defaultProps: { headline: 'Zero-Carbon Cloud Computing', description: 'Our data centers operate on 100% renewable geothermal & solar power.', carbonOffset: '14,800 TONNES CO2 OFFSET' },
      render: ({ headline, description, carbonOffset }) => (
        <section className="py-20 px-6 font-sans text-left max-w-5xl mx-auto bg-emerald-950/20 border-y border-emerald-500/30 rounded-3xl my-8">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">SUSTAINABILITY FIRST</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-4">{headline}</h1>
          <p className="text-sm text-emerald-200/80 mt-3">{description}</p>
          <span className="font-mono text-xs text-emerald-400 font-bold block mt-6">{carbonOffset}</span>
        </section>
      )
    },

    EcoImpactMetrics: {
      fields: { title: { type: 'text' }, treesPlanted: { type: 'text' }, co2Reduced: { type: 'text' }, cleanEnergyMwh: { type: 'text' } },
      defaultProps: { title: 'Verified ESG Impact Metrics', treesPlanted: '45,200', co2Reduced: '14.8k Tons', cleanEnergyMwh: '120 MWh' },
      render: ({ title, treesPlanted, co2Reduced, cleanEnergyMwh }) => (
        <section className="py-12 px-6 font-sans text-left max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-emerald-400 mb-6">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
              <span className="text-xs font-mono text-emerald-400 block">TREES PLANTED</span>
              <p className="text-3xl font-black text-white mt-1">{treesPlanted}</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
              <span className="text-xs font-mono text-emerald-400 block">CO2 REDUCED</span>
              <p className="text-3xl font-black text-white mt-1">{co2Reduced}</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
              <span className="text-xs font-mono text-emerald-400 block">CLEAN ENERGY</span>
              <p className="text-3xl font-black text-white mt-1">{cleanEnergyMwh}</p>
            </div>
          </div>
        </section>
      )
    },
  },
}

// HELPER: PARSE RAW INLINE CSS STRING TO REACT STYLE OBJECT
export function parseCustomCss(cssString?: string): React.CSSProperties {
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
