'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, RotateCcw, Trophy } from 'lucide-react'

type Cell = 'X' | 'O' | null

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function findWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return null
}

function bestMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)

  const tryLine = (player: Cell) => {
    for (const line of WIN_LINES) {
      const cells = line.map((i) => board[i])
      if (cells.filter((c) => c === player).length === 2 && cells.includes(null)) {
        return line[cells.indexOf(null)]
      }
    }
    return -1
  }

  const win = tryLine('O')
  if (win >= 0) return win
  const block = tryLine('X')
  if (block >= 0) return block
  if (board[4] === null) return 4
  const corners = empty.filter((i) => [0, 2, 6, 8].includes(i))
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function IpadArcade() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 })
  const [thinking, setThinking] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const result = findWinner(board)
  const draw = !result && board.every(Boolean)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const play = (i: number) => {
    if (board[i] || result || draw || thinking) return

    const next = [...board]
    next[i] = 'X'
    setBoard(next)

    const afterX = findWinner(next)
    if (afterX || next.every(Boolean)) {
      if (afterX) setScore((s) => ({ ...s, X: s.X + 1 }))
      else if (next.every(Boolean)) setScore((s) => ({ ...s, draws: s.draws + 1 }))
      return
    }

    setThinking(true)
    timerRef.current = setTimeout(() => {
      const ai = [...next]
      ai[bestMove(ai)] = 'O'
      setBoard(ai)
      const afterO = findWinner(ai)
      if (afterO) setScore((s) => ({ ...s, O: s.O + 1 }))
      else if (ai.every(Boolean)) setScore((s) => ({ ...s, draws: s.draws + 1 }))
      setThinking(false)
    }, 550)
  }

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setBoard(Array(9).fill(null))
    setThinking(false)
    setScore({ X: 0, O: 0, draws: 0 })
  }

  const status = result
    ? result.winner === 'X'
      ? 'You win!'
      : 'AI wins'
    : draw
      ? "It's a draw"
      : thinking
        ? 'AI is thinking…'
        : 'Your move (X)'

  return (
    <div className="relative h-full flex flex-col select-none">
      <div aria-hidden className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-40 bg-violet-500/10 blur-[60px] rounded-full" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <Gamepad2 size={15} className="text-cyan-300" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-white tracking-wide">Nextflow Arcade</div>
            <div className="text-[9px] text-[#71717a] font-semibold">Tic-Tac-Toe · You vs AI</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">X {score.X}</span>
          <span className="px-2 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[#a1a1aa]">Draw {score.draws}</span>
          <span className="px-2 py-1 rounded-lg bg-violet-500/10 border border-violet-500/25 text-violet-300">O {score.O}</span>
        </div>
      </div>

      {/* Board */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-[320px] grid grid-cols-3 gap-2.5">
          {board.map((cell, i) => {
            const inWinLine = result?.line.includes(i) ?? false
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => play(i)}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`aspect-square rounded-xl border text-3xl sm:text-4xl font-extrabold flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  inWinLine
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                    : cell === 'X'
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                      : cell === 'O'
                        ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/25 text-transparent'
                }`}
              >
                {cell ?? ''}
              </motion.button>
            )
          })}
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center gap-2 text-xs font-bold">
          {result?.winner === 'X' && <Trophy size={13} className="text-cyan-300" />}
          <span className={result?.winner === 'X' ? 'text-cyan-300' : result?.winner === 'O' ? 'text-violet-300' : 'text-[#a1a1aa]'}>
            {status}
          </span>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#09090b] text-[10px] font-extrabold tracking-wide hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} /> Restart
        </button>
      </div>

      {/* Footer hint */}
      <div className="relative z-10 pb-5 text-center text-[9px] text-[#52525b] font-semibold tracking-wide">
        Tap any square — the AI answers in under a second
      </div>
    </div>
  )
}