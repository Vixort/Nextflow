'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Home, BarChart2, Users, FolderOpen, TerminalSquare, Settings,
  ChevronRight, ChevronDown, Link as LinkIcon, Share, Download,
  Plus, Search, MoreVertical, Activity, Key, Copy, CheckCircle2,
  Clock, Filter, ChevronLeft, Shield, Bell, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Database, Zap, Eye, EyeOff, CheckSquare, Square,
  LayoutGrid, List, SlidersHorizontal, RefreshCcw, CreditCard, Laptop,
  Server, Rocket, ScrollText, AlertTriangle, LineChart as LineChartIcon, GitCommit, 
  Cpu, HardDrive, Wifi, Info, AlertOctagon, Terminal, Play, GitBranch, 
  ArrowRight, XCircle, LogOut
} from 'lucide-react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis, Legend
} from 'recharts'

// --- Mock Data ---

const revenueData = [
  { name: 'Oct 1', revenue: 250000, users: 1200 },
  { name: 'Oct 4', revenue: 240000, users: 1300 },
  { name: 'Oct 9', revenue: 350000, users: 2100 },
  { name: 'Oct 12', revenue: 420000, users: 2800 },
  { name: 'Oct 16', revenue: 530000, users: 3400 },
  { name: 'Oct 21', revenue: 480000, users: 3100 },
  { name: 'Oct 24', revenue: 700000, users: 4800 },
  { name: 'Oct 27', revenue: 600000, users: 4200 },
  { name: 'Oct 30', revenue: 850000, users: 5900 },
]

const miniData = [{v: 10},{v: 25},{v: 15},{v: 40},{v: 30},{v: 50},{v: 45}]

const mockUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@aether.io', role: 'Admin', status: 'Active', mfa: true, date: 'Oct 30, 2026', avatar: 'Alex' },
  { id: '2', name: 'Sarah Connor', email: 's.connor@aether.io', role: 'Developer', status: 'Active', mfa: true, date: 'Oct 29, 2026', avatar: 'Sarah' },
  { id: '3', name: 'Michael Smith', email: 'm.smith@aether.io', role: 'Viewer', status: 'Offline', mfa: false, date: 'Oct 28, 2026', avatar: 'Mike' },
  { id: '4', name: 'Emma Davis', email: 'emma@aether.io', role: 'Editor', status: 'Active', mfa: true, date: 'Oct 28, 2026', avatar: 'Emma' },
  { id: '5', name: 'James Wilson', email: 'j.wilson@aether.io', role: 'Viewer', status: 'Suspended', mfa: false, date: 'Oct 25, 2026', avatar: 'James' },
  { id: '6', name: 'Olivia Martinez', email: 'olivia.m@aether.io', role: 'Developer', status: 'Offline', mfa: true, date: 'Oct 21, 2026', avatar: 'Olivia' },
]

const mockProjects = [
  { id: 'p1', title: 'Nexus Core Engine', desc: 'Main real-time processing engine rewrite.', progress: 78, status: 'In Progress', color: 'bg-cyan-500', members: 5, date: 'Nov 12', tags: ['Backend', 'C++'] },
  { id: 'p2', title: 'Mobile Client v3', desc: 'React Native app overhaul with new design system.', progress: 100, status: 'Completed', color: 'bg-emerald-500', members: 3, date: 'Oct 28', tags: ['Mobile', 'React'] },
  { id: 'p3', title: 'Global CDN Routing', desc: 'Optimizing edge routing for lower latency in AP region.', progress: 34, status: 'Active', color: 'bg-violet-500', members: 4, date: 'Dec 01', tags: ['DevOps', 'Network'] },
  { id: 'p4', title: 'Auth Service Migration', desc: 'Moving from JWT to structured opaque tokens.', progress: 92, status: 'In Progress', color: 'bg-cyan-500', members: 2, date: 'Nov 05', tags: ['Security', 'Backend'] },
  { id: 'p5', title: 'Marketing Website', desc: 'Headless CMS integration for content team.', progress: 15, status: 'Planning', color: 'bg-orange-500', members: 6, date: 'Jan 15', tags: ['Frontend', 'CMS'] },
  { id: 'p6', title: 'Data Warehouse Sync', desc: 'ETL pipeline for Snowflake ingestion.', progress: 60, status: 'Blocked', color: 'bg-rose-500', members: 1, date: 'Nov 20', tags: ['Data', 'Python'] },
]

const mockActivities = [
  { id: 'a1', user: 'Sarah Connor', action: 'deployed v2.4.1', target: 'Production', time: '2m ago', type: 'deployment', color: 'bg-emerald-500' },
  { id: 'a2', user: 'Alex Johnson', action: 'invited 3 users to', target: 'Design Team', time: '1h ago', type: 'user', color: 'bg-violet-500' },
  { id: 'a3', user: 'System', action: 'completed database backup', target: 'us-east-cluster', time: '3h ago', type: 'system', color: 'bg-slate-500' },
  { id: 'a4', user: 'Emma Davis', action: 'updated API keys for', target: 'Staging Env', time: '5h ago', type: 'security', color: 'bg-orange-500' },
  { id: 'a5', user: 'System', action: 'auto-scaled compute nodes', target: 'AP-South', time: '12h ago', type: 'system', color: 'bg-cyan-500' },
]

const mockDeployments = [
  { id: 'd1', project: 'Nexus Core', version: 'v2.4.1', status: 'Success', time: '2m ago', author: 'Sarah Connor', commit: 'a7f9b2c', branch: 'main' },
  { id: 'd2', project: 'Mobile Client v3', version: 'v3.0.0-rc.1', status: 'Building', time: '15m ago', author: 'Alex Johnson', commit: '3e4d5f6', branch: 'release/v3' },
  { id: 'd3', project: 'Auth Service', version: 'v1.12.0', status: 'Failed', time: '1h ago', author: 'Emma Davis', commit: '8b9c0d1', branch: 'fix/auth-bug' },
  { id: 'd4', project: 'Global CDN', version: 'v1.0.5', status: 'Success', time: '3h ago', author: 'System', commit: '2a3b4c5', branch: 'main' },
]

const mockInfra = [
  { id: 'i1', name: 'ap-south-db-1', type: 'Database', status: 'Healthy', cpu: 45, memory: 78, uptime: '45d 12h' },
  { id: 'i2', name: 'us-east-worker-a', type: 'Compute', status: 'Warning', cpu: 92, memory: 65, uptime: '12d 4h' },
  { id: 'i3', name: 'eu-west-cache', type: 'Redis', status: 'Healthy', cpu: 12, memory: 45, uptime: '120d 1h' },
  { id: 'i4', name: 'ap-south-worker-b', type: 'Compute', status: 'Down', cpu: 0, memory: 0, uptime: '0d 0h' },
]

const mockLogs = [
  { id: 'l1', level: 'error', time: '10:45:23.120', service: 'auth-service', message: 'Failed to connect to Redis cache cluster after 3 retries.' },
  { id: 'l2', level: 'warn', time: '10:44:12.005', service: 'api-gateway', message: 'Rate limit exceeded for client IP 192.168.1.45 (1000 req/min).' },
  { id: 'l3', level: 'info', time: '10:42:55.992', service: 'nexus-core', message: 'Successfully scaled compute nodes in ap-south region.' },
  { id: 'l4', level: 'info', time: '10:40:11.234', service: 'worker-queue', message: 'Processed 15,000 background jobs in the last 5 minutes.' },
  { id: 'l5', level: 'error', time: '10:35:01.001', service: 'payment-svc', message: 'Webhook delivery failed for event payment.success (HTTP 500).' },
]

const mockAlerts = [
  { id: 'al1', severity: 'Critical', title: 'High CPU Usage on us-east-worker-a', time: '1h ago', status: 'Open' },
  { id: 'al2', severity: 'High', title: 'Database Replication Lag > 5s', time: '2h ago', status: 'Acknowledged' },
  { id: 'al3', severity: 'Medium', title: 'Unusual spike in 401 Unauthorized errors', time: '5h ago', status: 'Open' },
  { id: 'al4', severity: 'Low', title: 'SSL Certificate expiring in 15 days', time: '1d ago', status: 'Resolved' },
]

const barData = [
  { name: 'Direct', q1: 4000, q2: 2400, q3: 2400 },
  { name: 'Organic', q1: 3000, q2: 1398, q3: 2210 },
  { name: 'Referral', q1: 2000, q2: 9800, q3: 2290 },
  { name: 'Social', q1: 2780, q2: 3908, q3: 2000 },
]

const pieData = [
  { name: 'Enterprise', value: 400 },
  { name: 'Pro', value: 300 },
  { name: 'Starter', value: 300 },
]
const COLORS = ['#06b6d4', '#8b5cf6', '#10b981']

const radarData = [
  { subject: 'API', current: 120, target: 110, fullMark: 150 },
  { subject: 'Compute', current: 98, target: 130, fullMark: 150 },
  { subject: 'Storage', current: 86, target: 130, fullMark: 150 },
  { subject: 'Network', current: 99, target: 100, fullMark: 150 },
  { subject: 'DB', current: 85, target: 90, fullMark: 150 },
  { subject: 'Cache', current: 65, target: 85, fullMark: 150 },
]

const scatterData1 = [
  { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 }, { x: 170, y: 300, z: 400 },
]
const scatterData2 = [
  { x: 140, y: 250, z: 280 }, { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 },
]

const lineData = [
  { name: 'W1', retention: 95, churn: 5, reactivated: 2 },
  { name: 'W2', retention: 90, churn: 10, reactivated: 4 },
  { name: 'W3', retention: 85, churn: 15, reactivated: 6 },
  { name: 'W4', retention: 82, churn: 18, reactivated: 8 },
]

export default function DashboardMockup({ fullScreen = false }: { fullScreen?: boolean }) {
  const [activeTab, setActiveTab] = useState('Home')

  const renderContent = () => {
    switch (activeTab) {
      case 'Home': return <HomeView />
      case 'Analytics': return <AnalyticsView />
      case 'Users': return <UsersView />
      case 'Projects': return <ProjectsView />
      case 'API': return <ApiView />
      case 'Settings': return <SettingsView />
      case 'Realtime': return <RealtimeView />
      case 'Deployments': return <DeploymentsView />
      case 'Infrastructure': return <InfrastructureView />
      case 'Logs': return <LogsView />
      case 'Alerts': return <AlertsView />
      default: return <HomeView />
    }
  }

  return (
    <div className={`w-full flex overflow-hidden bg-[#0a0a0c] text-slate-200 text-sm font-sans ${
      fullScreen ? 'min-h-screen rounded-none border-none' : 'h-[800px] rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xl'
    }`}>
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 flex flex-col bg-[#0f0f12] shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5H5.5L12 6.5z" />
            </svg>
            <span className="font-bold text-lg tracking-wide text-white">AETHER</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Overview</div>
          <NavItem icon={<Home size={18} />} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
          <NavItem icon={<BarChart2 size={18} />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <NavItem icon={<LineChartIcon size={18} />} label="Realtime Pulse" active={activeTab === 'Realtime'} onClick={() => setActiveTab('Realtime')} />
          
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-3 px-3">Management</div>
          <NavItem icon={<Users size={18} />} label="Users" active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} badge="12" />
          <NavItem icon={<FolderOpen size={18} />} label="Projects" active={activeTab === 'Projects'} onClick={() => setActiveTab('Projects')} />
          <NavItem icon={<TerminalSquare size={18} />} label="API & Webhooks" active={activeTab === 'API'} onClick={() => setActiveTab('API')} />
          
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-3 px-3">Operations</div>
          <NavItem icon={<Rocket size={18} />} label="Deployments" active={activeTab === 'Deployments'} onClick={() => setActiveTab('Deployments')} />
          <NavItem icon={<Server size={18} />} label="Infrastructure" active={activeTab === 'Infrastructure'} onClick={() => setActiveTab('Infrastructure')} />
          <NavItem icon={<ScrollText size={18} />} label="System Logs" active={activeTab === 'Logs'} onClick={() => setActiveTab('Logs')} />
          <NavItem icon={<AlertTriangle size={18} />} label="Alerts & Incidents" active={activeTab === 'Alerts'} onClick={() => setActiveTab('Alerts')} badge="3" />
        </div>

        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl p-4 mb-4 border border-white/5">
            <h4 className="text-white font-medium text-xs mb-1">Enterprise Plan</h4>
            <p className="text-slate-400 text-[10px] mb-3">80% of API limits used</p>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 w-[80%]" />
            </div>
            <button className="w-full py-1.5 text-xs bg-white text-black font-medium rounded-md hover:bg-slate-200 transition-colors">
              Manage Billing
            </button>
          </div>
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
          <div className="mt-2 pt-2 border-t border-white/5">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer group">
              <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
              <span>Exit Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0c]">
        {/* Top Header */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
          <div className="flex items-center text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Aether Workspace</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-white">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources, docs..." 
                className="w-64 h-9 pl-9 pr-4 rounded-md bg-white/[0.03] border border-white/5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600 text-white"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-400 font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-400 font-mono">K</kbd>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 relative transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#0a0a0c]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border-2 border-[#0a0a0c] overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=transparent" alt="User" className="w-full h-full bg-[#111]" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  )
}

function NavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; badge?: string }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
        active ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-cyan-500 text-black' : 'bg-white/10 text-slate-300'}`}>
          {badge}
        </span>
      )}
    </div>
  )
}

function ActionButton({ icon, label, primary, onClick }: { icon: React.ReactNode; label: string; primary?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all active:scale-95 shadow-sm ${
        primary 
          ? 'bg-white hover:bg-slate-200 border-transparent text-black' 
          : 'border-white/10 bg-[#0f0f12] text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function KpiCard({ title, value, trend, active, trendDown }: { title: string; value: string; trend: string; active?: boolean; trendDown?: boolean }) {
  return (
    <div
      className={`p-5 rounded-xl border flex flex-col justify-center transition-all cursor-pointer hover:border-white/20 ${
        active
          ? 'border-cyan-500/50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0f0f12] to-[#0f0f12]'
          : 'border-white/10 bg-[#0f0f12]'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        {active && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
      </div>
      <div className={`text-2xl font-bold tracking-tight mb-1 ${active ? 'text-white' : 'text-slate-100'}`}>
        {value}
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${trendDown ? 'text-rose-400' : 'text-emerald-400'}`}>
        {trendDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
        {trend}
      </div>
    </div>
  )
}

// --- Detailed Views ---

function HomeView() {
  const [filter, setFilter] = useState('All')
  const filteredActivities = useMemo(() => {
    if (filter === 'All') return mockActivities
    if (filter === 'System') return mockActivities.filter(a => a.type === 'system')
    return mockActivities.filter(a => a.type !== 'system')
  }, [filter])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Welcome back, System Admin</h1>
          <p className="text-slate-400 text-sm">Here is a high-level overview of your platform's health today.</p>
        </div>
        <div className="flex gap-2">
          <ActionButton icon={<RefreshCcw size={14} />} label="Refresh Status" />
          <ActionButton icon={<Activity size={14} />} label="View Full Logs" primary />
        </div>
      </div>

      {/* Top Infrastructure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f12] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-400 group-hover:scale-110 group-hover:opacity-10 transition-all"><Activity size={64} /></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Zap size={16} />
            </div>
            <h3 className="text-slate-300 font-medium">Active Compute</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1 relative z-10">14.2<span className="text-lg text-slate-500 font-normal"> TB/s</span></div>
          <div className="flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> +12.5%</span>
            <span className="text-slate-500">Peak hour capacity</span>
          </div>
        </div>
        
        <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f12] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-violet-400 group-hover:scale-110 group-hover:opacity-10 transition-all"><Database size={64} /></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-md bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Database size={16} />
            </div>
            <h3 className="text-slate-300 font-medium">Storage Allocation</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1 relative z-10">894<span className="text-lg text-slate-500 font-normal"> GB</span></div>
          <div className="flex items-center justify-between text-xs relative z-10">
            <span className="text-orange-400 flex items-center"><ArrowUpRight size={12} className="mr-0.5" /> +4.1%</span>
            <span className="text-slate-500">89% of 1TB Quota</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-orange-400 w-[89%]" />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f12] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-300 font-medium flex items-center gap-2">
                <TerminalSquare size={16} className="text-emerald-400" /> API Requests
              </h3>
              <span className="text-[10px] uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold tracking-wider border border-emerald-400/20">Optimal</span>
            </div>
            <div className="text-2xl font-bold text-white mt-3">1.2M <span className="text-sm font-normal text-slate-500">requests / 24h</span></div>
          </div>
          <div className="h-10 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniData}>
                <Bar dataKey="v" fill="#06b6d4" radius={[2, 2, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="col-span-2 rounded-xl border border-white/10 bg-[#0f0f12] flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Event Log</h2>
            <div className="flex gap-2">
              {['All', 'System', 'Users'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === f ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
            {filteredActivities.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No events found.</div>
            ) : (
              filteredActivities.map((act, i) => (
                <div key={act.id} className="flex gap-4 relative group">
                  {i !== filteredActivities.length - 1 && <div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-white/5 group-hover:bg-white/10 transition-colors" />}
                  <div className="relative z-10 shrink-0">
                    <div className="w-8 h-8 rounded-full border-2 border-[#0f0f12] overflow-hidden bg-slate-800 shadow-sm">
                      {act.user === 'System' ? (
                        <div className={`w-full h-full flex items-center justify-center text-white ${act.color}`}>
                          <Settings size={14} />
                        </div>
                      ) : (
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${act.user}&backgroundColor=transparent`} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold text-white">{act.user}</span> {act.action} <span className="font-medium text-cyan-400 hover:underline cursor-pointer">{act.target}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock size={12} /> {act.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Security */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-6">
            <h2 className="text-lg font-medium text-white mb-5">Quick Actions</h2>
            <div className="space-y-2.5">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderOpen size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Create Resource</span>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Invite Developer</span>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Security Audit</span>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-emerald-400 font-medium mb-1">Infrastructure Healthy</h3>
            <p className="text-xs text-slate-400">All regional clusters and edge nodes are operating normally.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Financial Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time revenue metrics and user conversion data.</p>
        </div>
        <div className="flex items-center gap-3">
          <ActionButton icon={<LinkIcon size={14} />} label="Compare Data" />
          <ActionButton icon={<Download size={14} />} label="Export CSV" />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-[2] rounded-xl border border-white/10 bg-[#0f0f12] p-6 flex flex-col relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-medium text-white mb-1">Revenue & Growth Trajectory</h2>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400">Current MRR <span className="font-semibold text-slate-200">$742,850</span></p>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">On Track</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-[#151518] text-xs text-slate-300 hover:bg-white/10 cursor-pointer transition-colors shadow-sm">
              <Clock size={12} className="text-slate-500" />
              <span>Oct 1 - 30, 2026</span>
              <ChevronDown size={14} className="text-slate-500 ml-1" />
            </div>
          </div>

          <div className="flex-1 min-h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}K`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#06b6d4', stroke: '#09090b', strokeWidth: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <KpiCard title="Total Revenue" value="$742.8k" trend="+14.2%" active />
          <KpiCard title="Active Users" value="48,109" trend="+8.5%" />
          <KpiCard title="Conversion Rate" value="4.12%" trend="+2.1%" />
          <KpiCard title="New MRR" value="$38,500" trend="+11.8%" />
          <KpiCard title="Retention Rate" value="92.4%" trend="-1.1%" trendDown />
          <KpiCard title="Churn Rate" value="0.85%" trend="+0.2%" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart - Stacked */}
        <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-5 shadow-lg">
          <h3 className="text-sm font-medium text-white mb-4">Quarterly Acquisition (Stacked)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="q1" stackId="a" fill="#06b6d4" name="Q1 Users" />
                <Bar dataKey="q2" stackId="a" fill="#8b5cf6" name="Q2 Users" />
                <Bar dataKey="q3" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Q3 Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Labeled */}
        <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-5 shadow-lg">
          <h3 className="text-sm font-medium text-white mb-4">Revenue Breakdown by Tier</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={true} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Multi Series */}
        <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-5 shadow-lg">
          <h3 className="text-sm font-medium text-white mb-4">User Cohort Analysis (Weekly)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Line type="monotone" dataKey="retention" name="Retention %" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="churn" name="Churn %" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="reactivated" name="Reactivated %" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart - Comparative */}
        <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-5 shadow-lg">
          <h3 className="text-sm font-medium text-white mb-4">Resource Utilization (Current vs Target)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Current Load" dataKey="current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Radar name="Target Capacity" dataKey="target" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter Chart - Multi-Cluster */}
        <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-5 shadow-lg lg:col-span-2">
          <h3 className="text-sm font-medium text-white mb-4">CAC vs LTV Clusters</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" dataKey="x" name="CAC (Cost)" axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="$" />
                <YAxis type="number" dataKey="y" name="LTV (Value)" axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="$" />
                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Scatter name="Enterprise Cluster" data={scatterData1} fill="#8b5cf6" opacity={0.8} />
                <Scatter name="SMB Cluster" data={scatterData2} fill="#06b6d4" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersView() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const toggleSelectAll = () => {
    if (selected.size === filteredUsers.length) setSelected(new Set())
    else setSelected(new Set(filteredUsers.map(u => u.id)))
  }

  const toggleUser = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-white">Access Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage workspace members, assign roles, and enforce security policies.</p>
        </div>
        <ActionButton icon={<Plus size={14} />} label="Provision New User" primary />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0f0f12] flex flex-col shadow-lg flex-1 min-h-[400px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..." 
                className="w-72 h-9 pl-9 pr-4 rounded-md bg-[#0a0a0c] border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors text-white placeholder:text-slate-600"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-[#0a0a0c] text-sm text-slate-300 hover:bg-white/5 transition-colors hover:text-white">
              <Filter size={14} />
              <span>Filter Role</span>
            </button>
            {selected.size > 0 && (
              <div className="text-xs text-cyan-400 font-medium px-2 py-1 bg-cyan-500/10 rounded">
                {selected.size} selected
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Showing {filteredUsers.length} of {mockUsers.length} results</span>
            <div className="flex gap-1">
              <button className="p-1.5 rounded border border-white/5 bg-[#0a0a0c] text-slate-500 hover:text-white transition-colors disabled:opacity-50"><ChevronLeft size={14} /></button>
              <button className="p-1.5 rounded border border-white/5 bg-[#0a0a0c] text-slate-500 hover:text-white transition-colors"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0f0f12] z-10">
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500 font-semibold shadow-sm">
                <th className="px-6 py-4 w-12 text-center cursor-pointer" onClick={toggleSelectAll}>
                  {selected.size === filteredUsers.length && filteredUsers.length > 0 ? (
                    <CheckSquare size={16} className="text-cyan-400 inline" />
                  ) : (
                    <Square size={16} className="text-slate-600 inline hover:text-slate-400 transition-colors" />
                  )}
                </th>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role / Permissions</th>
                <th className="px-6 py-4">Security Policy</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Authenticated</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No users matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-white/5 transition-colors group cursor-pointer ${
                      selected.has(user.id) ? 'bg-cyan-500/5 hover:bg-cyan-500/10' : 'hover:bg-white/[0.03]'
                    }`}
                    onClick={() => toggleUser(user.id)}
                  >
                    <td className="px-6 py-4 text-center">
                      {selected.has(user.id) ? (
                        <CheckSquare size={16} className="text-cyan-400 inline" />
                      ) : (
                        <Square size={16} className="text-slate-600 inline group-hover:text-slate-400 transition-colors" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.avatar}&backgroundColor=transparent`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-white font-medium mb-0.5 group-hover:text-cyan-400 transition-colors">{user.name}</div>
                          <div className="text-slate-500 text-xs font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border uppercase tracking-wider ${
                        user.role === 'Admin' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' :
                        user.role === 'Developer' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
                        'bg-slate-500/10 text-slate-300 border-slate-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.mfa ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <Shield size={14} /> MFA Enforced
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Shield size={14} className="opacity-50" /> Unsecured
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                          user.status === 'Offline' ? 'bg-slate-500' :
                          'bg-rose-500'
                        }`} />
                        <span className={user.status === 'Active' ? 'text-slate-200' : 'text-slate-500'}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs flex items-center gap-1.5 h-[68px]">
                       <Clock size={12} className="opacity-50" /> {user.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-500 hover:text-white opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProjectsView() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid'|'list'>('grid')

  const filtered = useMemo(() => mockProjects.filter(p => p.title.toLowerCase().includes(search.toLowerCase())), [search])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Project Portfolios</h1>
          <p className="text-slate-400 mt-1 text-sm">Track progress across engineering resources and repositories.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter repositories..." 
              className="w-56 h-9 pl-9 pr-4 rounded-md bg-[#0f0f12] border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors text-white placeholder:text-slate-600"
            />
          </div>
          <div className="flex bg-[#0f0f12] border border-white/10 rounded-md overflow-hidden h-9">
            <button onClick={() => setView('grid')} className={`px-2.5 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><LayoutGrid size={14} /></button>
            <button onClick={() => setView('list')} className={`px-2.5 flex items-center justify-center transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}><List size={14} /></button>
          </div>
          <ActionButton icon={<Plus size={14} />} label="New Project" primary />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-xl">No projects found.</div>
      ) : (
        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {filtered.map((p) => (
            <div key={p.id} className={`rounded-xl border border-white/10 bg-[#0f0f12] hover:border-white/20 transition-all cursor-pointer group relative flex shadow-lg ${view === 'grid' ? 'flex-col p-6 h-full hover:-translate-y-1' : 'flex-row items-center p-4'}`}>
              
              <div className={`${view === 'grid' ? 'flex justify-between items-start mb-4' : 'mr-4 shrink-0'}`}>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <FolderOpen size={24} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                {view === 'grid' && (
                  <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
                )}
              </div>
              
              <div className={view === 'list' ? 'flex-1 flex items-center' : 'flex flex-col flex-1'}>
                <div className={view === 'list' ? 'w-1/3 pr-4' : ''}>
                  <h3 className="text-lg font-semibold text-white mb-1.5 leading-tight group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.desc}</p>
                </div>
                
                <div className={`flex flex-wrap gap-2 ${view === 'list' ? 'w-1/4' : 'my-5'}`}>
                  {p.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-white/5 text-[10px] uppercase tracking-wide text-slate-400 font-medium border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-6 ${view === 'list' ? 'w-1/4' : 'mt-auto pt-4 border-t border-white/5'}`}>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-1.5">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Progress</div>
                      <div className={`text-[10px] uppercase tracking-wider font-bold ${
                        p.status === 'Completed' ? 'text-emerald-400' : 
                        p.status === 'Blocked' ? 'text-rose-400' :
                        p.status === 'Planning' ? 'text-orange-400' : 'text-cyan-400'
                      }`}>{p.status} ({p.progress}%)</div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className={`flex justify-between items-center ${view === 'list' ? 'w-1/6 ml-4 justify-end gap-4' : 'mt-5'}`}>
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(p.members, 4))].map((_, idx) => (
                      <div key={idx} className="w-7 h-7 rounded-full border-2 border-[#0f0f12] bg-slate-800 overflow-hidden shadow-sm">
                         <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.title}${idx}&backgroundColor=transparent`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {p.members > 4 && (
                      <div className="w-7 h-7 rounded-full border-2 border-[#0f0f12] bg-white/10 flex items-center justify-center text-[9px] text-white font-medium">
                        +{p.members - 4}
                      </div>
                    )}
                  </div>
                  {view === 'list' && <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ApiView() {
  const [showLive, setShowLive] = useState(false)
  const [showTest, setShowTest] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Developer API & Webhooks</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage programmatic access tokens and external event routing.</p>
        </div>
        <div className="flex gap-2">
          <ActionButton icon={<Settings size={14} />} label="API Settings" />
          <ActionButton icon={<Plus size={14} />} label="Create Token" primary />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Keys Section */}
        <div className="col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <TerminalSquare size={18} className="text-slate-400" /> API Access Tokens
            </h2>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f12] shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 text-emerald-400 transition-opacity pointer-events-none">
              <Shield size={100} />
            </div>
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div>
                <h3 className="text-white font-medium flex items-center gap-3">
                  Production Read/Write Key
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Live</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">ID: tok_prod_892nf2</p>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-md bg-[#050505] border border-white/10 shadow-inner">
                <Key size={16} className="text-emerald-500" />
                <input 
                  type={showLive ? "text" : "password"} 
                  value="pk_live_8f7d6a5s4d3f2g1h0j9k8l7m6n5b4v3c2x1z" 
                  readOnly
                  className="bg-transparent border-none outline-none text-slate-200 font-mono text-sm tracking-widest flex-1 pointer-events-none" 
                />
              </div>
              <button 
                onClick={() => setShowLive(!showLive)}
                className="p-3 rounded-md border border-white/10 bg-[#0f0f12] hover:bg-white/5 text-slate-400 hover:text-white transition-colors shadow-sm" title="Toggle visibility">
                {showLive ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button 
                onClick={() => handleCopy('pk_live_8f7d6a5s4d3f2g1h0j9k8l7m6n5b4v3c2x1z', 'live')}
                className={`p-3 rounded-md border transition-all shadow-sm flex items-center gap-2 ${copied === 'live' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-[#0f0f12] hover:bg-white/5 text-slate-400 hover:text-white'}`}
              >
                {copied === 'live' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded border border-white/5 bg-white/5 text-[10px] text-slate-300 font-mono">scope: full_access</span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Activity size={12} className="text-emerald-500" />
                Last request 2m ago
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f12] shadow-sm">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-white font-medium flex items-center gap-3">
                  Development Integration Key
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 uppercase tracking-widest border border-orange-500/20">Sandbox</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">ID: tok_test_238nx9</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-md bg-[#050505] border border-white/10 shadow-inner">
                <Key size={16} className="text-orange-500" />
                <input 
                  type={showTest ? "text" : "password"} 
                  value="pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8" 
                  readOnly
                  className="bg-transparent border-none outline-none text-slate-400 font-mono text-sm tracking-widest flex-1 pointer-events-none" 
                />
              </div>
              <button 
                onClick={() => setShowTest(!showTest)}
                className="p-3 rounded-md border border-white/10 bg-[#0f0f12] hover:bg-white/5 text-slate-400 hover:text-white transition-colors shadow-sm">
                {showTest ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button 
                onClick={() => handleCopy('pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8', 'test')}
                className={`p-3 rounded-md border transition-all shadow-sm ${copied === 'test' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-[#0f0f12] hover:bg-white/5 text-slate-400 hover:text-white'}`}
              >
                {copied === 'test' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Webhooks Sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <LinkIcon size={18} className="text-slate-400" /> Event Webhooks
            </h2>
            <button className="text-xs text-cyan-400 font-medium hover:text-cyan-300">Add Endpoint</button>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden shadow-lg">
            <div className="p-4 border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-200 truncate pr-4">https://api.myapp.com/hook</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-400">user.created</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-400">payment.success</span>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between items-center">
                <span>100% success rate</span>
                <span>Last fired 1m ago</span>
              </div>
            </div>
            
            <div className="p-4 hover:bg-white/[0.03] cursor-pointer transition-colors relative bg-rose-500/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-rose-300 truncate pr-4">https://zapier.com/hooks/catch/...</span>
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] shrink-0 animate-pulse" />
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-400">project.deleted</span>
              </div>
              <div className="text-[10px] text-rose-400 flex justify-between items-center font-medium">
                <span>Failing (HTTP 500)</span>
                <span>Last fired 2h ago</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-cyan-500/20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0f0f12] to-[#0f0f12] group cursor-pointer hover:border-cyan-500/40 transition-colors">
            <TerminalSquare size={24} className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mb-1">Developer Documentation</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">Explore SDKs, REST API references, and step-by-step integration guides.</p>
            <button className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
              Read Docs <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  const [innerTab, setInnerTab] = useState('General')
  const [darkMode, setDarkMode] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-10 max-w-6xl h-full">
      
      {/* Settings Sidebar */}
      <div className="w-56 shrink-0 border-r border-white/5 pr-6 h-full">
        <h1 className="text-2xl font-semibold text-white mb-8">Workspace Settings</h1>
        
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Personal</div>
          <button onClick={() => setInnerTab('General')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${innerTab === 'General' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Settings size={16} /> Profile
          </button>
          <button onClick={() => setInnerTab('Preferences')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${innerTab === 'Preferences' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <SlidersHorizontal size={16} /> Preferences
          </button>
          
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-3 px-3">Workspace</div>
          <button onClick={() => setInnerTab('Team')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${innerTab === 'Team' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Users size={16} /> Team & Members
          </button>
          <button onClick={() => setInnerTab('Security')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${innerTab === 'Security' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Shield size={16} /> Security
          </button>
          <button onClick={() => setInnerTab('Billing')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${innerTab === 'Billing' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <CreditCard size={16} /> Billing
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 pb-10">
        
        {innerTab === 'General' && (
          <section className="animate-in fade-in duration-300">
            <div className="mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">Profile Information</h2>
              <p className="text-sm text-slate-400 mt-1">Update your account's profile information and email address.</p>
            </div>
            
            <div className="max-w-2xl">
              <div className="flex items-center gap-8 mb-10 p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
                <div className="w-24 h-24 rounded-full border-2 border-white/10 bg-slate-800 overflow-hidden relative group cursor-pointer shadow-xl">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=transparent" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">Upload</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Profile Picture</h3>
                  <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">Upload a picture to make it easier for your team to recognize you. Maximum file size is 2MB.</p>
                  <button className="px-4 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors shadow-sm">
                    Select File
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full h-10 px-3 rounded-md bg-[#050505] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 text-sm shadow-inner transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Name</label>
                    <input type="text" defaultValue="Johnson" className="w-full h-10 px-3 rounded-md bg-[#050505] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 text-sm shadow-inner transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input type="email" defaultValue="alex@aether.io" className="w-full h-10 px-3 rounded-md bg-[#050505] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 text-sm shadow-inner transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Job Title</label>
                  <input type="text" defaultValue="Lead Systems Engineer" className="w-full h-10 px-3 rounded-md bg-[#050505] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 text-sm shadow-inner transition-colors" />
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <ActionButton icon={<CheckCircle2 size={14} />} label="Save Changes" primary />
                </div>
              </div>
            </div>
          </section>
        )}

        {innerTab === 'Preferences' && (
          <section className="animate-in fade-in duration-300">
            <div className="mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">Interface Preferences</h2>
              <p className="text-sm text-slate-400 mt-1">Customize your workspace visual experience.</p>
            </div>
            
            <div className="max-w-2xl space-y-4">
              <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12] flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium mb-1">Dark Mode</h3>
                  <p className="text-xs text-slate-400">Toggle between light and dark themes.</p>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-cyan-500' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12] flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium mb-1">Receive Email Digests</h3>
                  <p className="text-xs text-slate-400">Get a weekly summary of workspace activity.</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-cyan-500 relative transition-colors cursor-pointer">
                  <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white shadow-sm transition-all" />
                </button>
              </div>
            </div>
          </section>
        )}

        {innerTab === 'Security' && (
          <section className="animate-in fade-in duration-300">
             <div className="mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-medium text-white">Security Settings</h2>
              <p className="text-sm text-slate-400 mt-1">Manage two-factor authentication and active sessions.</p>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-400 max-w-sm">Add an additional layer of security to your account during login.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${twoFactor ? 'bg-cyan-500' : 'bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${twoFactor ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {twoFactor && (
                  <div className="p-4 rounded-md bg-[#050505] border border-white/5 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm text-slate-300 font-mono">Authenticator App Configured</span>
                    <button className="text-xs text-rose-400 hover:text-rose-300 font-medium">Reconfigure</button>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
                <h3 className="text-white font-medium mb-4">Active Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <Laptop size={20} className="text-slate-400" />
                      <div>
                        <div className="text-sm text-white font-medium flex items-center gap-2">
                          Mac OS • Safari
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] uppercase font-bold tracking-wider">Current</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">San Francisco, CA • IP: 192.168.1.1</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Laptop size={20} className="text-slate-400" />
                      <div>
                        <div className="text-sm text-white font-medium">Windows 11 • Chrome</div>
                        <div className="text-xs text-slate-500 mt-0.5">New York, NY • IP: 10.0.0.45 • Active 2 days ago</div>
                      </div>
                    </div>
                    <button className="text-xs text-rose-400 font-medium hover:text-rose-300 border border-rose-400/20 px-3 py-1.5 rounded bg-rose-400/5">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {(innerTab === 'Team' || innerTab === 'Billing') && (
          <section className="animate-in fade-in duration-300 flex items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-[#0f0f12]">
            <div className="text-center">
              <Settings size={32} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-slate-300 font-medium">Module under construction</h3>
              <p className="text-slate-500 text-sm mt-1">This workspace feature will be available in v2.0.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function RealtimeView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
            Realtime Pulse <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Live cluster metrics updated every second.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
          <div className="text-sm font-medium text-slate-400 mb-2">Global Requests/sec</div>
          <div className="text-4xl font-bold text-white tracking-tight">4,291</div>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
          <div className="text-sm font-medium text-slate-400 mb-2">P99 Latency (Edge)</div>
          <div className="text-4xl font-bold text-cyan-400 tracking-tight">42<span className="text-xl font-medium">ms</span></div>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
          <div className="text-sm font-medium text-slate-400 mb-2">Error Rate (5xx)</div>
          <div className="text-4xl font-bold text-emerald-400 tracking-tight">0.01<span className="text-xl font-medium">%</span></div>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-[#0f0f12]">
          <div className="text-sm font-medium text-slate-400 mb-2">Active WebSocket</div>
          <div className="text-4xl font-bold text-white tracking-tight">18,042</div>
        </div>
      </div>
      <div className="h-64 rounded-xl border border-white/10 bg-[#0f0f12] p-4 flex flex-col justify-between">
        <div className="text-sm font-medium text-slate-300">Live Traffic Volume</div>
        <div className="h-48 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={miniData}>
               <defs>
                  <linearGradient id="liveColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#liveColor)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function DeploymentsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Deployments</h1>
          <p className="text-slate-400 mt-1 text-sm">Track CI/CD pipeline history across all projects.</p>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
        {mockDeployments.map((d, i) => (
          <div key={d.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0 ${d.status === 'Building' ? 'animate-[spin_3s_linear_infinite] border-cyan-500/50 text-cyan-400' : ''}`}>
                {d.status === 'Success' ? <CheckCircle2 className="text-emerald-500" /> : d.status === 'Failed' ? <XCircle className="text-rose-500" /> : <RefreshCcw size={18} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{d.project}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-slate-300 font-mono">{d.version}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1 text-slate-400"><GitCommit size={12} /> {d.commit}</span>
                  <span className="flex items-center gap-1"><GitBranch size={12} /> {d.branch}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-300">{d.author}</div>
              <div className="text-xs text-slate-500 mt-0.5">{d.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InfrastructureView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Infrastructure</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor instance health, compute and storage nodes.</p>
        </div>
        <ActionButton icon={<Plus size={14} />} label="Provision Node" primary />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockInfra.map((node) => (
          <div key={node.id} className="p-5 rounded-xl border border-white/10 bg-[#0f0f12] flex items-start gap-4 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              {node.type === 'Database' ? <Database className="text-violet-400" /> : node.type === 'Redis' ? <Server className="text-rose-400" /> : <HardDrive className="text-cyan-400" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">{node.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${node.status === 'Healthy' ? 'text-emerald-400 bg-emerald-500/10' : node.status === 'Warning' ? 'text-orange-400 bg-orange-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                  {node.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-4 uppercase tracking-wider">{node.type} • Up {node.uptime}</div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span className="flex items-center gap-1"><Cpu size={12}/> CPU Usage</span>
                    <span>{node.cpu}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${node.cpu > 80 ? 'bg-orange-500' : 'bg-cyan-500'}`} style={{ width: `${node.cpu}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span className="flex items-center gap-1"><Database size={12}/> Memory</span>
                    <span>{node.memory}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${node.memory > 80 ? 'bg-orange-500' : 'bg-violet-500'}`} style={{ width: `${node.memory}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2"><TerminalSquare /> System Logs</h1>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search logs..." className="h-8 px-3 rounded-md bg-[#0f0f12] border border-white/10 text-xs text-white" />
          <ActionButton icon={<Filter size={14} />} label="Filter" />
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-white/10 bg-[#050505] p-4 overflow-y-auto font-mono text-xs shadow-inner">
        {mockLogs.map(log => (
          <div key={log.id} className="flex gap-4 py-2 border-b border-white/5 hover:bg-white/[0.02]">
            <span className="text-slate-500 shrink-0">{log.time}</span>
            <span className={`shrink-0 w-12 font-bold ${log.level === 'error' ? 'text-rose-500' : log.level === 'warn' ? 'text-orange-400' : 'text-cyan-400'}`}>
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-violet-400 shrink-0 w-28 truncate">{log.service}</span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        <div className="py-2 text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> Live tailing...
        </div>
      </div>
    </div>
  )
}

function AlertsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Alerts & Incidents</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor system anomalies and triggered rules.</p>
        </div>
      </div>
      <div className="space-y-4">
        {mockAlerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-xl border border-white/10 bg-[#0f0f12] flex items-center justify-between ${alert.status === 'Resolved' ? 'opacity-50 grayscale' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full bg-white/5 ${alert.severity === 'Critical' ? 'text-rose-500' : alert.severity === 'High' ? 'text-orange-500' : 'text-cyan-500'}`}>
                {alert.severity === 'Critical' ? <AlertOctagon size={24} /> : alert.severity === 'High' ? <AlertTriangle size={24} /> : <Info size={24} />}
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{alert.title}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span className={`font-bold uppercase tracking-wider ${alert.severity === 'Critical' ? 'text-rose-500' : alert.severity === 'High' ? 'text-orange-500' : alert.severity === 'Medium' ? 'text-cyan-500' : 'text-slate-400'}`}>
                    {alert.severity}
                  </span>
                  <span>Triggered {alert.time}</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 rounded bg-white/5">{alert.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConstructionView({ title }: { title: string }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl border border-dashed border-white/10 bg-[#0f0f12] max-w-md w-full">
        <Settings size={48} className="text-slate-600 mx-auto mb-4 animate-[spin_4s_linear_infinite]" />
        <h2 className="text-xl font-medium text-white mb-2">{title}</h2>
        <p className="text-slate-400 text-sm mb-6">
          This module is currently under development or requires additional configuration to be enabled.
        </p>
        <ActionButton icon={<Activity size={14} />} label="View Documentation" primary />
      </div>
    </div>
  )
}
