'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TextAnimation from '@/components/ui/staggerText'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, role: 'user' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed. Please check your details.')
        setIsLoading(false)
        return
      }

      router.push('/')
    } catch (err) {
      setErrorMsg('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } 
    }
  }

  return (
    <div className="flex min-h-screen bg-[#09090b] text-slate-100 selection:bg-cyan-500/30">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050505] items-end justify-start p-16 border-r border-[rgba(255,255,255,0.06)] overflow-hidden">
        {/* Background 3D Abstract Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/login_abstract.jpg" 
            alt="Abstract 3D Background" 
            className="w-full h-full object-cover opacity-60" 
          />
          {/* Dark gradient overlay to blend with dark mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
        </div>
        
        {/* Hook Quote */}
        <div className="relative z-10 w-full max-w-lg">
          <Link href="/" className="inline-block mb-12">
            <span className="text-xl font-bold tracking-tight text-white">
              <TextAnimation delay={0.1} divideBy="letter">
                Nextflow.
              </TextAnimation>
            </span>
          </Link>
          <blockquote className="space-y-4">
            <p className="text-3xl sm:text-4xl font-semibold leading-tight tracking-[-0.02em] text-white">
              <TextAnimation delay={0.2} divideBy="word">
                "Secure, Scalable, and Unrivaled."
              </TextAnimation>
            </p>
            <footer className="text-sm text-[#71717a]">
              <TextAnimation delay={0.4} divideBy="word">
                The architecture that powers industry leaders.
              </TextAnimation>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative bg-[#09090b]">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">Nextflow.</Link>
        </div>

        {/* Form Container (Center-aligned, Negative space, Animation) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-[400px]"
        >
          <motion.div variants={itemVariants} className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
            <p className="text-[#a1a1aa] mt-2 text-sm">Join Nextflow digital platform.</p>
          </motion.div>

          {/* Social Logins (Outline, Monochrome) */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[rgba(255,255,255,0.15)] bg-transparent text-sm font-medium text-white hover:bg-white/5 hover:border-[rgba(255,255,255,0.3)] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[rgba(255,255,255,0.15)] bg-transparent text-sm font-medium text-white hover:bg-white/5 hover:border-[rgba(255,255,255,0.3)] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/></svg>
              GitHub
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[rgba(255,255,255,0.06)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#09090b] px-4 text-[#71717a]">Or continue with</span>
            </div>
          </motion.div>

          {errorMsg && (
            <motion.div variants={itemVariants} className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMsg}
            </motion.div>
          )}

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-3.5">
            {/* Premium Input 1 */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-[#a1a1aa]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full h-11 px-3 rounded-md bg-white/[0.03] border border-[rgba(255,255,255,0.15)] text-white placeholder-[#52525b] focus:outline-none focus:border-cyan-400 focus:bg-white/[0.05] focus:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all text-sm"
              />
            </div>

            {/* Premium Input 2 */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-[#a1a1aa]">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alex_dev"
                className="w-full h-11 px-3 rounded-md bg-white/[0.03] border border-[rgba(255,255,255,0.15)] text-white placeholder-[#52525b] focus:outline-none focus:border-cyan-400 focus:bg-white/[0.05] focus:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all text-sm"
              />
            </div>

            {/* Premium Input 3 */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[#a1a1aa]">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-11 px-3 rounded-md bg-white/[0.03] border border-[rgba(255,255,255,0.15)] text-white placeholder-[#52525b] focus:outline-none focus:border-cyan-400 focus:bg-white/[0.05] focus:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all text-sm"
              />
            </div>

            {/* End of inputs */}

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 h-11 rounded-md bg-white text-black font-semibold text-sm hover:bg-[#e4e4e7] transition-all disabled:opacity-50 active:scale-[0.98] shadow-sm"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-[#71717a]">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
