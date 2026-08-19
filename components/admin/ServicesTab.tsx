'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { SERVICE_ICONS, SERVICE_ICON_NAMES, SERVICE_COLORS, SERVICE_ICON_COLORS, type ServiceIconName } from '@/lib/services/icons'
import { SERVICE_TYPES } from '@/lib/validations/contact'
import { slugify } from '@/lib/utils/slugify'
import type { Service } from '@/types/supabase'

const EMPTY_FORM = {
  title: '',
  slug: '',
  icon: 'Globe' as ServiceIconName,
  color: 'from-cyan-400 to-blue-600',
  description: '',
  features: [] as string[],
  outcome: '',
  deliverables: [] as string[],
  best_for: [] as string[],
  timeline: '',
  contact_service: 'Something else',
  sort_order: 0,
  is_active: true,
}

type FormState = typeof EMPTY_FORM

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const IconPreview: LucideIcon = SERVICE_ICONS[form.icon as ServiceIconName] ?? SERVICE_ICONS.Globe
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [newListItem, setNewListItem] = useState<Record<string, string>>({})

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services', { cache: 'no-store' })
      const d = await res.json()
      if (res.ok && d?.data?.services) setServices(d.data.services)
      else setFeedback({ type: 'error', message: d.error || 'Failed to load services' })
    } catch {
      setFeedback({ type: 'error', message: 'Network error loading services' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/admin/services', { cache: 'no-store' })
        const d = await res.json()
        if (cancelled) return
        if (res.ok && d?.data?.services) setServices(d.data.services)
        else setFeedback({ type: 'error', message: d.error || 'Failed to load services' })
      } catch {
        if (!cancelled) setFeedback({ type: 'error', message: 'Network error loading services' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const startNew = () => {
    setForm({ ...EMPTY_FORM, sort_order: services.length + 1 })
    setSelectedId(null)
    setEditing(true)
    setConfirmDelete(false)
  }

  const startEdit = (service: Service) => {
    setForm({
      title: service.title,
      slug: service.slug,
      icon: (service.icon as ServiceIconName) in SERVICE_ICONS ? (service.icon as ServiceIconName) : 'Globe',
      color: service.color,
      description: service.description,
      features: [...service.features],
      outcome: service.outcome,
      deliverables: [...service.deliverables],
      best_for: [...service.best_for],
      timeline: service.timeline,
      contact_service: service.contact_service,
      sort_order: service.sort_order,
      is_active: service.is_active,
    })
    setSelectedId(service.id)
    setEditing(true)
    setConfirmDelete(false)
  }

  const cancelEdit = () => {
    setEditing(false)
    setSelectedId(null)
    setForm(EMPTY_FORM)
    setConfirmDelete(false)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const addListItem = (key: 'features' | 'deliverables' | 'best_for') => {
    const v = (newListItem[key] ?? '').trim()
    if (!v) return
    setField(key, [...form[key], v])
    setNewListItem((n) => ({ ...n, [key]: '' }))
  }

  const removeListItem = (key: 'features' | 'deliverables' | 'best_for', index: number) => {
    setField(key, form[key].filter((_, i) => i !== index))
  }

  const autoSlug = () => {
    const s = slugify(form.title)
    if (s) setField('slug', s)
  }

  const save = async () => {
    if (!form.title.trim()) {
      setFeedback({ type: 'error', message: 'Title is required' })
      return
    }
    setSaving(true)
    setFeedback(null)
    try {
      const body = { ...form, title: form.title.trim(), slug: (form.slug || slugify(form.title)).trim() }
      const res = selectedId
        ? await fetch(`/api/admin/services?id=${selectedId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
      const d = await res.json()
      if (!res.ok) {
        const raw = d.details as unknown
        const detail =
          typeof raw === 'object' && raw !== null
            ? Object.entries(raw).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`).join('; ')
            : ''
        setFeedback({ type: 'error', message: d.error + (detail ? ` — ${detail}` : '') })
        return
      }
      setFeedback({ type: 'success', message: selectedId ? 'Service updated' : 'Service created' })
      setTimeout(() => setFeedback(null), 3500)
      await fetchServices()
      cancelEdit()
    } catch {
      setFeedback({ type: 'error', message: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!selectedId) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 4000)
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/services?id=${selectedId}`, { method: 'DELETE' })
      const d = await res.json()
      if (!res.ok) {
        setFeedback({ type: 'error', message: d.error || 'Failed to delete' })
        return
      }
      setFeedback({ type: 'success', message: 'Service deleted' })
      setTimeout(() => setFeedback(null), 3500)
      await fetchServices()
      cancelEdit()
    } catch {
      setFeedback({ type: 'error', message: 'Network error' })
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const inputCls =
    'w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors'
  const textareaCls =
    'w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-y'
  const labelCls = 'text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {feedback && (
        <Alert type={feedback.type} message={feedback.message} onDismiss={() => setFeedback(null)} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-white">Services Catalog</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Everything here powers the /services page and each Learn More page. Edits apply immediately.
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <Plus size={14} /> Add Service
        </button>
      </div>

      {editing ? (
        /* ── EDITOR ─────────────────────────────────────────── */
        <div className="rounded-2xl border border-white/10 bg-[#0f111a]/80 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {selectedId ? 'Edit Service' : 'New Service'}
            </h3>
            <div className="flex items-center gap-2">
              {selectedId && (
                <button
                  onClick={remove}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    confirmDelete
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                  }`}
                >
                  {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  {confirmDelete ? 'Confirm delete?' : 'Delete'}
                </button>
              )}
              <button
                onClick={cancelEdit}
                className="px-3 py-2 rounded-lg border border-white/10 text-[11px] font-bold text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left column: basics */}
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Custom Web Platforms" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Slug (URL)</label>
                <div className="flex gap-2">
                  <input
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    placeholder="custom-web-platforms"
                    className={inputCls}
                  />
                  <button
                    onClick={autoSlug}
                    title="Generate from title"
                    className="shrink-0 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              <div>
                <label className={labelCls}>Icon</label>
                <div className="flex items-center gap-4 mb-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-[#0d0e15]">
                    <IconPreview className={`w-7 h-7 ${SERVICE_ICON_COLORS[form.color] ?? 'text-cyan-400'}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white font-mono">{form.icon}</p>
                    <p className="text-[10px] text-slate-500">Pick an icon from the grid below</p>
                  </div>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {SERVICE_ICON_NAMES.map((name) => {
                    const PIcon = SERVICE_ICONS[name]
                    const active = form.icon === name
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setField('icon', name)}
                        title={name}
                        className={`flex items-center justify-center h-9 rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-300'
                            : 'border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-200 hover:border-white/25 hover:bg-white/[0.06]'
                        }`}
                      >
                        <PIcon size={16} strokeWidth={1.75} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Color</label>
                  <div className="relative">
                    <select
                      value={form.color}
                      onChange={(e) => setField('color', e.target.value)}
                      className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                    >
                      {SERVICE_COLORS.map((c) => (
                        <option key={c} value={c} className="bg-[#0f111a]">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-br ${form.color}`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setField('sort_order', parseInt(e.target.value, 10) || 0)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Contact Form Option</label>
                  <div className="relative">
                    <select
                      value={form.contact_service}
                      onChange={(e) => setField('contact_service', e.target.value)}
                      className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                    >
                      {SERVICE_TYPES.map((s) => (
                        <option key={s} value={s} className="bg-[#0f111a]">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 h-[38px]">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">Visible on the website</p>
                    </div>
                    <button
                      onClick={() => setField('is_active', !form.is_active)}
                      title={form.is_active ? 'Visible on /services' : 'Hidden from /services'}
                      className={`w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${form.is_active ? 'bg-cyan-500' : 'bg-slate-700'}`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white mt-0.5 ml-0.5 transition-transform ${form.is_active ? 'translate-x-[18px]' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Description (card + detail page)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  rows={4}
                  className={textareaCls}
                />
              </div>
            </div>

            {/* Right column: Learn More content */}
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Outcome — “What you get”</label>
                <textarea
                  value={form.outcome}
                  onChange={(e) => setField('outcome', e.target.value)}
                  rows={3}
                  className={textareaCls}
                />
              </div>

              <div>
                <label className={labelCls}>Deliverables (Learn More list)</label>
                <ListEditor
                  key="deliverables"
                  items={form.deliverables}
                  placeholder="Add a deliverable…"
                  value={newListItem.deliverables ?? ''}
                  onChangeValue={(v) => setNewListItem((n) => ({ ...n, deliverables: v }))}
                  onAdd={() => addListItem('deliverables')}
                  onRemove={(i) => removeListItem('deliverables', i)}
                />
              </div>

              <div>
                <label className={labelCls}>Best suited for</label>
                <ListEditor
                  key="best_for"
                  items={form.best_for}
                  placeholder="Add who it suits…"
                  value={newListItem.best_for ?? ''}
                  onChangeValue={(v) => setNewListItem((n) => ({ ...n, best_for: v }))}
                  onAdd={() => addListItem('best_for')}
                  onRemove={(i) => removeListItem('best_for', i)}
                />
              </div>

              <div>
                <label className={labelCls}>Features (card checklist)</label>
                <ListEditor
                  key="features"
                  items={form.features}
                  placeholder="Add a feature…"
                  value={newListItem.features ?? ''}
                  onChangeValue={(v) => setNewListItem((n) => ({ ...n, features: v }))}
                  onAdd={() => addListItem('features')}
                  onRemove={(i) => removeListItem('features', i)}
                />
              </div>

              <div>
                <label className={labelCls}>Timeline</label>
                <input
                  value={form.timeline}
                  onChange={(e) => setField('timeline', e.target.value)}
                  placeholder="e.g. 3–8 weeks for a full platform"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {selectedId ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </div>
      ) : (
        /* ── LIST ────────────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon: LucideIcon = SERVICE_ICONS[service.icon as ServiceIconName] ?? SERVICE_ICONS.Globe
            return (
              <div
                key={service.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  service.is_active ? 'border-white/10 bg-[#0f111a]/80' : 'border-white/5 bg-[#0f111a]/40 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${SERVICE_ICON_COLORS[service.color] ?? 'text-cyan-400'}`} strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{service.title}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">/{service.slug}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md text-[9px] font-bold ${
                      service.is_active
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                    }`}
                  >
                    {service.is_active ? <Eye size={9} /> : <EyeOff size={9} />}
                    {service.is_active ? 'LIVE' : 'HIDDEN'}
                  </span>
                </div>

                <p className="mt-3 text-[11px] text-slate-400 line-clamp-2 min-h-[2rem]">{service.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-cyan-300 transition-colors"
                  >
                    View page <ExternalLink size={10} />
                  </Link>
                  <button
                    onClick={() => startEdit(service)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold text-slate-200 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <Pencil size={11} /> Edit
                  </button>
                </div>
              </div>
            )
          })}

          {services.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-sm text-slate-400">No services yet — add your first one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ListEditor({
  items,
  placeholder,
  value,
  onChangeValue,
  onAdd,
  onRemove,
}: {
  items: string[]
  placeholder: string
  value: string
  onChangeValue: (v: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center gap-2">
          <span className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200 truncate">
            {item}
          </span>
          <button
            onClick={() => onRemove(i)}
            className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
            aria-label="Remove item"
          >
            <X size={13} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <button
          onClick={onAdd}
          className="shrink-0 px-3.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  )
}