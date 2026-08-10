type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMessage {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp?: string
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString()
    const logData: LogMessage = {
      level,
      message,
      timestamp,
      ...(context && { context: this.sanitizeContext(context) }),
    }
    return JSON.stringify(logData)
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...context }
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie']

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]'
      }
    }
    return sanitized
  }

  info(message: string, context?: Record<string, unknown>) {
    console.log(this.formatLog('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(this.formatLog('warn', message, context))
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const errObj = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { rawError: String(error) }
    console.error(this.formatLog('error', message, { ...context, error: errObj }))
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatLog('debug', message, context))
    }
  }
}

export const logger = new Logger()
