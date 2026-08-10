import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Ensures incoming request payload body does not exceed max byte threshold.
 * Prevents memory exhaustion / Denial of Service from massive request bodies.
 */
export function checkPayloadSize(
  request: NextRequest,
  maxSizeBytes: number = 1 * 1024 * 1024 // 1 MB default
): { valid: boolean; response?: NextResponse } {
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const bytes = parseInt(contentLength, 10)
    if (!isNaN(bytes) && bytes > maxSizeBytes) {
      logger.warn('Payload size exceeded limit', { bytes, maxSizeBytes })
      return {
        valid: false,
        response: new NextResponse(
          JSON.stringify({
            status: 413,
            error: 'Payload Too Large',
            message: `ขนาดข้อมูลเกินกำหนดสูงสุด (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`,
          }),
          {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          }
        ),
      }
    }
  }
  return { valid: true }
}

/**
 * Wraps async promise with a strict execution timeout.
 * Prevents hanging API calls or infinite database locks.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = 'การประมวลผลหมดเวลา (Request Timeout)'
): Promise<T> {
  let timer: NodeJS.Timeout

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(errorMessage))
    }, timeoutMs)
  })

  try {
    const result = await Promise.race([promise, timeoutPromise])
    clearTimeout(timer!)
    return result
  } catch (error) {
    clearTimeout(timer!)
    throw error
  }
}
