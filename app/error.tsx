'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#090a0f] text-slate-100 text-center font-sans">
      <h2 className="text-2xl font-bold text-rose-500 mb-3">
        Unexpected System Error
      </h2>
      <p className="text-slate-400 max-w-md mb-6">
        An unexpected issue occurred. The server process was safely isolated to prevent downtime.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>
  )
}
