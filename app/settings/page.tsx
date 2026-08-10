'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Camera, Save, ArrowLeft, Loader2, Lock, Sliders, Key,
  CheckCircle2, AlertTriangle, X, Check, Eye, EyeOff, Shield, Bell, Sparkles
} from 'lucide-react'

type TabType = 'profile' | 'security' | 'preferences'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  // Profile state
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [compactMode, setCompactMode] = useState(true)

  // Status state
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const { data } = await res.json()
          setUser(data.user)
          setAvatarUrl(data.user.avatar_url || '')
          setFullName(data.user.full_name || '')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleSaveProfile = async () => {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setUser(data.data.user)
        setFeedback({ type: 'success', message: 'Profile details updated successfully.' })
        setTimeout(() => setFeedback(null), 3500)
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update profile' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error updating profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirmation do not match' })
      return
    }

    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Password changed successfully.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setFeedback(null), 3500)
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update password' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error updating password' })
    } finally {
      setSaving(false)
    }
  }

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
      </div>
    )
  }

  const role = user?.role || 'user'
  const isPrivileged = role === 'admin' || role === 'owner'

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 font-sans selection:bg-cyan-500/30 text-xs">
      {/* Home Navbar Style Header */}
      <header className="h-[60px] border-b border-white/10 bg-[#090a0f]/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href={isPrivileged ? '/admin' : '/'} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-white/5">
            <ArrowLeft size={14} />
            <span>Back to {isPrivileged ? 'Admin' : 'Home'}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" className="text-white/20 group-hover:text-cyan-400/40 transition-colors" />
                <path d="M10 22L10 10L16 16L22 10L22 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white" />
                <circle cx="22" cy="10" r="2" fill="currentColor" className="text-cyan-400" />
              </svg>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">NEXTFLOW<span className="text-cyan-400">.</span></span>
          </Link>
          <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {role}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">User Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Account & Profile Settings</h1>
          <p className="text-xs text-slate-400">Manage your profile details, password security, and preferences.</p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold backdrop-blur-md ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="ml-auto text-slate-400 hover:text-white"><X size={14} /></button>
          </div>
        )}

        {/* Home Navbar Style Sub-Nav Tabs (Underline Glow) */}
        <div className="flex gap-2 border-b border-white/10 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'profile', label: 'Public Profile', icon: User },
            { id: 'security', label: 'Security & Password', icon: Lock },
            { id: 'preferences', label: 'Preferences', icon: Sliders },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all relative shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Main Content Container (Soft Frosted Panel) */}
        <div className="rounded-xl p-6 space-y-6 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 shadow-xl">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold text-white">Profile Details</h2>
              </div>

              {/* Avatar Box */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/20 bg-slate-900 flex items-center justify-center relative shadow-inner">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3.5 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Avatar Image URL</label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Preset Avatars:</span>
                    <div className="flex gap-2.5">
                      {presetAvatars.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            avatarUrl === url ? 'border-cyan-400 scale-105 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Username (Readonly)</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="w-full h-9 px-3.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address (Readonly)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full h-9 px-3.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Save Button (Soft White Home Page Style) */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-md"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold text-white">Password Credentials</h2>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-9 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSavePassword}
                  disabled={saving || !currentPassword || !newPassword}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-md"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                  <span>Update Password</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold text-white">Interface Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-white">Email Digest Alerts</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Receive notifications for workflow status and security updates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      emailNotifications ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-4.5 bg-slate-950' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-white">Compact UI Mode</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Enable compact spacing scales across all administration pages.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompactMode(!compactMode)}
                    className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 cursor-pointer ${
                      compactMode ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      compactMode ? 'translate-x-4.5 bg-slate-950' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
