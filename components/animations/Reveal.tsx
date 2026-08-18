'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
}

const variants: Variants = {
  hidden: (d: Direction) => ({
    opacity: 0,
    x: offset[d].x,
    y: offset[d].y,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  delay?: number
  once?: boolean
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      custom={direction}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delay }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}