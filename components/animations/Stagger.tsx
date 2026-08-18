'use client'

import { motion, type Variants } from 'framer-motion'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 56 },
  down: { x: 0, y: -56 },
  left: { x: 56, y: 0 },
  right: { x: -56, y: 0 },
  none: { x: 0, y: 0 },
}

const DirectionContext = createContext<Direction>('up')

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0 },
  },
}

const itemVariants: Variants = {
  hidden: (d: Direction) => ({
    opacity: 0,
    x: offset[d].x,
    y: offset[d].y,
    scale: 0.96,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function Stagger({
  children,
  className,
  direction = 'up',
  once = true,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  once?: boolean
  amount?: number
}) {
  return (
    <DirectionContext.Provider value={direction}>
      <motion.div
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    </DirectionContext.Provider>
  )
}

export function StaggerItem({
  children,
  className,
  direction,
}: {
  children: ReactNode
  className?: string
  direction?: Direction
}) {
  const inherited = useContext(DirectionContext)
  const dir = direction ?? inherited

  return (
    <motion.div className={className} custom={dir} variants={itemVariants}>
      {children}
    </motion.div>
  )
}