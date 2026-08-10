import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getEnv } from '@/lib/env'

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
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      logger.warn('Health check: Supabase connection error', { error: error.message })
      return NextResponse.json(
        {
          status: 'degraded',
          reason: 'Database session check warning',
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
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    logger.error('Health check endpoint error', err)
    return NextResponse.json(
      {
        status: 'unhealthy',
        reason: 'Internal server failure',
        message: process.env.NODE_ENV === 'development' ? err.message : 'System service error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
