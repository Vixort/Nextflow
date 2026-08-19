'use client'

import { useEffect, useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'

// Fallback groups if the tags API is unreachable (kept in sync with
// lib/puck/templateTags.ts — the server seeds these into template_tags).
const FALLBACK_GROUPS: { group: string; tags: string[] }[] = [
  { group: 'Industry', tags: ['SaaS', 'E-Commerce', 'Portfolio', 'Blog', 'Restaurant', 'Real Estate', 'Agency', 'Startup', 'Finance', 'Fitness', 'Travel', 'Education', 'Healthcare', 'Event', 'Personal'] },
  { group: 'Style', tags: ['Minimal', 'Dark', 'Light', 'Bold', 'Elegant', 'Luxury', 'Modern', 'Classic', 'Playful', 'Editorial', 'Geometric', 'Gradient'] },
  { group: 'Layout', tags: ['Landing Page', 'One Page', 'Multi-Page', 'Dashboard', 'Etsy Store', 'Showcase', 'Marketing', 'Product', 'Lead Gen', 'Coming Soon'] },
  { group: 'Feature', tags: ['Animations', '3D', 'Dark Mode', 'Interactive', 'RTL', 'Blog Engine', 'Cart', 'Booking', 'Auth', 'CMS', 'API', 'SEO'] },
  { group: 'Theme', tags: ['Cyberpunk', 'Neo-Brutalism', 'Glassmorphism', 'Retro', 'Aurora', 'Monochrome', 'Bento', 'Glass', 'Warm', 'Cool'] },
]

type TagPickerProps = {
  value: string[]
  onChange: (tags: string[]) => void
  accent?: 'cyan' | 'emerald'
  placeholder?: string
}

export default function TagPicker({
  value,
  onChange,
  accent = 'cyan',
  placeholder = 'Add a new tag...',
}: TagPickerProps) {
  const [groups, setGroups] = useState<{ group: string; tags: string[] }[]>(FALLBACK_GROUPS)
  const [custom, setCustom] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const accentCls =
    accent === 'emerald'
      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
      : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/tags')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (cancelled || !d?.data) return
        if (d.data.groups?.length) setGroups(d.data.groups)
        setCustom(d.data.custom || [])
      })
      .catch(() => {
        // fallback groups already in state
      })
    return () => {
      cancelled = true
    }
  }, [])

  const toggle = (tag: string) => {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : Array.from(new Set([...value, tag])).slice(0, 20))
  }

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag))

  const addNew = async () => {
    const name = newTag.trim()
    if (!name || adding) return
    setAdding(true)
    setAddError(null)
    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.status === 409) {
        setAddError(`Tag "${name}" already exists`)
      } else if (!res.ok) {
        const d = await res.json().catch(() => null)
        setAddError(d?.error || 'Failed to add tag')
      } else {
        setCustom((prev) => Array.from(new Set([...prev, name])))
        onChange(Array.from(new Set([...value, name])).slice(0, 20))
        setNewTag('')
      }
    } catch {
      setAddError('Network error')
    } finally {
      setAdding(false)
    }
  }

  const available = (tag: string) => !value.includes(tag)

  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${accentCls}`}
            >
              #{tag}
              <button type="button" onClick={() => remove(tag)} className="opacity-70 hover:opacity-100 cursor-pointer" aria-label={`Remove ${tag}`}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="max-h-44 overflow-y-auto space-y-3 pr-1">
        {groups.map(({ group, tags }) => {
          const visible = tags.filter(available)
          if (visible.length === 0) return null
          return (
            <div key={group}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">{group}</p>
              <div className="flex flex-wrap gap-1.5">
                {visible.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle(tag)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
        {custom.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Custom</p>
            <div className="flex flex-wrap gap-1.5">
              {custom.filter(available).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggle(tag)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer bg-white/[0.03] border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addNew()
            }
          }}
          placeholder={placeholder}
          className="flex-1 h-8 px-3 rounded-lg bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
        />
        <button
          type="button"
          onClick={addNew}
          disabled={adding || !newTag.trim()}
          className="h-8 px-3 rounded-lg text-[11px] font-bold bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
        >
          {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Add
        </button>
      </div>
      {addError && <p className="text-[10px] text-red-400 mt-1">{addError}</p>}
    </div>
  )
}
