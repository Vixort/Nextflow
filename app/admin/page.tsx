'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid, Users, ScrollText, Settings, Layers,
  LogOut, Search, Bell, ChevronRight, ArrowUpRight, ArrowDownRight,
  Shield, User, ExternalLink, Loader2, UserPlus, Calendar, Clock,
  Crown, ShieldCheck, ShieldAlert, UserCog, Pencil, Trash2, X, Check,
  ChevronDown, AlertTriangle, ArrowRight, Eye, Info, MousePointer,
  Globe, Terminal, Code, Cpu, Sliders, Lock, Zap, Save, RefreshCw,
  Mail, MessageSquare, CheckCircle2, SlidersHorizontal, Sparkles, Menu,
  ArrowUp, ArrowDown, Plus, EyeOff, FileText, HelpCircle, DollarSign,
  Layout, MessageSquareQuote, Image as ImageIcon, Monitor, Smartphone,
  LayoutTemplate, Copy, Download
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import DynamicCustomSection, { CustomSectionData } from '@/components/DynamicCustomSection'
import PuckTemplateStudio from '@/components/PuckTemplateStudio'
import { WebsiteTemplate } from '@/types/supabase'
import { LUMINA_WHITE_STUDIO_PROJECT } from '@/lib/puck/multiPageUtils'

/* ═══════════════════════════════════════════════════════════
   TYPES & HIERARCHY
   ═══════════════════════════════════════════════════════════ */

type UserRole = 'owner' | 'admin' | 'moderator' | 'user'

interface UserRecord {
  id: string
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalUsers: number
  ownerCount: number
  adminCount: number
  moderatorCount: number
  userCount: number
  recentUsers: number
}

interface ActivityLogItem {
  id: string
  user_id: string | null
  username: string | null
  user_role: string | null
  event_type: 'auth.login' | 'auth.logout' | 'page_view' | 'user.action' | 'admin.action'
  action: string
  description: string
  path: string | null
  from_path: string | null
  to_path: string | null
  metadata: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

const ROLE_HIERARCHY: UserRole[] = ['owner', 'admin', 'moderator', 'user']
const ROLE_WEIGHT: Record<UserRole, number> = { owner: 100, admin: 75, moderator: 50, user: 10 }

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  owner: { label: 'Owner', icon: <Crown size={11} />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  admin: { label: 'Admin', icon: <ShieldCheck size={11} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  moderator: { label: 'Moderator', icon: <ShieldAlert size={11} />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  user: { label: 'User', icon: <User size={11} />, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
}

function outranks(a: UserRole, b: UserRole) { return ROLE_WEIGHT[a] > ROLE_WEIGHT[b] }

/* ═══════════════════════════════════════════════════════════
   NEXTFLOW LOGO
   ═══════════════════════════════════════════════════════════ */

function NextflowLogo({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" className="text-white/20" />
      <path d="M10 22L10 10L16 16L22 10L22 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white" />
      <circle cx="22" cy="10" r="2" fill="currentColor" className="text-cyan-400" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { id: 'Overview', icon: LayoutGrid, label: 'Overview' },
  { id: 'Users', icon: Users, label: 'Users' },
  { id: 'Templates', icon: LayoutTemplate, label: 'Website Templates' },
  { id: 'Sections', icon: Layers, label: 'Page Components' },
  { id: 'Logs', icon: ScrollText, label: 'Audit Trail' },
  { id: 'Settings', icon: Settings, label: 'Settings' },
]

function Sidebar({ activeTab, onTabChange, isOpen, onClose }: { activeTab: string; onTabChange: (t: string) => void; isOpen: boolean; onClose: () => void }) {
  const [hoverExpanded, setHoverExpanded] = useState(false)
  const router = useRouter()
  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }

  const expanded = hoverExpanded || isOpen

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity" />
      )}

      <aside
        onMouseEnter={() => setHoverExpanded(true)}
        onMouseLeave={() => setHoverExpanded(false)}
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#090a0f]/90 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full lg:translate-x-0'
        } ${hoverExpanded ? 'lg:w-[240px]' : 'lg:w-[70px]'}`}
      >
        <div className="h-[60px] flex items-center justify-between border-b border-white/10 px-4 shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="shrink-0 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-105 transition-transform">
              <NextflowLogo size={24} />
            </div>
            <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-sm font-extrabold tracking-tight text-white">NEXTFLOW<span className="text-cyan-400">.</span></span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase ml-2">Admin</span>
            </div>
          </Link>
          {isOpen && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg">
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1.5 px-3 overflow-hidden">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon; const isActive = activeTab === item.id
            return (
              <button key={item.id} onClick={() => { onTabChange(item.id); onClose(); }} title={item.label}
                className={`flex items-center gap-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${expanded ? 'px-3.5 py-2.5' : 'px-0 py-2.5 justify-center'} ${
                  isActive
                    ? 'bg-cyan-500/15 text-white font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-cyan-400" />}
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className={`text-xs font-semibold whitespace-nowrap transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 w-0'}`}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0 space-y-1">
          <Link href="/" className={`flex items-center gap-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all ${expanded ? 'px-3.5 py-2' : 'px-0 py-2 justify-center'}`}>
            <ExternalLink size={16} className="shrink-0 text-slate-400" />
            <span className={`text-xs font-semibold whitespace-nowrap transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 w-0'}`}>View Site</span>
          </Link>
          <button onClick={handleLogout} className={`flex items-center gap-3 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full ${expanded ? 'px-3.5 py-2' : 'px-0 py-2 justify-center'}`}>
            <LogOut size={16} className="shrink-0 text-slate-400" />
            <span className={`text-xs font-semibold whitespace-nowrap transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 w-0'}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════ */

export default function NextflowAdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [adminUser, setAdminUser] = useState<UserRecord | null>(null)
  const [allUsers, setAllUsers] = useState<UserRecord[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Active Studio Mode State
  const [activeStudioTemplate, setActiveStudioTemplate] = useState<Partial<WebsiteTemplate> | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [meRes, dashRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/admin/dashboard'),
      ])
      if (meRes.ok) { const d = await meRes.json(); if (d?.data?.user) setAdminUser(d.data.user) }
      if (dashRes.ok) { const d = await dashRes.json(); if (d?.data) { setAllUsers(d.data.users || []); setStats(d.data.stats || null) } }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#090a0f]"><Loader2 className="w-7 h-7 text-cyan-400 animate-spin" /></div>

  // If in Puck Studio Mode, render full-screen PuckTemplateStudio
  if (activeStudioTemplate) {
    return (
      <PuckTemplateStudio
        template={activeStudioTemplate}
        onBack={() => setActiveStudioTemplate(null)}
        onSave={async (updatedData) => {
          if (activeStudioTemplate.id) {
            // Update existing
            const res = await fetch(`/api/admin/templates/${activeStudioTemplate.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
            })
            if (!res.ok) {
              const body = await res.json().catch(() => null)
              const msg = body?.details ? `${body.error}: ${typeof body.details === 'string' ? body.details : JSON.stringify(body.details)}` : (body?.error || 'Failed to save template')
              throw new Error(msg)
            }
          } else {
            // Create new
            const res = await fetch('/api/admin/templates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
            })
            const data = await res.json()
            if (!res.ok) {
              const msg = data?.details ? `${data.error}: ${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}` : (data?.error || 'Failed to create template')
              throw new Error(msg)
            }
            if (data?.data?.template) {
              setActiveStudioTemplate(data.data.template)
            }
          }
        }}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#090a0f] text-slate-200 font-sans selection:bg-cyan-500/30 text-xs">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0 bg-[#090a0f] relative">
        <header className="h-[60px] flex items-center justify-between px-4 sm:px-6 border-b border-white/10 shrink-0 bg-[#090a0f]/80 backdrop-blur-xl relative z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold hidden sm:inline">Admin</span>
              <ChevronRight size={12} className="text-slate-600 hidden sm:inline" />
              <span className="text-white font-bold tracking-wide">{activeTab}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative hidden md:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." className="w-44 lg:w-56 h-8 pl-8.5 pr-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors" />
            </div>
            <button className="relative text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </button>
            <Link href="/settings" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">{adminUser?.username || 'Admin'}</p>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${ROLE_CONFIG[adminUser?.role || 'admin'].color}`}>{ROLE_CONFIG[adminUser?.role || 'admin'].label}</p>
              </div>
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 group-hover:border-cyan-400 transition-colors">
                {adminUser?.avatar_url ? <img src={adminUser.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">{adminUser?.username?.charAt(0).toUpperCase() || 'A'}</div>}
              </div>
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          {activeTab === 'Overview' && <OverviewTab adminUser={adminUser} allUsers={allUsers} stats={stats} />}
          {activeTab === 'Users' && <UsersTab allUsers={allUsers} currentUser={adminUser} onRefresh={fetchAll} />}
          {activeTab === 'Templates' && <TemplatesTab onOpenStudio={template => setActiveStudioTemplate(template)} />}
          {activeTab === 'Sections' && <SectionsTab />}
          {activeTab === 'Logs' && <LogsTab />}
          {activeTab === 'Settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════════ */

function OverviewTab({ adminUser, allUsers, stats }: { adminUser: UserRecord | null; allUsers: UserRecord[]; stats: DashboardStats | null }) {
  const greeting = useMemo(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }, [])
  const registrationByDay = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; const counts = new Array(7).fill(0)
    allUsers.forEach(u => { counts[new Date(u.created_at).getDay()]++ })
    return days.map((n, i) => ({ day: n, users: counts[i] }))
  }, [allUsers])
  const roleData = useMemo(() => [
    { name: 'Owner', value: stats?.ownerCount || 0 },
    { name: 'Admin', value: stats?.adminCount || 0 },
    { name: 'Moderator', value: stats?.moderatorCount || 0 },
    { name: 'User', value: stats?.userCount || 0 },
  ].filter(d => d.value > 0), [stats])
  const DONUT_COLORS = ['#fbbf24', '#22d3ee', '#c084fc', '#94a3b8']
  const recentActivity = useMemo(() => [...allUsers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5), [allUsers])

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-in fade-in duration-500">
      <div className="rounded-xl p-6 relative overflow-hidden bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Workspace Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
            {greeting}, <span className="text-cyan-400">{adminUser?.username || 'Admin'}</span>
          </h1>
          <p className="text-slate-400 text-xs mb-4">Telemetry and member stats for your Nextflow workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Total Users" value={String(stats?.totalUsers || 0)} trend={`+${stats?.recentUsers || 0} this week`} trendUp icon={<Users size={18} />} accent="border-l-cyan-400" />
        <MetricCard label="Owners & Admins" value={String((stats?.ownerCount || 0) + (stats?.adminCount || 0))} trend="Privileged" trendUp icon={<Crown size={18} />} accent="border-l-amber-400" />
        <MetricCard label="Moderators" value={String(stats?.moderatorCount || 0)} trend="Content Team" trendUp icon={<ShieldAlert size={18} />} accent="border-l-purple-400" />
        <MetricCard label="Standard Members" value={String(stats?.userCount || 0)} trend={`${stats?.totalUsers ? Math.round((stats.userCount / stats.totalUsers) * 100) : 0}%`} trendUp icon={<User size={18} />} accent="border-l-emerald-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-xl p-5 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-base font-bold text-white tracking-tight">User Registrations</h2><p className="text-xs text-slate-400">Weekly breakdown</p></div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dx={-8} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: '#090a0f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }} />
                <Bar dataKey="users" name="Registrations" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-xl p-5 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg">
            <h3 className="text-xs font-bold text-white mb-3">Role Distribution</h3>
            {roleData.length > 0 ? (<>
              <div className="h-36 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={roleData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value" stroke="none">{roleData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: '#090a0f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }} /></PieChart></ResponsiveContainer></div>
              <div className="flex justify-center gap-3 mt-1 text-xs font-semibold flex-wrap">{roleData.map((d, i) => <span key={d.name} className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />{d.name} ({d.value})</span>)}</div>
            </>) : <p className="text-slate-500 text-xs text-center py-4">No users yet</p>}
          </div>
          <div className="rounded-xl p-5 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg flex-1">
            <h3 className="text-xs font-bold text-white mb-3">Recent Members</h3>
            <div className="space-y-2.5">
              {recentActivity.length > 0 ? recentActivity.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <UserAvatar user={u} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white font-bold truncate">{u.username}</p>
                    <p className="text-[10px] text-slate-400">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
              )) : <p className="text-slate-500 text-xs text-center py-2">No members yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   USERS TAB
   ═══════════════════════════════════════════════════════════ */

function UsersTab({ allUsers, currentUser, onRefresh }: { allUsers: UserRecord[]; currentUser: UserRecord | null; onRefresh: () => Promise<void> }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('user')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const myRole = (currentUser?.role || 'user') as UserRole

  const filtered = useMemo(() => {
    let list = allUsers
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.full_name || '').toLowerCase().includes(q))
    }
    return list
  }, [allUsers, search, roleFilter])

  const assignableRoles = useMemo(() => ROLE_HIERARCHY.filter(r => outranks(myRole, r)), [myRole])

  const startEdit = (user: UserRecord) => { setEditingUserId(user.id); setEditRole(user.role); setError(null) }
  const cancelEdit = () => { setEditingUserId(null); setError(null) }

  const saveRole = async (userId: string) => {
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: editRole }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to update'); return }
      setSuccessMsg(`Role updated to "${editRole}"`)
      setEditingUserId(null)
      await onRefresh()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch { setError('Network error') } finally { setSaving(false) }
  }

  const deleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return
    setDeleting(userId); setError(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to delete'); return }
      setSuccessMsg(`User "${username}" deleted`)
      await onRefresh()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch { setError('Network error') } finally { setDeleting(null) }
  }

  const canManage = (targetUser: UserRecord) => {
    if (targetUser.id === currentUser?.id) return false
    return outranks(myRole, targetUser.role as UserRole)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">User Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">{allUsers.length} registered members.</p>
        </div>
        <Link href="/register" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md">
          <UserPlus size={14} /> Add Member
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <AlertTriangle size={15} /> {error}
          <button onClick={() => setError(null)} className="ml-auto hover:text-white"><X size={14} /></button>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Check size={15} /> {successMsg}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['all', ...ROLE_HIERARCHY] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${roleFilter === r ? 'bg-cyan-500/20 text-white border-cyan-500/40' : 'text-slate-400 border-white/5 bg-[#0f111a] hover:text-white'}`}>
              {r === 'all' ? 'All Roles' : ROLE_CONFIG[r].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-x-auto bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="uppercase tracking-wider text-slate-400 font-bold border-b border-white/10 bg-white/[0.02]">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Joined</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const isEditing = editingUserId === u.id
              const manageable = canManage(u)
              const isSelf = u.id === currentUser?.id

              return (
                <tr key={u.id} className={`border-b border-white/5 last:border-0 transition-colors ${isEditing ? 'bg-cyan-500/[0.05]' : 'hover:bg-white/[0.02]'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={u} size="sm" />
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {u.full_name || u.username}
                          {isSelf && <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">You</span>}
                        </p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select value={editRole} onChange={e => setEditRole(e.target.value as UserRole)}
                        className="bg-[#090a0f] border border-cyan-500/50 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none">
                        {assignableRoles.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}
                      </select>
                    ) : (
                      <RoleBadge role={u.role} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => saveRole(u.id)} disabled={saving} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500">
                          {saving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                        </button>
                        <button onClick={cancelEdit} className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
                          Cancel
                        </button>
                      </div>
                    ) : manageable ? (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                          <UserCog size={15} />
                        </button>
                        <button onClick={() => deleteUser(u.id, u.username)} disabled={deleting === u.id} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10">
                          {deleting === u.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-semibold">{isSelf ? 'Self' : '-'}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   WEBSITE TEMPLATES MANAGEMENT TAB (PUCK STUDIO INTEGRATION)
   ═══════════════════════════════════════════════════════════ */

function TemplatesTab({ onOpenStudio }: { onOpenStudio: (tpl: Partial<WebsiteTemplate>) => void }) {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Landing Page')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/templates')
      if (res.ok) {
        const d = await res.json()
        if (d?.data?.templates) {
          setTemplates(d.data.templates)
        }
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  const handleCreateNew = async () => {
    if (!newName.trim()) {
      alert('Please enter a template name')
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          category: newCat,
          description: newDesc || 'Custom Puck Studio website template',
        }),
      })

      const data = await res.json()
      if (res.ok && data?.data?.template) {
        setCreateModalOpen(false)
        setNewName('')
        setNewDesc('')
        // Open in Studio Mode
        onOpenStudio(data.data.template)
      } else {
        const errMsg = data?.details ? `${data.error}: ${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}` : (data?.error || 'Failed to create template')
        alert(errMsg)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTemplates(prev => prev.filter(t => t.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete template:', err)
    }
  }

  const handleCloneTemplate = async (tpl: WebsiteTemplate) => {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${tpl.name} (Copy)`,
          category: tpl.category,
          description: tpl.description,
          thumbnail_url: tpl.thumbnail_url,
          puck_data: tpl.puck_data,
          global_css: tpl.global_css,
        }),
      })
      const data = await res.json()
      if (res.ok && data?.data?.template) {
        await fetchTemplates()
      }
    } catch (err) {
      console.error('Failed to clone template:', err)
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return templates
    const q = search.toLowerCase()
    return templates.filter(t => t.name.toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q))
  }, [templates, search])

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Website Templates Studio</h1>
          <p className="text-xs text-slate-400 mt-0.5">Build and customize high-converting landing pages using Puck Studio visual editor.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md cursor-pointer"
        >
          <Plus size={15} /> Create Website Template
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search website templates..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-cyan-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0f111a]/60 rounded-xl border border-white/10">
          <LayoutTemplate size={32} className="mx-auto text-slate-600 mb-2" />
          <h3 className="text-sm font-bold text-white">No website templates found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Click below to create your first visual template with Puck Studio.</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            + Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(tpl => (
            <div
              key={tpl.id}
              className="rounded-xl overflow-hidden bg-[#0f111a]/90 border border-white/10 hover:border-cyan-500/40 transition-all group flex flex-col shadow-lg"
            >
              {/* Thumbnail */}
              <div className="h-44 bg-[#090a0f] relative overflow-hidden">
                <img
                  src={tpl.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {tpl.category || 'Landing Page'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {tpl.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {tpl.description || 'Custom visual Puck Studio template'}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenStudio(tpl)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pencil size={13} /> Edit in Studio
                  </button>
                  <button
                    onClick={() => handleCloneTemplate(tpl)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                    title="Clone Template"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                    className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                    title="Delete Template"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TEMPLATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl p-6 bg-[#11131f] border border-white/15 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Create New Website Template</h3>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Template Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. AI SaaS Launchpad"
                  className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Landing Page">Landing Page</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Blog / News">Blog / News</option>
                  <option value="Dashboard UI">Dashboard UI</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Brief summary of template layout..."
                  className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
              <button
                onClick={handleCreateNew}
                disabled={creating}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 flex items-center gap-1.5"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Launch Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DYNAMIC PAGE COMPONENTS & NO-CODE BUILDER TAB (WITH LIVE PREVIEW)
   ═══════════════════════════════════════════════════════════ */

function SectionsTab() {
  const [sections, setSections] = useState<CustomSectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>('banner')
  const [newSecTitle, setNewSecTitle] = useState('New Custom Section')
  const [newSecSubtitle, setNewSecSubtitle] = useState('Dynamically injected section description.')
  const [newSecBadge, setNewSecBadge] = useState('FEATURED')
  const [newSecCtaText, setNewSecCtaText] = useState('Explore Now')
  const [newSecCtaLink, setNewSecCtaLink] = useState('#builder')
  const [newSecImageUrl, setNewSecImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80')

  // Edit Custom Section Modal State
  const [editingSection, setEditingSection] = useState<CustomSectionData | null>(null)

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/sections')
      if (res.ok) {
        const d = await res.json()
        if (d?.data?.sections) {
          setSections(d.data.sections)
        }
      }
    } catch (err) {
      console.error('Failed to load sections:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSections() }, [fetchSections])

  const saveSectionsToDb = async (updatedList: CustomSectionData[]) => {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updatedList }),
      })

      const data = await res.json()
      if (res.ok) {
        setSections(data.data.sections)
        setFeedback({ type: 'success', message: 'Home page layout saved to Supabase!' })
        setTimeout(() => setFeedback(null), 3500)
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to save layout' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= sections.length) return

    const newList = [...sections]
    const temp = newList[index]
    newList[index] = newList[targetIdx]
    newList[targetIdx] = temp

    newList.forEach((s, idx) => { s.order = idx + 1 })
    setSections(newList)
  }

  const toggleVisibility = (index: number) => {
    const newList = [...sections]
    newList[index].visible = !newList[index].visible
    setSections(newList)
  }

  const deleteCustomSection = (id: string) => {
    const sec = sections.find(s => s.id === id)
    if (sec?.is_builtin) {
      alert('Built-in code sections cannot be deleted. You can hide them instead.')
      return
    }
    if (!confirm('Are you sure you want to remove this custom section?')) return
    const newList = sections.filter(s => s.id !== id)
    newList.forEach((s, idx) => { s.order = idx + 1 })
    setSections(newList)
  }

  const getDefaultItemsForTemplate = (tpl: string) => {
    if (tpl === 'bento') {
      return [
        { title: 'Interactive Workflows', description: 'Visual pipeline builder with live telemetry' },
        { title: 'Database Integration', description: 'Native Supabase RLS and automated schemas' },
        { title: 'Real-time Telemetry', description: 'Instant audit logs and user activity tracking' },
      ]
    } else if (tpl === 'testimonials') {
      return [
        { author: 'Sarah Jenkins', role: 'CTO at CloudTech', description: 'Nextflow cut our development cycle in half!', avatar: '' },
        { author: 'Alex Chen', role: 'Lead Architect', description: 'The custom section manager is incredibly smooth.', avatar: '' },
      ]
    } else if (tpl === 'faq') {
      return [
        { title: 'Is Nextflow production ready?', description: 'Yes, Nextflow uses full Supabase database persistence.' },
        { title: 'Can I add custom sections without coding?', description: 'Yes, using this Live Preview Section Manager!' },
      ]
    } else if (tpl === 'pricing') {
      return [
        { title: 'Starter', price: '$29', period: 'mo', features: ['Unlimited Workflows', '5 Team Members'], highlight: false },
        { title: 'Enterprise', price: '$99', period: 'mo', features: ['Custom Integrations', 'Dedicated Support'], highlight: true },
      ]
    }
    return []
  }

  // Construct Live Preview Data for Add Modal
  const addModalPreviewSection: CustomSectionData = useMemo(() => ({
    id: 'preview-temp-id',
    name: newSecTitle || 'Live Section Preview',
    type: 'custom',
    order: 1,
    visible: true,
    is_builtin: false,
    custom_data: {
      template_type: selectedTemplate,
      title: newSecTitle || 'Your Section Title',
      subtitle: newSecSubtitle || 'Section description or subtitle goes here.',
      badge: newSecBadge,
      cta_text: newSecCtaText,
      cta_link: newSecCtaLink,
      image_url: newSecImageUrl,
      items: getDefaultItemsForTemplate(selectedTemplate),
    },
  }), [selectedTemplate, newSecTitle, newSecSubtitle, newSecBadge, newSecCtaText, newSecCtaLink, newSecImageUrl])

  const handleCreateCustomSection = () => {
    if (!newSecTitle.trim()) {
      alert('Please enter a section title')
      return
    }

    const newId = `custom-sec-${Date.now()}`
    const newSec: CustomSectionData = {
      id: newId,
      name: newSecTitle,
      type: 'custom',
      order: sections.length + 1,
      visible: true,
      is_builtin: false,
      custom_data: { ...addModalPreviewSection.custom_data! },
    }

    const updated = [...sections, newSec]
    setSections(updated)
    setAddModalOpen(false)
  }

  const handleUpdateCustomSection = () => {
    if (!editingSection) return
    const updatedList = sections.map(s => s.id === editingSection.id ? editingSection : s)
    setSections(updatedList)
    setEditingSection(null)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Home Page Component Manager</h1>
          <p className="text-xs text-slate-400 mt-0.5">Reorder UI sections, toggle visibility, and create new no-code sections with Live Preview.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md cursor-pointer"
          >
            <Plus size={15} /> Add New Section
          </button>
          <button
            onClick={() => saveSectionsToDb(sections)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Home Layout</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold ${
          feedback.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-slate-400 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* Section List Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-cyan-400 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {sections.map((sec, index) => (
            <div
              key={sec.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                sec.visible ? 'bg-[#0f111a]/90 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white truncate">{sec.name}</h3>
                    {sec.is_builtin ? (
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Built-in Code Component
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Custom No-Code ({sec.custom_data?.template_type?.toUpperCase()})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    ID: <span className="font-mono text-slate-500">{sec.id}</span>
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleVisibility(index)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    sec.visible
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                </button>

                {!sec.is_builtin && (
                  <button
                    onClick={() => setEditingSection(sec)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                    title="Edit custom content & Preview"
                  >
                    <Pencil size={15} />
                  </button>
                )}

                {!sec.is_builtin ? (
                  <button
                    onClick={() => deleteCustomSection(sec.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                    title="Remove custom section"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono italic px-2">Readonly</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DUAL-PANE ADD SECTION MODAL (WITH REALTIME LIVE PREVIEW) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-6xl rounded-2xl bg-[#0d0f19] border border-white/15 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#11131f] shrink-0">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Add New Section — Live Interactive Builder</h3>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg"><X size={18} /></button>
            </div>

            {/* Modal Body: Split 2 Columns */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden">
              {/* LEFT COLUMN: Controls & Form (5 Cols) */}
              <div className="lg:col-span-5 p-6 space-y-5 border-r border-white/10 overflow-y-auto bg-[#11131f]/60">
                {/* Template Chooser */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">Select Section Template:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'banner', label: 'Promo Banner', icon: Layout },
                      { id: 'bento', label: 'Feature Bento', icon: Zap },
                      { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
                      { id: 'faq', label: 'FAQ Accordion', icon: HelpCircle },
                      { id: 'pricing', label: 'Pricing Table', icon: DollarSign },
                    ].map(t => {
                      const Icon = t.icon
                      const isSelected = selectedTemplate === t.id
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTemplate(t.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold' : 'bg-[#161a29] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon size={15} className={isSelected ? 'text-cyan-400' : 'text-slate-400'} />
                          <span className="text-[11px]">{t.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3.5 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={newSecTitle}
                      onChange={e => setNewSecTitle(e.target.value)}
                      placeholder="Enter section title..."
                      className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Subtitle / Description</label>
                    <input
                      type="text"
                      value={newSecSubtitle}
                      onChange={e => setNewSecSubtitle(e.target.value)}
                      placeholder="Enter subtitle..."
                      className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newSecBadge}
                        onChange={e => setNewSecBadge(e.target.value)}
                        placeholder="e.g. NEW FEATURE"
                        className="w-full h-9 px-3 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={newSecImageUrl}
                        onChange={e => setNewSecImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full h-9 px-3 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={newSecCtaText}
                        onChange={e => setNewSecCtaText(e.target.value)}
                        placeholder="Explore Now"
                        className="w-full h-9 px-3 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">CTA Button Link</label>
                      <input
                        type="text"
                        value={newSecCtaLink}
                        onChange={e => setNewSecCtaLink(e.target.value)}
                        placeholder="#builder"
                        className="w-full h-9 px-3 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Realtime Live Visual Canvas (7 Cols) */}
              <div className="lg:col-span-7 bg-[#090a0f] p-6 flex flex-col min-h-0 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Monitor size={15} />
                    <span>Real-Time Visual Canvas Preview</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Live Rendering Mode
                  </span>
                </div>

                <div className="flex-1 rounded-xl border border-white/15 bg-[#090a0f] overflow-y-auto p-2 shadow-inner relative">
                  <DynamicCustomSection section={addModalPreviewSection} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#11131f] shrink-0">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCustomSection}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md cursor-pointer"
              >
                Add Section to Home Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUAL-PANE EDIT SECTION MODAL (WITH REALTIME LIVE PREVIEW) */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-6xl rounded-2xl bg-[#0d0f19] border border-white/15 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#11131f] shrink-0">
              <div className="flex items-center gap-2">
                <Pencil size={18} className="text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Edit Custom Section — Live Preview Mode</h3>
              </div>
              <button onClick={() => setEditingSection(null)} className="text-slate-400 hover:text-white p-1 rounded-lg"><X size={18} /></button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden">
              {/* Left Column Controls */}
              <div className="lg:col-span-5 p-6 space-y-4 border-r border-white/10 overflow-y-auto bg-[#11131f]/60">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingSection.custom_data?.title || ''}
                    onChange={e => {
                      const val = e.target.value
                      setEditingSection(prev => prev ? ({
                        ...prev,
                        name: val,
                        custom_data: { ...prev.custom_data!, title: val }
                      }) : null)
                    }}
                    className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingSection.custom_data?.subtitle || ''}
                    onChange={e => {
                      const val = e.target.value
                      setEditingSection(prev => prev ? ({
                        ...prev,
                        custom_data: { ...prev.custom_data!, subtitle: val }
                      }) : null)
                    }}
                    className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingSection.custom_data?.badge || ''}
                    onChange={e => {
                      const val = e.target.value
                      setEditingSection(prev => prev ? ({
                        ...prev,
                        custom_data: { ...prev.custom_data!, badge: val }
                      }) : null)
                    }}
                    className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingSection.custom_data?.cta_text || ''}
                    onChange={e => {
                      const val = e.target.value
                      setEditingSection(prev => prev ? ({
                        ...prev,
                        custom_data: { ...prev.custom_data!, cta_text: val }
                      }) : null)
                    }}
                    className="w-full h-9 px-3.5 rounded-xl bg-[#161a29] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Right Column Live Preview */}
              <div className="lg:col-span-7 bg-[#090a0f] p-6 flex flex-col min-h-0 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Monitor size={15} />
                    <span>Real-Time Preview Viewport</span>
                  </div>
                </div>

                <div className="flex-1 rounded-xl border border-white/15 bg-[#090a0f] overflow-y-auto p-2 relative">
                  <DynamicCustomSection section={editingSection} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#11131f] shrink-0">
              <button onClick={() => setEditingSection(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleUpdateCustomSection} className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400">Save Edits</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LOGS / AUDIT TRAIL TAB
   ═══════════════════════════════════════════════════════════ */

function LogsTab() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (eventTypeFilter !== 'all') params.append('event_type', eventTypeFilter)
      if (search.trim()) params.append('search', search.trim())

      const res = await fetch(`/api/activity?${params.toString()}`)
      if (res.ok) {
        const d = await res.json()
        setLogs(d?.data?.logs || [])
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err)
    } finally {
      setLoading(false)
    }
  }, [eventTypeFilter, search])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Audit Trail</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time user & activity logs.</p>
        </div>
        <button onClick={fetchLogs} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white">
          <Clock size={13} /> Refresh
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'auth.login', label: 'Logins' },
            { id: 'page_view', label: 'Pages' },
            { id: 'user.action', label: 'Clicks' },
            { id: 'admin.action', label: 'Admin' },
          ].map(f => (
            <button key={f.id} onClick={() => setEventTypeFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${eventTypeFilter === f.id ? 'bg-cyan-500/20 text-white border-cyan-500/40' : 'text-slate-400 border-white/5 bg-[#0f111a]'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-x-auto bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg text-xs">
        <table className="w-full">
          <thead>
            <tr className="uppercase tracking-wider text-slate-400 font-bold border-b border-white/10 bg-white/[0.02]">
              <th className="text-left px-4 py-3">Action</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Path</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <EventTypeBadge type={log.event_type} />
                    <div>
                      <p className="font-bold text-white text-xs">{log.action}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{log.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-white">{log.username || 'Anon'}</td>
                <td className="px-4 py-3 hidden md:table-cell text-cyan-300 font-mono text-[11px]">{log.path || '/'}</td>
                <td className="px-4 py-3 text-slate-400 hidden sm:table-cell text-[11px]">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EventTypeBadge({ type }: { type: ActivityLogItem['event_type'] }) {
  switch (type) {
    case 'auth.login':
      return <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"><Globe size={13} /></span>
    case 'page_view':
      return <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"><ArrowRight size={13} /></span>
    case 'user.action':
      return <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30"><MousePointer size={13} /></span>
    case 'admin.action':
      return <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30"><Shield size={13} /></span>
    default:
      return <span className="p-1.5 rounded-lg bg-slate-500/15 text-slate-300 border border-slate-500/30"><Info size={13} /></span>
  }
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS TAB
   ═══════════════════════════════════════════════════════════ */

type SettingsCategory = 'general' | 'security' | 'workflow' | 'notifications'

function SettingsTab() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settingsData, setSettingsData] = useState<any>({
    general: { platform_name: 'NEXTFLOW', support_email: 'support@nextflow.dev', maintenance_mode: false, public_registration: true },
    security: { session_timeout_days: 7, max_login_attempts: 5, require_email_verify: false, mfa_required: false },
    workflow: { max_concurrent_jobs: 10, default_timeout_minutes: 30, log_retention_days: 30, auto_retry_failed: true },
    notifications: { alert_email: 'admin@nextflow.com', slack_webhook: '', notify_on_failure: true },
  })
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const d = await res.json()
        if (d?.data?.settings) setSettingsData(d.data.settings)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const handleSaveCategory = async (categoryKey: SettingsCategory) => {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryKey,
          settings: settingsData[categoryKey],
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setFeedback({ type: 'success', message: `Saved "${categoryKey}" settings to Supabase.` })
        setTimeout(() => setFeedback(null), 3500)
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to save settings.' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (categoryKey: SettingsCategory, field: string, value: any) => {
    setSettingsData((prev: any) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [field]: value,
      },
    }))
  }

  const categories = [
    { id: 'general', label: 'General Platform', icon: SlidersHorizontal, desc: 'Platform identity' },
    { id: 'security', label: 'Security & Auth', icon: Lock, desc: 'Sessions & passwords' },
    { id: 'workflow', label: 'Workflow Engine', icon: Zap, desc: 'Execution limits' },
    { id: 'notifications', label: 'Alerts & Webhooks', icon: Bell, desc: 'Failure webhooks' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Workspace parameters persisted to Supabase.</p>
      </div>

      {feedback && (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold ${
          feedback.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-slate-400 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-cyan-400 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as SettingsCategory)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all border shrink-0 lg:w-full cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-white font-bold border-cyan-500/30 shadow-sm'
                      : 'bg-[#0f111a]/80 text-slate-400 border-white/5 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold whitespace-nowrap">{cat.label}</h4>
                    <p className="text-[10px] text-slate-500 hidden lg:block font-normal truncate">{cat.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="lg:col-span-3 rounded-xl p-6 space-y-6 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-xl">
            {activeCategory === 'general' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-sm font-bold text-white">General Platform Identity</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Platform Name</label>
                    <input
                      type="text"
                      value={settingsData.general.platform_name}
                      onChange={e => updateField('general', 'platform_name', e.target.value)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settingsData.general.support_email}
                      onChange={e => updateField('general', 'support_email', e.target.value)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <SettingToggleRow
                    title="Public User Registration"
                    description="Allow new users to sign up from the register page."
                    checked={settingsData.general.public_registration}
                    onChange={val => updateField('general', 'public_registration', val)}
                  />
                  <SettingToggleRow
                    title="Maintenance Mode"
                    description="Restrict user access for platform updates."
                    checked={settingsData.general.maintenance_mode}
                    onChange={val => updateField('general', 'maintenance_mode', val)}
                  />
                </div>
              </div>
            )}

            {activeCategory === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-sm font-bold text-white">Security & Auth Policies</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Session Expiry (Days)</label>
                    <input
                      type="number"
                      value={settingsData.security.session_timeout_days}
                      onChange={e => updateField('security', 'session_timeout_days', parseInt(e.target.value, 10) || 7)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Max Failed Logins</label>
                    <input
                      type="number"
                      value={settingsData.security.max_login_attempts}
                      onChange={e => updateField('security', 'max_login_attempts', parseInt(e.target.value, 10) || 5)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <SettingToggleRow
                    title="Require Email Verification"
                    description="Require verification link before account activation."
                    checked={settingsData.security.require_email_verify}
                    onChange={val => updateField('security', 'require_email_verify', val)}
                  />
                  <SettingToggleRow
                    title="Enforce Multi-Factor Auth (MFA)"
                    description="Require 2-step verification for Admin/Owner roles."
                    checked={settingsData.security.mfa_required}
                    onChange={val => updateField('security', 'mfa_required', val)}
                  />
                </div>
              </div>
            )}

            {activeCategory === 'workflow' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-sm font-bold text-white">Workflow Engine Rules</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Max Concurrent Jobs</label>
                    <input
                      type="number"
                      value={settingsData.workflow.max_concurrent_jobs}
                      onChange={e => updateField('workflow', 'max_concurrent_jobs', parseInt(e.target.value, 10) || 10)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Timeout (Mins)</label>
                    <input
                      type="number"
                      value={settingsData.workflow.default_timeout_minutes}
                      onChange={e => updateField('workflow', 'default_timeout_minutes', parseInt(e.target.value, 10) || 30)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Log Retention (Days)</label>
                    <input
                      type="number"
                      value={settingsData.workflow.log_retention_days}
                      onChange={e => updateField('workflow', 'log_retention_days', parseInt(e.target.value, 10) || 30)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <SettingToggleRow
                    title="Auto-Retry Failed Builds"
                    description="Automatically retry failed workflow jobs."
                    checked={settingsData.workflow.auto_retry_failed}
                    onChange={val => updateField('workflow', 'auto_retry_failed', val)}
                  />
                </div>
              </div>
            )}

            {activeCategory === 'notifications' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-sm font-bold text-white">Alerts & Integration Webhooks</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Admin Alert Email</label>
                    <input
                      type="email"
                      value={settingsData.notifications.alert_email}
                      onChange={e => updateField('notifications', 'alert_email', e.target.value)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">Slack Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://hooks.slack.com/..."
                      value={settingsData.notifications.slack_webhook}
                      onChange={e => updateField('notifications', 'slack_webhook', e.target.value)}
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <SettingToggleRow
                    title="Instant Failure Alerts"
                    description="Send immediate alerts when workflow jobs fail."
                    checked={settingsData.notifications.notify_on_failure}
                    onChange={val => updateField('notifications', 'notify_on_failure', val)}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => handleSaveCategory(activeCategory)}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-md"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save {activeCategory.toUpperCase()} Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-white">{title}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 shrink-0 cursor-pointer ${
          checked ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'
        }`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4.5 bg-slate-950' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function UserAvatar({ user, size = 'md' }: { user: UserRecord; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
  return (
    <div className={`${dim} rounded-lg overflow-hidden shrink-0 border border-white/10`}>
      {user.avatar_url ? (
        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-[10px]">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

function RoleBadge({ role }: { role: UserRole }) {
  const cfg = ROLE_CONFIG[role]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

function MetricCard({ label, value, trend, trendUp, accent, icon }: { label: string; value: string; trend: string; trendUp: boolean; accent: string; icon: React.ReactNode }) {
  return (
    <div className={`rounded-xl p-4 sm:p-5 border-l-4 ${accent} bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-lg`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300">{icon}</div>
        <span className={`text-[10px] font-extrabold flex items-center gap-0.5 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}
        </span>
      </div>
      <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">{value}</h3>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </div>
  )
}
