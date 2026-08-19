import { createAdminClient } from '@/lib/supabase/admin'

// ====================================================================
// Services catalog — every service card and its full "Learn more"
// detail lives in the `services` table (admin-editable).
// ====================================================================

export interface ServiceItem {
  id: string
  title: string
  slug: string
  icon: string
  color: string
  description: string
  features: string[]
  outcome: string
  deliverables: string[]
  best_for: string[]
  timeline: string
  contact_service: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceInput {
  title: string
  slug: string
  icon: string
  color: string
  description: string
  features: string[]
  outcome: string
  deliverables: string[]
  best_for: string[]
  timeline: string
  contact_service: string
  sort_order: number
  is_active: boolean
}

function rowToService(row: Record<string, unknown>): ServiceItem {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    icon: String(row.icon ?? 'Globe'),
    color: String(row.color ?? 'from-cyan-400 to-blue-600'),
    description: String(row.description ?? ''),
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    outcome: String(row.outcome ?? ''),
    deliverables: Array.isArray(row.deliverables) ? row.deliverables.map(String) : [],
    best_for: Array.isArray(row.best_for) ? row.best_for.map(String) : [],
    timeline: String(row.timeline ?? ''),
    contact_service: String(row.contact_service ?? 'Something else'),
    sort_order: Number(row.sort_order ?? 0),
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

export async function getServices(activeOnly = true): Promise<ServiceItem[]> {
  const supabase = createAdminClient()
  let query = supabase.from('services').select('*').order('sort_order', { ascending: true })
  if (activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToService)
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  const service = rowToService(data)
  return service.is_active ? service : null
}

export async function getServiceById(id: string): Promise<ServiceItem | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('services').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? rowToService(data) : null
}

export async function createService(input: ServiceInput): Promise<ServiceItem> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('services').insert(input).select().single()
  if (error) throw new Error(error.message)
  return rowToService(data)
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<ServiceItem> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('services')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToService(data)
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/** URL-safe slug from a title (e.g. "Custom Web Platforms" → "custom-web-platforms"). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
