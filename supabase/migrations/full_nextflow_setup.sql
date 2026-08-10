-- ====================================================================
-- NEXTFLOW FULL SUPABASE DATABASE SETUP & SEED MIGRATION
-- Single Master SQL File for Table Schema, Security Policies, & Templates
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create website_templates Table
CREATE TABLE IF NOT EXISTS public.website_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Landing Page',
  thumbnail_url TEXT,
  puck_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  global_css TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- 3. Create Unique Index on name (Fixes ERROR 42P10 for ON CONFLICT matching)
CREATE UNIQUE INDEX IF NOT EXISTS website_templates_name_key 
  ON public.website_templates (name);

-- 4. Row Level Security & Access Permissions
ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on website_templates" ON public.website_templates;
DROP POLICY IF EXISTS "Allow public all on website_templates" ON public.website_templates;
REVOKE ALL ON TABLE public.website_templates FROM anon, authenticated;

-- 5. Create Index on updated_at
CREATE INDEX IF NOT EXISTS website_templates_updated_at_idx 
  ON public.website_templates (updated_at DESC);

-- 6. Updated At Trigger Function & Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_website_templates_updated_at ON public.website_templates;
CREATE TRIGGER update_website_templates_updated_at
  BEFORE UPDATE ON public.website_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- SEED DATA: LUMINA LUXURY ESTATE & VILLA ARCHITECTURE STUDIO
-- Multi-page template with 4 pages (Home, Estates, Services, Inquiry)
-- ====================================================================

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
  'Luxury minimalist real estate & villa design studio template featuring warm bone white aesthetics, serif typography, estate listing specs, bespoke horizontal image rail, 4 full pages (Home, Estates Directory, Atelier Services, Private Inquiry), and offline ZIP export support.',
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
            jsonb_build_object('id', 'nav-lumina', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Estates', 'link1Url', '/#estates', 'link2', 'Services', 'link2Url', '/services', 'ctaText', 'Inquire Brief', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'hero-lumina', 'type', 'EstateHeroEditorial', 'props', jsonb_build_object('location', 'LAKE COMO, ITALY', 'title', 'Villa Aura Glass Sanctuary', 'subtitle', 'A masterpiece of contemporary architectural design, seamlessly integrating raw travertine stone, floor-to-ceiling panoramic glass, and private alpine waterfront vistas.', 'price', '€14,500,000', 'specs', '6 BEDS • 7 BATHS • 12,400 SQ FT • PRIVATE DOCK', 'heroImg', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80', 'ctaText', 'Inquire Private Brief', 'ctaUrl', '/contact', 'secText', 'View Architectural Specs', 'secUrl', '/services')),
            jsonb_build_object('id', 'portfolio-lumina', 'type', 'EstateImageRailEditorial', 'props', jsonb_build_object('title', 'Selected Atelier Masterworks', 'subtitle', 'Horizontal architectural photo monograph. Scroll to explore active estate commissions.', 'item1Title', 'Villa Aura Glass Sanctuary', 'item1Loc', '01 // LAKE COMO, ITALY', 'item1Price', '€14,500,000', 'item1Img', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80', 'item2Title', 'Obsidian Alpine Pavilion', 'item2Loc', '02 // ASPEN, COLORADO', 'item2Price', '$18,500,000', 'item2Img', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80', 'item3Title', 'Kyoto Zen Sanctuary', 'item3Loc', '03 // KYOTO, JAPAN', 'item3Price', '$12,000,000', 'item3Img', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', 'item4Title', 'Bel Air Horizon Residence', 'item4Loc', '04 // LOS ANGELES, CA', 'item4Price', '$24,000,000', 'item4Img', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80')),
            jsonb_build_object('id', 'specs-lumina', 'type', 'EstateSpecsDetail', 'props', jsonb_build_object('title', 'Architectural Materiality & Structural Precision', 'subtitle', 'Every Lumina estate is built with authentic natural stone, thermal glass, and sustainable off-grid power.', 'spec1Title', 'Natural Italian Travertine', 'spec1Desc', 'Hand-selected Roman travertine stone slabs with precision thermal isolation.', 'spec2Title', 'Triple-Glazed Panoramic Glass', 'spec2Desc', 'Floor-to-ceiling UV-protected acoustic glass panels with invisible framing.', 'spec3Title', 'Zero-Carbon Solar Envelope', 'spec3Desc', 'Integrated photovoltaic roof tiles generating 100% clean off-grid power.', 'spec4Title', 'Smart Atelier Automation', 'spec4Desc', 'Sub-millisecond climate, security, and ambient light automation engine.')),
            jsonb_build_object('id', 'testimonial-lumina', 'type', 'TestimonialQuoteMinimal', 'props', jsonb_build_object('quote', '"Lumina Atelier redefines luxury residential architecture with absolute visual purity, structural permanence, and harmony with surrounding nature."', 'author', 'ARCHITECTURAL DIGEST', 'role', 'INTERNATIONAL MONOGRAPH REVIEW 2026')),
            jsonb_build_object('id', 'footer-lumina', 'type', 'FooterMinimalCentered', 'props', jsonb_build_object('brandName', 'LUMINA ARCHITECTURAL ATELIER', 'tagline', 'GENEVA • KYOTO • NEW YORK • MILAN', 'copyrightText', 'MMXXVI ALL RIGHTS RESERVED.'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Lumina Atelier - Luxury Estate & Architecture Studio', 'bodyBackground', '#FBFBFA', 'bodyTextColor', '#111111', 'fontFamily', 'font-serif'))
        )
      ),
      jsonb_build_object(
        'id', 'lumina-estates-page',
        'name', 'Estates Directory',
        'slug', '/about',
        'isHome', false,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina-estates', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Estates', 'link1Url', '/#estates', 'link2', 'Services', 'link2Url', '/services', 'ctaText', 'Inquire Brief', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'hero-lumina-estates', 'type', 'HeroMinimalistTypography', 'props', jsonb_build_object('badge', 'PRIVATE DIRECTORY', 'mainHeading', 'THE ESTATES COLLECTION', 'subhead', 'A private portfolio of ultra-luxury residential developments, alpine retreats, and coastal sanctuaries built across 4 continents.', 'ctaText', 'INQUIRE ACQUISITION', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'gallery-lumina-estates', 'type', 'EstateGridGallery', 'props', jsonb_build_object('title', 'Private Villa Portfolio', 'subtitle', 'Detailed specifications and private tour requests.', 'e1Title', 'Villa Aura Glass Residence', 'e1Loc', 'LAKE COMO, ITALY', 'e1Price', '€14,500,000', 'e1Img', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80', 'e2Title', 'Obsidian Alpine Pavilion', 'e2Loc', 'ASPEN, COLORADO', 'e2Price', '$18,500,000', 'e2Img', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80', 'e3Title', 'Kyoto Zen Sanctuary', 'e3Loc', 'KYOTO, JAPAN', 'e3Price', '$12,000,000', 'e3Img', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80')),
            jsonb_build_object('id', 'specs-lumina-estates', 'type', 'EstateSpecsDetail', 'props', jsonb_build_object('title', 'Master Atelier Specifications', 'subtitle', 'Engineered with sustainable materials and mathematical proportion.', 'spec1Title', '01. Spatial Proportion', 'spec1Desc', 'Proportional balance following golden ratio geometry.', 'spec2Title', '02. Authentic Stone', 'spec2Desc', 'Hand-chiselled granite and Roman travertine.', 'spec3Title', '03. Acoustic Isolation', 'spec3Desc', 'Triple acoustic insulation for complete interior tranquility.', 'spec4Title', '04. Solar Independence', 'spec4Desc', 'Integrated clean energy generation.')),
            jsonb_build_object('id', 'footer-lumina-estates', 'type', 'FooterMinimalCentered', 'props', jsonb_build_object('brandName', 'LUMINA ARCHITECTURAL ATELIER', 'tagline', 'GENEVA • KYOTO • NEW YORK • MILAN', 'copyrightText', 'MMXXVI ALL RIGHTS RESERVED.'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Estates Collection | Lumina Atelier', 'bodyBackground', '#ffffff', 'bodyTextColor', '#111111', 'fontFamily', 'font-serif'))
        )
      ),
      jsonb_build_object(
        'id', 'lumina-services-page',
        'name', 'Atelier Services',
        'slug', '/services',
        'isHome', false,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina-services', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Home', 'link1Url', '/', 'link2', 'Estates', 'link2Url', '/about', 'ctaText', 'Inquire Brief', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'hero-lumina-services', 'type', 'HeroMinimalSerif', 'props', jsonb_build_object('badge', 'BESPOKE COMMISSIONS', 'headline', 'ARCHITECTURAL SERVICES & ATELIER FEES', 'subheadline', 'End-to-end master planning, structural engineering, interior architecture, and custom estate construction oversight.', 'ctaText', 'BOOK CONSULTATION', 'ctaUrl', '/contact')),
            jsonb_build_object('id', 'comparison-lumina-services', 'type', 'FeatureComparisonGrid', 'props', jsonb_build_object('title', 'Atelier Retainer Deliverables Matrix', 'col1Name', 'Full Atelier Masterplan', 'col2Name', 'Concept Specification', 'row1', '3D Spatial Modeling & VR Walkthrough', 'row2', 'On-site Structural Construction Supervision', 'row3', 'Custom Interior & Landscape Architecture')),
            jsonb_build_object('id', 'pricing-lumina-services', 'type', 'PricingTable', 'props', jsonb_build_object('title', 'Architectural Retainer Tiers', 'subhead', 'Transparent retainer structures for bespoke residential developments.', 'proPrice', '$25,000', 'proFeatures', 'Concept Masterplan, 3D Renderings, Material Specifications, Zoning Permits', 'enterprisePrice', '$75,000', 'enterpriseFeatures', 'Complete Architectural Blueprint, Structural Engineering, On-site Supervision, Custom Interior Design', 'highlightPro', true, 'padding', 'standard')),
            jsonb_build_object('id', 'footer-lumina-services', 'type', 'FooterMinimalCentered', 'props', jsonb_build_object('brandName', 'LUMINA ARCHITECTURAL ATELIER', 'tagline', 'GENEVA • KYOTO • NEW YORK • MILAN', 'copyrightText', 'MMXXVI ALL RIGHTS RESERVED.'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Atelier Services & Fee Matrix | Lumina Atelier', 'bodyBackground', '#FBFBFA', 'bodyTextColor', '#111111', 'fontFamily', 'font-serif'))
        )
      ),
      jsonb_build_object(
        'id', 'lumina-contact-page',
        'name', 'Private Inquiry',
        'slug', '/contact',
        'isHome', false,
        'data', jsonb_build_object(
          'content', jsonb_build_array(
            jsonb_build_object('id', 'nav-lumina-contact', 'type', 'NavbarMinimalMonochrome', 'props', jsonb_build_object('brandName', 'LUMINA ATELIER', 'link1', 'Home', 'link1Url', '/', 'link2', 'Estates', 'link2Url', '/about', 'ctaText', 'Back to Home', 'ctaUrl', '/')),
            jsonb_build_object('id', 'inquiry-lumina-contact', 'type', 'EstateInquiryForm', 'props', jsonb_build_object('title', 'Inquire for Private Estate Commissions', 'subhead', 'Our principal architects review incoming private commission briefs weekly. Confidentiality assured.', 'buttonText', 'Submit Commission Inquiry', 'placeholder', 'your.name@company.com')),
            jsonb_build_object('id', 'faq-lumina-contact', 'type', 'FaqAccordion', 'props', jsonb_build_object('title', 'Private Commission FAQs', 'subhead', 'Essential details regarding project intake, timelines, and confidentiality.', 'q1Title', 'What is the typical timeline for a private estate commission?', 'q1Answer', 'Masterplan concept development takes 6-8 weeks, followed by full engineering specifications.', 'q2Title', 'Does Lumina handle international land acquisition and permits?', 'q2Answer', 'Yes, our global legal and architectural team coordinates all local municipal permits across Europe, US, and Asia.', 'q3Title', 'Are estate commissions strictly confidential?', 'q3Answer', 'All inquiries are bound by non-disclosure agreements prior to initial architectural consultation.')),
            jsonb_build_object('id', 'footer-lumina-contact', 'type', 'FooterMinimalCentered', 'props', jsonb_build_object('brandName', 'LUMINA ARCHITECTURAL ATELIER', 'tagline', 'GENEVA • KYOTO • NEW YORK • MILAN', 'copyrightText', 'MMXXVI ALL RIGHTS RESERVED.'))
          ),
          'zones', jsonb_build_object(),
          'root', jsonb_build_object('props', jsonb_build_object('title', 'Private Inquiry | Lumina Atelier', 'bodyBackground', '#111111', 'bodyTextColor', '#FBFBFA', 'fontFamily', 'font-serif'))
        )
      )
    )
  ),
  '/* Lumina Editorial Warm Bone Theme */ body { background-color: #FBFBFA; color: #111111; font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; } .puck-canvas { background-color: #FBFBFA !important; }',
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  puck_data = EXCLUDED.puck_data,
  global_css = EXCLUDED.global_css,
  updated_at = NOW();
