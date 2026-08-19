import { withConnection } from './client.ts'
import type { RowDataPacket } from 'mysql2/promise'

// ====================================================================
// RPC implementations — replaces Postgres functions called via
// supabase.rpc(). The two functions in use:
//   * rate_limit_tick(p_fingerprint, p_endpoint, p_window_start, p_max)
//     -> atomic counter increment on rate_limits (shared across
//        instances), then prunes old windows; returns the new count.
//   * bump_token_versions() -> increments token_version for every user
//     (admin "force re-login"); returns affected row count.
// ====================================================================

const ENDPOINT_WHITELIST: Record<string, boolean> = {
  rate_limit_tick: true,
  bump_token_versions: true,
}

// '2026-08-19 03:00:00.000' — explicit UTC naive format (see client.ts)
function formatUtc(date: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0')
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`
  )
}

export async function executeRpc(name: string, args: object = {}): Promise<unknown> {
  const a = args as Record<string, unknown>
  if (!ENDPOINT_WHITELIST[name]) {
    throw new Error(`Unknown RPC: ${name}`)
  }

  if (name === 'rate_limit_tick') {
    const raw = a.p_window_start
    const windowStart =
      raw instanceof Date ? formatUtc(raw) : new Date(String(raw ?? new Date().toISOString())).toISOString()
    return rateLimitTick(
      String(a.p_fingerprint ?? ''),
      String(a.p_endpoint ?? ''),
      windowStart,
      Number(a.p_max ?? 60)
    )
  }

  if (name === 'bump_token_versions') {
    return bumpTokenVersions()
  }

  throw new Error(`Unknown RPC: ${name}`)
}

async function rateLimitTick(
  fingerprint: string,
  endpoint: string,
  windowStart: string,
  // max requests per window — reserved for future sliding-window variants
  _max: number
): Promise<number> {
  return withConnection(async (conn) => {
    try {
      await conn.beginTransaction()

      await conn.query(
        `INSERT INTO rate_limits (fingerprint, endpoint, window_start, \`count\`)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE \`count\` = \`count\` + 1`,
        [fingerprint, endpoint, windowStart]
      )

      await conn.query(
        `DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL 2 HOUR`
      )

      const [rows] = await conn.query<RowDataPacket[]>(
        `SELECT \`count\` FROM rate_limits
          WHERE fingerprint = ? AND endpoint = ? AND window_start = ?`,
        [fingerprint, endpoint, windowStart]
      )

      await conn.commit()
      return rows.length > 0 ? Number(rows[0].count) : 1
    } catch (err) {
      await conn.rollback()
      throw err
    }
  })
}

async function bumpTokenVersions(): Promise<number> {
  return withConnection(async (conn) => {
    await conn.execute(`UPDATE users SET token_version = token_version + 1`)
    const [rows] = await conn.query<RowDataPacket[]>(`SELECT ROW_COUNT() AS affected`)
    return rows.length > 0 ? Number(rows[0].affected) : 0
  })
}