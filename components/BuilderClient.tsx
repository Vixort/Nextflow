'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Monitor, Smartphone, Layout, Download, Sparkles, RefreshCw, Eye, Globe } from 'lucide-react'
import { WebsiteTemplate } from '@/types/supabase'
import { exportMultiPageZip, MultiPageProjectData, normalizeMultiPageData } from '@/lib/puck/multiPageUtils'

export default function BuilderClient() {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null)
  const [activePageId, setActivePageId] = useState<string>('')
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch('/api/admin/templates')
        const json = await res.json()
        const fetched: WebsiteTemplate[] = json?.data?.templates || []
        setTemplates(fetched)

        if (fetched.length > 0) {
          setSelectedTemplate(fetched[0])
          const multiPage = normalizeMultiPageData(fetched[0].puck_data)
          setActivePageId(multiPage.activePageId || multiPage.pages[0]?.id || '')
        }
      } catch (err) {
        console.error('Failed to load templates:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const multiPage: MultiPageProjectData | null = selectedTemplate
    ? normalizeMultiPageData(selectedTemplate.puck_data)
    : null

  const activePage = multiPage?.pages.find(p => p.id === activePageId) || multiPage?.pages[0]

  // Intercept anchor clicks inside preview to enable smooth inter-page routing
  const handleCanvasContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target.closest('a') : null
    if (!target) return

    const href = target.getAttribute('href')
    if (!href || href.startsWith('http') || href.startsWith('#')) return

    // Find matching page by slug
    if (multiPage) {
      const targetPage = multiPage.pages.find(p => p.slug === href || p.slug === `/${href.replace(/^\//, '')}`)
      if (targetPage) {
        e.preventDefault()
        setActivePageId(targetPage.id)
      }
    }
  }

  const handleExportZip = () => {
    if (!selectedTemplate || !multiPage) return
    exportMultiPageZip(multiPage, selectedTemplate.name)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#090a0f] text-slate-200 font-sans text-xs">
      {/* TOPBAR */}
      <header className="h-14 border-b border-white/10 bg-[#0d0e15] flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-xs">
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm tracking-wide flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" /> Template Showcase
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              Live Preview Mode
            </span>
          </div>
        </div>

        {/* CENTER: TEMPLATE & PAGE SELECTORS */}
        <div className="flex items-center gap-3">
          {templates.length > 0 && (
            <div className="flex items-center gap-2 bg-[#06070a] px-3 py-1.5 rounded-xl border border-white/10">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedTemplate?.id || ''}
                onChange={e => {
                  const t = templates.find(item => item.id === e.target.value)
                  if (t) {
                    setSelectedTemplate(t)
                    const mp = normalizeMultiPageData(t.puck_data)
                    setActivePageId(mp.activePageId || mp.pages[0]?.id || '')
                  }
                }}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id} className="bg-[#0f111a] text-slate-200">
                    {t.name} ({t.category || 'Template'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {multiPage && multiPage.pages.length > 1 && (
            <div className="flex items-center gap-1 bg-[#06070a] p-1 rounded-xl border border-white/10">
              {multiPage.pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setActivePageId(page.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    page.id === activePage?.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {page.isHome ? '🏠 Home' : page.name}
                </button>
              ))}
            </div>
          )}

          {/* VIEWPORT CONTROLS */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-[#06070a] border border-white/10 gap-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Tablet View (768px)"
            >
              <Layout size={14} />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              title="Mobile View (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT: EXPORT ZIP */}
        <button
          onClick={handleExportZip}
          disabled={!selectedTemplate}
          className="flex items-center gap-2 text-xs px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export ZIP</span>
        </button>
      </header>

      {/* CANVAS MAIN AREA */}
      <div className="flex-1 overflow-y-auto bg-[#06070a] p-4 md:p-8" onClick={handleCanvasContainerClick}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-cyan-400 font-bold gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" /> Loading website templates...
          </div>
        ) : selectedTemplate && activePage ? (
          <div className={`mx-auto bg-[#090a0f] transition-all duration-300 min-h-[800px] ${
            viewport === 'tablet' ? 'max-w-[768px] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden' :
            viewport === 'mobile' ? 'max-w-[375px] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden' :
            'max-w-7xl border border-white/10 rounded-2xl'
          }`}>
            <div className="p-4 border-b border-white/10 bg-[#0d0e15] flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-mono text-cyan-300">Rendering: {activePage.name} ({activePage.slug})</span>
              <span className="flex items-center gap-1 text-slate-500 font-bold">
                <Sparkles size={12} className="text-amber-400" /> Awwwards 105 Presets Render Engine
              </span>
            </div>

            {/* Page content rendering notice */}
            <div className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-black text-white">{selectedTemplate.name}</h2>
              <p className="text-slate-400 max-w-xl mx-auto">{selectedTemplate.description || 'Custom multi-page website template built with Puck Studio.'}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                Status: Active Template ({selectedTemplate.category})
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <p className="font-bold text-sm">No website templates found in database.</p>
            <Link href="/admin" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">
              Go to Admin Dashboard to Create Template
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
