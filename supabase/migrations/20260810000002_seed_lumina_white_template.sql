-- Seed Lumina Luxury White Multi-Page Studio Template into website_templates
INSERT INTO public.website_templates (
  name,
  description,
  category,
  thumbnail_url,
  puck_data,
  global_css,
  is_active
) VALUES (
  'Lumina Architecture Studio',
  'Luxury minimalist white-theme multi-page website template featuring pure white aesthetics, serif typography, 4 full pages (Home, About Us, Services, Contact), and offline ZIP export support.',
  'Architecture & Design Studio',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  jsonb_build_object(
    'schema_version', 1,
    'active_page_id', 'lumina-home-page',
    'pages', jsonb_build_array(
      jsonb_build_object(
        'id', 'lumina-home-page',
        'name', 'Home',
        'slug', '/',
        'isHome', true,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Portfolio', 'link1Url', '/#portfolio', 'link2', 'Services', 'link2Url', '/services', 'ctaText', 'Inquire', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'hero-lumina', 'type', 'HeroMinimalSerif', 'props', jsonb_build_object('badge', 'MONOGRAPH 2026', 'headline', 'PURITY IN ARCHITECTURAL FORM', 'subheadline', 'Bespoke architectural design systems engineered with mathematical precision and natural light.', 'ctaText', 'EXPLORE ATELIER WORK', 'ctaUrl', '/services')),
            jsonb_build_object('id', 'portfolio-lumina', 'type', 'PortfolioMasonryGrid', 'props', jsonb_build_object('title', 'Selected Atelier Works', 'p1Title', 'Villa Aura Glass Residence', 'p1Img', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80', 'p2Title', 'Obsidian Minimalist Pavilion', 'p2Img', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80', 'p3Title', 'Kyoto Zen Sanctuary', 'p3Img', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80')),
            jsonb_build_object('id', 'bento-lumina', 'type', 'BentoAsymmetric4', 'props', jsonb_build_object('title', 'Architectural Philosophy & Principles', 'card1Title', 'Pure Light Palette', 'card1Desc', 'Pure white #ffffff background with high-contrast slate #0f172a typography.', 'card2Title', 'Sustainable Materials', 'card2Desc', 'Zero carbon footprint design and natural ventilation.', 'card3Title', 'Spatial Harmony', 'card3Desc', 'Proportional balance following golden ratio geometry.', 'card4Title', 'Sub-Millisecond Speed', 'card4Desc', 'Powered by Nextflow multi-page visual engine.')),
            jsonb_build_object('id', 'testimonial-lumina', 'type', 'TestimonialSingleHero', 'props', jsonb_build_object('quote', '"Lumina Atelier redefines modern minimalist architecture with absolute visual clarity and structural perfection."', 'authorName', 'Architectural Digest', 'authorRole', 'Issue 2026 Selection', 'companyLogo', 'AD')),
            jsonb_build_object('id', 'footer-lumina', 'type', 'FooterMinimalInline', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'copyrightText', '© 2026 Lumina Architecture Studio. All rights reserved.', 'link1', 'Documentation', 'link1Url', '/services', 'link2', 'Contact Atelier', 'link2Url', '/contact'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Lumina Architecture Studio - Home', 'bodyBackground', '#ffffff', 'bodyTextColor', '#0f172a', 'fontFamily', 'font-serif'))
        )
      ),
      jsonb_build_object(
        'id', 'lumina-about-page',
        'name', 'About Us',
        'slug', '/about',
        'isHome', false,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina-about', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Portfolio', 'link1Url', '/#portfolio', 'link2', 'Services', 'link2Url', '/services', 'ctaText', 'Inquire', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'hero-lumina-about', 'type', 'HeroMinimalistTypography', 'props', jsonb_build_object('badge', 'STUDIO CULTURE', 'mainHeading', 'PHILOSOPHY & CRAFTSMANSHIP', 'subhead', 'Founded in 2018, Lumina is a global design collective operating at the intersection of architecture, digital form, and structural engineering.', 'ctaText', 'VIEW STUDIO SPECS', 'ctaUrl', '/services')),
            jsonb_build_object('id', 'manifesto-lumina-about', 'type', 'FeatureListSplit', 'props', jsonb_build_object('badge', 'OUR MANIFESTO', 'title', 'Form Follows Purity', 'description', 'We eliminate all unnecessary ornamentation to reveal the intrinsic beauty of structural materials and natural light.', 'feature1Title', '01. Mathematical Ratio', 'feature1Desc', 'Strict adherence to golden ratio spatial proportion scales.', 'feature2Title', '02. Material Integrity', 'feature2Desc', 'Authentic stone, glass, and carbon structures.', 'feature3Title', '03. Digital Precision', 'feature3Desc', 'Integrated visual WebGL and Nextflow architecture.', 'cardImage', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80')),
            jsonb_build_object('id', 'stats-lumina-about', 'type', 'StatsCounterGrid', 'props', jsonb_build_object('stat1Value', '15+', 'stat1Label', 'Years Studio Heritage', 'stat2Value', '240+', 'stat2Label', 'Global Projects Built', 'stat3Value', '12', 'stat3Label', 'International Awards', 'stat4Value', '100%', 'stat4Label', 'Client Satisfaction')),
            jsonb_build_object('id', 'awards-lumina-about', 'type', 'PortfolioAwardBadges', 'props', jsonb_build_object('title', 'Accolades & Global Recognition', 'award1', 'Red Dot Best of Best 2026', 'award2', 'Awwwards Site of the Year', 'award3', 'Mies van der Rohe Nominee')),
            jsonb_build_object('id', 'footer-lumina-about', 'type', 'FooterMinimalInline', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'copyrightText', '© 2026 Lumina Architecture Studio.', 'link1', 'Services', 'link1Url', '/services', 'link2', 'Inquire', 'link2Url', '/contact'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'About Us | Lumina Architecture Studio', 'bodyBackground', '#f8fafc', 'bodyTextColor', '#0f172a', 'fontFamily', 'font-serif'))
        )
      ),
      jsonb_build_object(
        'id', 'lumina-services-page',
        'name', 'Services',
        'slug', '/services',
        'isHome', false,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina-services', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Home', 'link1Url', '/', 'link2', 'About Us', 'link2Url', '/about', 'ctaText', 'Inquire', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'hero-lumina-services', 'type', 'Hero', 'props', jsonb_build_object('badge', 'ATELIER SERVICES', 'title', 'Bespoke Architectural Engineering', 'gradientTitle', '& Interior Systems', 'description', 'End-to-end architectural design, 3D spatial modelling, and modern web presence integration.', 'primaryCta', 'Book Atelier Consultation', 'primaryUrl', '/contact', 'secondaryCta', 'View Pricing Matrix', 'secondaryUrl', '/services#pricing', 'align', 'center', 'themeStyle', 'glass', 'padding', 'standard')),
            jsonb_build_object('id', 'comparison-lumina-services', 'type', 'FeatureComparisonGrid', 'props', jsonb_build_object('title', 'Service Tiers & Deliverables', 'col1Name', 'Full Atelier Retainer', 'col2Name', 'Standard Concept', 'row1', '3D Spatial Modeling', 'row2', 'On-site Construction Supervision', 'row3', 'Custom Web & VR Presentation')),
            jsonb_build_object('id', 'pricing-lumina-services', 'type', 'PricingTable', 'props', jsonb_build_object('title', 'Atelier Engagement Tiers', 'subhead', 'Transparent retainer plans for residential and commercial developments.', 'proPrice', '$12,500', 'proFeatures', 'Concept Design, 3D Renderings, Material Specs, Web Portfolio', 'enterprisePrice', '$35,000', 'enterpriseFeatures', 'Full Architectural Blueprint, Construction Oversight, Dedicated Team, VR Walkthrough', 'highlightPro', true, 'padding', 'standard')),
            jsonb_build_object('id', 'calendar-lumina-services', 'type', 'CtaBookDemoCalendar', 'props', jsonb_build_object('title', 'Schedule a 1-on-1 Atelier Consultation', 'subhead', 'Discuss your architectural project vision with our principal partners.', 'calendarCta', 'Book 30-Min Consultation')),
            jsonb_build_object('id', 'footer-lumina-services', 'type', 'FooterMinimalInline', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'copyrightText', '© 2026 Lumina Architecture Studio.', 'link1', 'Home', 'link1Url', '/', 'link2', 'Contact', 'link2Url', '/contact'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Services | Lumina Architecture Studio', 'bodyBackground', '#ffffff', 'bodyTextColor', '#0f172a', 'fontFamily', 'font-serif'))
        )
      ),
      jsonb_build_object(
        'id', 'lumina-contact-page',
        'name', 'Contact',
        'slug', '/contact',
        'isHome', false,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina-contact', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Home', 'link1Url', '/', 'link2', 'Services', 'link2Url', '/services', 'ctaText', 'Back to Home', 'ctaUrl', '/')),
            jsonb_build_object('id', 'hero-lumina-contact', 'type', 'HeroFormCapture', 'props', jsonb_build_object('badge', 'START A PROJECT', 'title', 'Inquire for Atelier Commissions', 'description', 'Our principal architects review incoming briefs weekly. Leave your email or project summary below.', 'formButtonText', 'Submit Project Inquiry', 'formPlaceholder', 'your.name@company.com')),
            jsonb_build_object('id', 'faq-lumina-contact', 'type', 'FaqAccordion', 'props', jsonb_build_object('title', 'Frequently Asked Questions', 'subhead', 'Common questions regarding Atelier commissions and project timelines.', 'q1Title', 'What is the typical project timeline?', 'q1Answer', 'Concept design takes 4-6 weeks, followed by blueprint specification.', 'q2Title', 'Do you accept international projects?', 'q2Answer', 'Yes, Lumina operates globally across Asia, Europe, and the Americas.', 'q3Title', 'Can we license Nextflow web templates?', 'q3Answer', 'All Lumina digital presences are built using Nextflow Studio templates.')),
            jsonb_build_object('id', 'footer-lumina-contact', 'type', 'FooterMinimalInline', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'copyrightText', '© 2026 Lumina Architecture Studio.', 'link1', 'Home', 'link1Url', '/', 'link2', 'Services', 'link2Url', '/services'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Contact Atelier | Lumina Architecture Studio', 'bodyBackground', '#f8fafc', 'bodyTextColor', '#0f172a', 'fontFamily', 'font-serif'))
        )
      )
    )
  ),
  '/* Lumina White Theme Global CSS */ body { background-color: #ffffff; color: #0f172a; font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }',
  true
);
