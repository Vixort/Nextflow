'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PhoneMockup from './PhoneMockup'
import IpadArcade from './IpadArcade'

const EASE = [0.22, 1, 0.36, 1] as const

type Device = 'phone' | 'ipad'

export default function DeviceStack() {
  const [front, setFront] = useState<Device>('phone')
  const ipadFront = front === 'ipad'

  return (
    <div className="relative h-[560px] sm:h-[620px] w-[290px] sm:w-[520px] mx-auto [perspective:1800px]">
      {/* iPad — behind by default */}
      <motion.div
        role="button"
        aria-label="Bring iPad forward"
        onClick={() => setFront('ipad')}
        initial={false}
        animate={
          ipadFront
            ? { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, x: 0, y: 0, zIndex: 40, filter: 'brightness(1)' }
            : { rotateX: 12, rotateY: 28, rotateZ: -6, scale: 0.88, x: -30, y: 45, zIndex: 10, filter: 'brightness(0.75)' }
        }
        transition={{
          duration: 0.75,
          ease: EASE,
          zIndex: { delay: ipadFront ? 0.32 : 0 },
        }}
        className="absolute left-0 top-5 sm:top-3 w-[290px] sm:w-[400px] cursor-pointer"
      >
        <div className="relative rounded-[2.2rem] bg-[#3a3a3e] p-[10px] shadow-[0_50px_100px_-20px_rgba(9,9,11,0.55)]">
          {/* Camera */}
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1c1c1e] z-20" />
          {/* Screen */}
          <div className="relative h-[480px] sm:h-[560px] rounded-[1.7rem] bg-[#0b0c11] overflow-hidden">
            <IpadArcade />
          </div>
        </div>

        {/* Tap hint when behind */}
        {!ipadFront && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-cyan-500 text-[#09090b] text-[10px] font-extrabold tracking-wide animate-pulse shadow-[0_8px_24px_rgba(6,182,212,0.4)]">
            Tap to play
          </div>
        )}
      </motion.div>

      {/* Phone — front by default */}
      <motion.div
        role="button"
        aria-label="Bring phone forward"
        onClick={() => setFront('phone')}
        initial={false}
        animate={
          !ipadFront
            ? { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, x: 0, y: 0, zIndex: 40, filter: 'brightness(1)' }
            : { rotateX: 10, rotateY: -26, rotateZ: 7, scale: 0.88, x: 40, y: 60, zIndex: 10, filter: 'brightness(0.75)' }
        }
        transition={{
          duration: 0.75,
          ease: EASE,
          zIndex: { delay: ipadFront ? 0 : 0.32 },
        }}
        className="absolute right-0 top-0 w-[250px] sm:w-[310px] cursor-pointer"
      >
        <PhoneMockup />

        {/* Tap hint when behind */}
        {ipadFront && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-white text-[#09090b] text-[10px] font-extrabold tracking-wide animate-pulse shadow-[0_8px_24px_rgba(255,255,255,0.25)]">
            Tap to switch
          </div>
        )}
      </motion.div>
    </div>
  )
}