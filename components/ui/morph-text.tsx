'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MorphTextProps {
  words?: string[]
  interval?: number
  subtext?: string
  fontSize?: string
  fontFamily?: string
  className?: string
  textClassName?: string
  wordClassName?: string
  subtextClassName?: string
}

export function MorphText({
  words = ['CREATE', 'DESIGN', 'DEVELOP'],
  interval = 3000,
  subtext,
  fontSize = 'clamp(3rem, 15vw, 10rem)',
  fontFamily = '"Space Grotesk", sans-serif',
  className,
  textClassName,
  wordClassName,
  subtextClassName,
}: MorphTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval])

  const currentWord = words[index]

  return (
    <div className={cn('morph-text-root relative flex flex-col items-center', className)}>
      {/* Morphing word — keyed by index so each change re-animates */}
      <div
        className={cn('morph-text-container relative select-none', textClassName)}
        style={{ fontSize, fontWeight: 700, fontFamily }}
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWord}
            className={cn('morph-word inline-flex items-center whitespace-nowrap', wordClassName)}
            initial={{ opacity: 0, filter: 'blur(16px)', y: 14, scale: 0.92 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(16px)', y: -14, scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </div>

      {subtext && (
        <motion.p
          className={cn(
            'morph-subtext mt-8 uppercase tracking-[0.2em] text-[#888] text-center',
            subtextClassName
          )}
          style={{ fontSize: '1.2rem', fontFamily }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {subtext}
        </motion.p>
      )}
    </div>
  )
}

export default MorphText
