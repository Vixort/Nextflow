import { logger } from '@/lib/logger'

interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  backoffFactor?: number
  retryableErrors?: string[]
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3
  let delay = options.initialDelayMs ?? 300
  const backoffFactor = options.backoffFactor ?? 2

  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      const isLastAttempt = attempt === maxRetries

      // Check if error is transient / retryable
      const errorMessage = error?.message || String(error)
      const isRetryable =
        errorMessage.includes('FETCH_ERROR') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('connection refused') ||
        errorMessage.includes('503') ||
        errorMessage.includes('502') ||
        errorMessage.includes('504')

      if (isLastAttempt || (!isRetryable && options.retryableErrors)) {
        logger.error(`Execution failed after ${attempt} attempt(s)`, error)
        throw error
      }

      logger.warn(`Transient error detected (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`, {
        error: errorMessage,
      })

      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= backoffFactor
    }
  }

  throw lastError
}
