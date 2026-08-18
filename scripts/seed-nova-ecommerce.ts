import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { NOVA_MARKET_STUDIO_PROJECT } from '../lib/puck/multiPageUtils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  const puckData = {
    schema_version: 1,
    pages: NOVA_MARKET_STUDIO_PROJECT.pages,
    active_page_id: NOVA_MARKET_STUDIO_PROJECT.activePageId,
  }

  const templatePayload = {
    name: 'Nova Market E-Commerce Store',
    description: 'Bespoke multi-page e-commerce storefront template featuring high-res studio photography, curated product catalog grid, acoustic hardware spotlight, transparent shipping calculator, encrypted checkout preview, and 5 full pages (Home, Shop Catalog, Product Detail, Cart & Checkout, About Story).',
    category: 'E-Commerce & Retail',
    tags: ['Ecommerce', 'Minimalist', 'Storefront', 'Retail', 'Hardware', 'Luxury'],
    thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    puck_data: puckData as unknown as Record<string, unknown>,
    global_css: '',
    is_active: true
  }

  // Check if template exists
  const { data: existing } = await supabase
    .from('website_templates')
    .select('id')
    .eq('name', 'Nova Market E-Commerce Store')
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from('website_templates')
      .update(templatePayload)
      .eq('id', existing.id)
      .select('id, name')

    if (error) {
      console.error('ERROR updating template:', error.message)
      process.exit(1)
    }
    console.log('Successfully updated Nova Market template:', data)
  } else {
    const { data, error } = await supabase
      .from('website_templates')
      .insert(templatePayload)
      .select('id, name')

    if (error) {
      console.error('ERROR inserting template:', error.message)
      process.exit(1)
    }
    console.log('Successfully created Nova Market template:', data)
  }

  for (const page of NOVA_MARKET_STUDIO_PROJECT.pages) {
    console.log(`Page: "${page.name}" (${page.slug}) - ${page.data.content.length} blocks`)
  }
}

main()
