'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-[#090a0f] text-slate-100 font-sans min-h-screen flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-center max-w-lg">
          <h1 className="text-3xl font-bold text-rose-500 mb-4">
            500 - Critical Application Failure
          </h1>
          <p className="text-slate-400 mb-6 leading-relaxed">
            A critical error occurred in the root application layout. The server circuit breaker has isolated the process.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg shadow-lg transition-colors cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  )
}
