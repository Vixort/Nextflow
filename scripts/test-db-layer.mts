// P2 smoke test — db layer against MariaDB. Run: node --experimental-strip-types scripts/test-db-layer.mts
import { createAdminClient } from '../lib/db/client.ts'
import { closeDb } from '../lib/db/client.ts'

process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1'
process.env.DB_USER = process.env.DB_USER || 'root'
process.env.DB_PASSWORD = process.env.DB_PASSWORD || ''
process.env.DB_NAME = process.env.DB_NAME || 'nextflow'

const supabase = createAdminClient()
let failed = 0

function check(name: string, cond: boolean, detail?: unknown) {
  console.log(`${cond ? '✅' : '❌'} ${name}${!cond && detail !== undefined ? ' — ' + JSON.stringify(detail).slice(0, 200) : ''}`)
  if (!cond) failed++
}

// 1. Read: services ordered by sort_order, active only
const services = await supabase.from('services').select('*').order('sort_order', { ascending: true }).eq('is_active', true)
check('getServices: 6 active services', services.data?.length === 6, services.error)
check('getServices: JSON features parsed', Array.isArray(services.data?.[0]?.features), services.data?.[0]?.features)
check('getServices: created_at ISO string', typeof services.data?.[0]?.created_at === 'string' && services.data[0].created_at.includes('T'))

// 2. maybeSingle by slug
const bySlug = await supabase.from('services').select('*').eq('slug', 'custom-web-platforms').maybeSingle()
check('maybeSingle by slug', bySlug.data?.title === 'Custom Web Platforms', bySlug.error)
const missing = await supabase.from('services').select('*').eq('slug', 'nope').maybeSingle()
check('maybeSingle missing → null', missing.data === null && missing.error === null, missing)

// 3. single() errors on zero rows
const singleEmpty = await supabase.from('services').select('*').eq('slug', 'nope').single()
check('single() empty → error', singleEmpty.data === null && singleEmpty.error !== null, singleEmpty)

// 4. insert + select('id') chain, JSON columns round-trip
const inserted = await supabase.from('services').insert({
  title: 'DB Layer Test Service',
  slug: 'db-layer-test',
  icon: 'Wrench',
  color: 'from-cyan-400 to-blue-600',
  description: 'temp',
  features: ['a', 'b'],
  outcome: 'o',
  deliverables: ['d1'],
  best_for: ['b1'],
  timeline: 't',
  contact_service: 'Something else',
  sort_order: 99,
  is_active: true,
}).select('id')
check('insert().select(id): got id', inserted.data?.[0]?.id && typeof inserted.data[0].id === 'string', inserted)
const newId = inserted.data?.[0]?.id as string | undefined

if (newId) {
  // 5. update + eq + select
  const updated = await supabase.from('services').update({ title: 'DB Layer Test Service 2', features: ['x', 'y', 'z'] }).eq('id', newId).select('title, features')
  check('update().select: new title + JSON', updated.data?.[0]?.title === 'DB Layer Test Service 2' && updated.data?.[0]?.features?.length === 3, updated)

  // 6. in() filter
  const inRes = await supabase.from('services').select('id').in('id', [newId, 'a0eebc99-0000-0000-0000-000000000000'])
  check('in() filter returns the row', inRes.data?.length === 1, inRes)

  // 7. gte + limit + order desc
  const gteRes = await supabase.from('services').select('sort_order').gte('sort_order', 5).order('sort_order', { ascending: false }).limit(2)
  check('gte + order desc + limit', gteRes.data?.length === 2 && gteRes.data[0].sort_order === 99, gteRes)

  // 8. delete
  const del = await supabase.from('services').delete().eq('id', newId)
  check('delete', del.error === null, del)
  const afterDel = await supabase.from('services').select('id').eq('slug', 'db-layer-test').maybeSingle()
  check('row gone after delete', afterDel.data === null, afterDel)
}

// 9. upsert (system_settings — PK `key`)
const up = await supabase.from('system_settings').upsert({ key: 'test-kv', value: { hello: 'world', arr: [1, 2] } })
check('upsert insert ok', up.error === null, up)
const up2 = await supabase.from('system_settings').upsert({ key: 'test-kv', value: { hello: 'world2' } })
check('upsert update ok', up2.error === null, up2)
const kv = await supabase.from('system_settings').select('value').eq('key', 'test-kv').maybeSingle()
check('upsert value updated + JSON parsed', kv.data?.value?.hello === 'world2', kv)
await supabase.from('system_settings').delete().eq('key', 'test-kv')

// 10. rpc rate_limit_tick
// Window must be recent (< 2h) or the hourly prune deletes the row.
const testWindow = new Date(Date.now() - 30_000)
const tick1 = await supabase.rpc('rate_limit_tick', { p_fingerprint: 'test-fp', p_endpoint: '/api/test', p_window_start: testWindow, p_max: 5 })
const tick2 = await supabase.rpc('rate_limit_tick', { p_fingerprint: 'test-fp', p_endpoint: '/api/test', p_window_start: testWindow, p_max: 5 })
check('rate_limit_tick: 1 then 2', tick1.data === 1 && tick2.data === 2, { tick1, tick2 })

// 11. rpc bump_token_versions
const bump = await supabase.rpc('bump_token_versions')
check('bump_token_versions: >= 1 user bumped', typeof bump.data === 'number' && bump.data >= 1, bump)

// 12. unknown rpc rejected
const unknown = await supabase.rpc('nope')
check('unknown rpc → error', unknown.error !== null, unknown)

// 13. contains() on JSON array (tags)
const tagsRes = await supabase.from('website_templates').select('name, tags').limit(3)
if (tagsRes.data?.length) {
  const contains = await supabase.from('website_templates').select('name').contains('tags', [tagsRes.data[0].tags?.[0]])
  check('contains(tags) finds row', contains.data?.length === tagsRes.data.length, { contains, first: tagsRes.data[0] })
} else {
  console.log('⚠️ no website_templates rows to test contains() — skipping')
}

await closeDb()
console.log(failed === 0 ? '\nALL PASS' : `\n${failed} FAILED`)
process.exit(failed === 0 ? 0 : 1)