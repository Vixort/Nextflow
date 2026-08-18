import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { LUMINA_WHITE_STUDIO_PROJECT } from '../lib/puck/multiPageUtils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function main() {
  // Convert the in-code MultiPageProjectData (camelCase) to the persisted format
  // expected by the API/store: { schema_version, pages, active_page_id }.
  const puckData = {
    schema_version: 1,
    pages: LUMINA_WHITE_STUDIO_PROJECT.pages,
    active_page_id: LUMINA_WHITE_STUDIO_PROJECT.activePageId,
  }

  const { data, error } = await supabase
    .from('website_templates')
    .update({ puck_data: puckData as unknown as Record<string, unknown> })
    .eq('name', 'Lumina Architecture Studio')
    .select('id, name')

  if (error) {
    console.error('ERROR:', error.message)
    process.exit(1)
  }
  console.log('Updated rows:', data)

  for (const p of LUMINA_WHITE_STUDIO_PROJECT.pages) {
    const hash = JSON.stringify(p.data.content).length
    console.log(`  ${p.id}  "${p.name}"  contentBytes=${hash}  isHome=${p.isHome}  slug=${p.slug}`)
  }
  console.log('active_page_id =', LUMINA_WHITE_STUDIO_PROJECT.activePageId)
}

main()
