import type { Data } from '@puckeditor/core'
import { z } from 'zod'

export const TEMPLATE_PROJECT_VERSION = 1
export const TEMPLATE_PROJECT_VERSION_V2 = 2
export const MAX_TEMPLATE_PAGES = 25

const jsonValueSchema: z.ZodType<unknown> = z.lazy(() => z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(jsonValueSchema),
  z.record(z.string(), jsonValueSchema),
]))

const puckDataSchema = z.object({
  content: z.array(z.record(z.string(), jsonValueSchema)).default([]),
  zones: z.record(z.string(), z.array(z.record(z.string(), jsonValueSchema))).default({}),
  root: z.object({ props: z.record(z.string(), jsonValueSchema).default({}) }).default({ props: {} }),
}).passthrough()

export const sitePageSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(200).refine((s) => s.startsWith('/'), 'Page slug must start with /'),
  isHome: z.boolean(),
  data: puckDataSchema,
})

export const templateProjectSchema = z.object({
  schema_version: z.literal(TEMPLATE_PROJECT_VERSION),
  pages: z.array(sitePageSchema).min(1).max(MAX_TEMPLATE_PAGES),
  active_page_id: z.string().min(1).max(100),
}).superRefine((project, ctx) => {
  const homePages = project.pages.filter((page) => page.isHome)
  if (homePages.length !== 1) {
    ctx.addIssue({ code: 'custom', message: 'A project must have exactly one home page.' })
  }
  if (!project.pages.some((page) => page.id === project.active_page_id)) {
    ctx.addIssue({ code: 'custom', message: 'The active page must exist in the project.' })
  }
  const slugs = new Set<string>()
  for (const page of project.pages) {
    if (slugs.has(page.slug)) ctx.addIssue({ code: 'custom', message: 'Page slugs must be unique.' })
    slugs.add(page.slug)
    if (page.isHome && page.slug !== '/') ctx.addIssue({ code: 'custom', message: 'The home page slug must be /.' })
  }
})

export type TemplateProject = {
  schema_version: typeof TEMPLATE_PROJECT_VERSION
  pages: TemplateProjectPage[]
  active_page_id: string
}

export type TemplateProjectPage = {
  id: string
  name: string
  slug: string
  isHome: boolean
  data: Data
}

// v2 split-storage types: layout holds structure + non-text props only,
// texts hold copy per page → componentId → field.
export type TemplateProjectV2 = {
  schema_version: typeof TEMPLATE_PROJECT_VERSION_V2
  pages: TemplateProjectPage[] // data = layout (no copy fields)
  active_page_id: string
}

export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

export function slugifyPageName(name: string): string {
  const clean = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[\/\\]+/g, '')
  return clean && clean !== 'home' ? `/${clean}` : '/'
}

export function asTemplateProject(value: unknown): TemplateProject | null {
  const result = templateProjectSchema.safeParse(value)
  return result.success ? result.data as TemplateProject : null
}

export function assertTemplateProject(value: unknown): TemplateProject {
  return templateProjectSchema.parse(normalizeTemplateProject(value)) as TemplateProject
}

/** Accepts the former camelCase editor payload once, then persists the versioned format. */
export function normalizeTemplateProject(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  const candidate = value as Record<string, unknown>
  if (candidate.schema_version === TEMPLATE_PROJECT_VERSION) return candidate
  if (!Array.isArray(candidate.pages)) return candidate
  return {
    schema_version: TEMPLATE_PROJECT_VERSION,
    active_page_id: candidate.active_page_id ?? candidate.activePageId,
    pages: candidate.pages,
  }
}

export function createEmptyTemplateProject(name = 'Home'): TemplateProject {
  const pageId = createId('page')
  return {
    schema_version: TEMPLATE_PROJECT_VERSION,
    active_page_id: pageId,
    pages: [{
      id: pageId,
      name,
      slug: '/',
      isHome: true,
      data: { content: [], zones: {}, root: { props: { title: name } } },
    }],
  }
}
