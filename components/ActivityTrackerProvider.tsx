'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function ActivityTrackerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const previousPathRef = useRef<string | null>(null)

  // Track page navigation (from_path -> to_path)
  useEffect(() => {
    const fromPath = previousPathRef.current
    const toPath = pathname

    // Skip initial load log if fromPath is null, or log as initial PAGE_ENTER
    if (fromPath !== null && fromPath !== toPath) {
      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'page_view',
          action: 'PAGE_NAVIGATE',
          description: `Navigated from "${fromPath}" to "${toPath}"`,
          path: toPath,
          from_path: fromPath,
          to_path: toPath,
          metadata: { timestamp: new Date().toISOString() },
        }),
      }).catch(() => {})
    } else if (fromPath === null) {
      // First page view of session
      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'page_view',
          action: 'PAGE_VIEW',
          description: `Entered page "${toPath}"`,
          path: toPath,
          to_path: toPath,
          metadata: { timestamp: new Date().toISOString() },
        }),
      }).catch(() => {})
    }

    previousPathRef.current = toPath
  }, [pathname])

  // Global click tracker for buttons/links with data-track attribute or key actions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track], button, a')
      if (!target) return

      const trackName = target.getAttribute('data-track') ||
                        target.getAttribute('title') ||
                        target.textContent?.trim().slice(0, 30) ||
                        target.tagName

      // Ignore standard passive clicks without label or text
      if (!trackName || trackName.length === 0) return

      // Debounce or sample click tracking
      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'user.action',
          action: 'ELEMENT_CLICK',
          description: `Clicked on [${target.tagName.toLowerCase()}] "${trackName}" at page "${window.location.pathname}"`,
          path: window.location.pathname,
          metadata: {
            element: target.tagName,
            label: trackName,
            id: target.id || null,
            className: target.className?.slice(0, 50) || null,
          },
        }),
      }).catch(() => {})
    }

    window.addEventListener('click', handleClick, { capture: true })
    return () => window.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return <>{children}</>
}
