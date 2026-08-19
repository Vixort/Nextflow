import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getEnv } from '@/lib/env'
import { createAdminClient } from '@/lib/db/client'

export async function GET() {
  const env = getEnv()

  if (!env.isValid) {
    logger.error('Health check failed: Invalid environment configuration', undefined, { errors: env.errors })
    return NextResponse.json(
      {
        status: 'unhealthy',
        reason: 'Invalid environment configuration',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }

  try {
    // Simple connectivity probe against the MariaDB backend.
    const { data, error } = await createAdminClient().from('users').select('id').limit(1)
    if (error) {
      logger.warn('Health check: database connection error', { error: error.message })
      return NextResponse.json(
        {
          status: 'degraded',
          reason: 'Database check warning',
          details: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      environment: env.NODE_ENV,
      rowsProbed: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    logger.error('Health check endpoint error', err instanceof Error ? err : String(err))
    return NextResponse.json(
      {
        status: 'unhealthy',
        reason: 'Internal server failure',
        message: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.message : String(err)) : 'System service error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
