'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { Settings, LogOut, ChevronDown, Shield, Mail } from 'lucide-react'

type UserProfile = {
  id: string
  email: string
  username: string
  full_name?: string | null
  avatar_url?: string | null
  role?: string | null
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const router = useRouter()
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const json = await res.json()
          setUser(json.data?.user || null)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore network errors on logout
    }
    setUser(null)
    setIsMobileMenuOpen(false)
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    // Entrance Animation via GSAP
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })

      tl.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          logoRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1 },
          '-=0.3'
        )
        .fromTo(
          '.nav-item',
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          '-=0.3'
        )
    }, navRef)

    return () => ctx.revert()
  }, [])

  // Animate Mobile Menu Open/Close
  useEffect(() => {
    if (!mobileMenuRef.current) return

    if (isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        '.mobile-nav-link',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.05, ease: 'power2.out', delay: 0.05 }
      )
    }
  }, [isMobileMenuOpen])

  const username = user?.username || user?.full_name || 'Account'
  const displayInitial = username.charAt(0).toUpperCase()

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 w-full z-50 px-6 sm:px-12 py-5 bg-[#090a0f]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div ref={logoRef} className="flex items-center gap-2">
          <Link href="/" className="group flex items-center gap-3">
            {/* Custom SVG Logo: Abstract N / Flow geometry */}
            <div className="relative flex items-center justify-center w-8 h-8 group-hover:scale-105 transition-transform duration-500 ease-out">
              <svg 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-full h-full"
              >
                {/* Background glowing ring */}
                <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" className="text-white/10 group-hover:text-cyan-500/30 transition-colors duration-500" />
                
                {/* Flow lines forming an 'N' */}
                <path 
                  d="M10 22L10 10L16 16L22 10L22 22" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white group-hover:text-cyan-400 transition-colors duration-500"
                />
                
                {/* Accent dot */}
                <circle cx="22" cy="10" r="2" fill="currentColor" className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </svg>
            </div>
            
            <span className="text-xl font-extrabold tracking-tighter text-white group-hover:text-slate-200 transition-colors">
              NEXTFLOW<span className="text-cyan-500">.</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav ref={linksRef} className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="nav-item text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-white transition-colors py-2 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/services"
            className="nav-item text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-white transition-colors py-2 relative group"
          >
            Services
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/templates"
            className="nav-item text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-white transition-colors py-2 relative group"
          >
            Templates
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/contact"
            className="nav-item text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-cyan-300 transition-colors py-2 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>

        {/* UI CTA Button & User Profile Dropdown */}
        <div className="flex items-center gap-6">
          <div ref={ctaRef} className="hidden sm:block">
            {loadingUser ? (
              <div className="w-24 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              /* LOGGED IN USER PROFILE: FRAMELESS LAYOUT WITH USERNAME ON LEFT, ARROW IN MIDDLE, CIRCULAR AVATAR ON RIGHT */
              <div className="relative group">
                <button
                  className="flex items-center gap-2.5 py-1 px-2 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {/* Left: Username */}
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white max-w-[130px] truncate">
                    {username}
                  </span>

                  {/* Middle: Arrow indicator */}
                  <ChevronDown
                    size={14}
                    className="text-slate-400 group-hover:text-cyan-400 transition-transform duration-300 group-hover:rotate-180"
                  />

                  {/* Right: Circular Profile Picture */}
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={username}
                      className="w-8 h-8 rounded-full object-cover border border-white/15 group-hover:border-cyan-400/60 transition-colors shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-extrabold text-xs border border-cyan-500/40 shadow-sm">
                      {displayInitial}
                    </div>
                  )}
                </button>

                {/* HOVER DROPDOWN MENU */}
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0d0e19]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-extrabold text-white truncate">
                        {user.full_name || user.username}
                      </p>
                      {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                          <Shield size={10} /> Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-cyan-500/10 hover:border hover:border-cyan-500/30 transition-all group/item mb-1"
                  >
                    <Settings size={14} className="text-cyan-400 group-hover/item:rotate-45 transition-transform" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border hover:border-rose-500/30 transition-all text-left cursor-pointer group/item"
                  >
                    <LogOut size={14} className="group-hover/item:translate-x-0.5 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              /* LOGGED OUT STATE */
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-sm text-xs font-bold tracking-[0.15em] uppercase bg-white text-slate-950 hover:bg-slate-200 transition-all active:scale-95 inline-block"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-sm text-slate-400 hover:text-white border border-white/10 bg-slate-950/50 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 w-full md:hidden flex flex-col gap-4 bg-[#090a0f]/95 backdrop-blur-2xl p-6 border-b border-white/10 shadow-2xl"
        >
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-nav-link text-xs font-semibold tracking-[0.2em] uppercase text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-nav-link text-xs font-semibold tracking-[0.2em] uppercase text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/templates"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-nav-link text-xs font-semibold tracking-[0.2em] uppercase text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-nav-link inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <Mail size={13} />
            Contact Us
          </Link>

          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-white truncate">{username}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{user.email}</p>
                  </div>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={username}
                      className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shrink-0 ml-2"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs border border-cyan-500/40 shrink-0 ml-2">
                      {displayInitial}
                    </div>
                  )}
                </div>

                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
                >
                  <Settings size={14} className="text-cyan-400" />
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 rounded-sm text-xs font-bold tracking-[0.15em] uppercase bg-white text-slate-950 text-center block hover:bg-slate-200 transition-colors"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
