import mysql, { type Pool, type PoolConnection, type RowDataPacket } from 'mysql2/promise'
import { randomUUID } from 'crypto'

// ====================================================================
// MariaDB client — supabase-js-compatible surface for the subset of
// the PostgREST API this app actually uses (see todolist.md §1):
//   from(table).select/eq/neq/in/gte/lt/or/contains/order/limit/
//                single/maybeSingle/insert/update/upsert/delete
// Returns { data, error } exactly like supabase-js so existing call
// sites keep working — only the import changes.
//
// Behaviors mirrored from supabase-js:
//   * rows come back with JSON columns parsed and datetimes as ISO
//     strings (supabase returns JSONB parsed + timestamptz as ISO)
//   * missing `id` values are filled with a UUID (gen_random_uuid)
//   * single() errors on zero rows; maybeSingle() returns null
//   * upsert() maps to ON DUPLICATE KEY UPDATE
//   * write chains like .insert(x).select('id') re-select written rows
//   * select(cols, { count: 'exact', head: true }) runs COUNT(*)
// ====================================================================

export interface DbError {
  message: string
  code?: string
  details?: unknown
  hint?: string | null
}

// Discriminated union, mirroring supabase-js: checking `error` narrows
// `data` to its non-null branch.
export type DbResult<T> =
  | { data: T; count?: number | null; error: null }
  | { data: null; count?: number | null; error: DbError }

interface ColumnInfo {
  name: string
  dataType: string
  isPrimary: boolean
}

let pool: Pool | null = null
let schemaCache: Record<string, ColumnInfo[] | null> = {}

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nextflow',
      connectionLimit: 10,
      timezone: 'Z',
      charset: 'utf8mb4_unicode_ci',
      waitForConnections: true,
      enableKeepAlive: true,
    })
    // Work entirely in UTC so NOW() and cleanup comparisons line up
    // with the UTC datetimes written from the app layer.
    pool.on('connection', (conn) => {
      // The 'connection' event fires with a callback-style connection.
      const c = conn as unknown as { query(sql: string, cb: (err: unknown) => void): void }
      c.query("SET time_zone = '+00:00'", () => {})
    })
  }
  return pool
}

export function closeDb(): Promise<void> {
  if (!pool) return Promise.resolve()
  const p = pool
  pool = null
  schemaCache = {}
  return p.end()
}

// ------------------------------------------------------------------
// Schema introspection (cached per table)
// ------------------------------------------------------------------
async function tableInfo(table: string): Promise<ColumnInfo[] | null> {
  if (table in schemaCache) return schemaCache[table]
  try {
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT column_name AS name, data_type AS dataType,
              IF(column_key = 'PRI', 1, 0) AS isPrimary
         FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = ?
        ORDER BY ordinal_position`,
      [table]
    )
    const info = rows.map((r) => ({
      name: String(r.name),
      dataType: String(r.dataType),
      isPrimary: Number(r.isPrimary) === 1,
    }))
    schemaCache[table] = info
    return info
  } catch {
    schemaCache[table] = null
    return null
  }
}

const q = (ident: string): string => `\`${ident.replace(/`/g, '``')}\``

function isJsonColumn(info: ColumnInfo[] | null, col: string): boolean {
  return !!info?.some((c) => c.name === col && c.dataType === 'json')
}

function isDatetimeColumn(info: ColumnInfo[] | null, col: string): boolean {
  return !!info?.some(
    (c) => c.name === col && (c.dataType === 'datetime' || c.dataType === 'timestamp' || c.dataType === 'date')
  )
}

// Rows come back with JSON strings and Date objects; normalize to the
// JSON-friendly shapes supabase-js returns.
function normalizeRow(row: Record<string, unknown>, info: ColumnInfo[] | null): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    if (value === undefined) {
      out[key] = null
    } else if (isJsonColumn(info, key) && typeof value === 'string') {
      try {
        out[key] = JSON.parse(value)
      } catch {
        out[key] = value
      }
    } else if (isDatetimeColumn(info, key) && value instanceof Date) {
      out[key] = value.toISOString()
    } else {
      out[key] = value
    }
  }
  return out
}

function toSqlValue(value: unknown, info: ColumnInfo[] | null, col: string): unknown {
  if (value === undefined) return null
  if (value instanceof Date) return formatUtc(value)
  // App code passes new Date().toISOString() strings into datetime columns;
  // PostgREST accepted them but MariaDB needs the UTC-naive format.
  if (typeof value === 'string' && ISO_8601_RE.test(value)) {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? value : formatUtc(parsed)
  }
  if (typeof value === 'object' && value !== null && !Buffer.isBuffer(value) && isJsonColumn(info, col)) {
    return JSON.stringify(value)
  }
  return value
}

const ISO_8601_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/

// '2026-08-19 03:00:00.000' — explicit UTC naive format MariaDB always
// accepts; avoids mysql2 Date formatting quirks entirely.
function formatUtc(date: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0')
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}`
  )
}

// ------------------------------------------------------------------
// Query builder
// ------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- runtime row shape is untyped by design
type Row = Record<string, any>

interface Filter {
  op: 'eq' | 'neq' | 'in' | 'gte' | 'lt' | 'contains' | 'not'
  col: string
  value: unknown
}

type WriteOp = 'insert' | 'upsert' | 'update' | 'delete'

class TableQuery<T extends Row = Row> {
  private table: string
  private filters: Filter[] = []
  private orClauses: { fragment: string }[] = []
  private orderBy: { col: string; asc: boolean }[] = []
  private limitN: number | null = null
  private selectCols: string[] | null = null
  private selectAfterWrite = false
  private countOpt: 'exact' | null = null
  private writeOp: WriteOp | null = null
  private writeRows: Record<string, unknown>[] = []
  private writeValues: Record<string, unknown> = {}

  constructor(table: string) {
    this.table = table
  }

  select(cols?: string, opts?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }): this {
    if (cols && cols.trim() !== '*') {
      this.selectCols = cols
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    }
    if (opts?.count === 'exact') this.countOpt = 'exact'
    if (this.writeOp) this.selectAfterWrite = true
    return this
  }

  eq(col: string, value: unknown): this {
    this.filters.push({ op: 'eq', col, value })
    return this
  }

  neq(col: string, value: unknown): this {
    this.filters.push({ op: 'neq', col, value })
    return this
  }

  in(col: string, values: unknown[]): this {
    this.filters.push({ op: 'in', col, value: values })
    return this
  }

  gte(col: string, value: unknown): this {
    this.filters.push({ op: 'gte', col, value })
    return this
  }

  lt(col: string, value: unknown): this {
    this.filters.push({ op: 'lt', col, value })
    return this
  }

  contains(col: string, value: unknown): this {
    this.filters.push({ op: 'contains', col, value })
    return this
  }

  // PostgREST-style OR fragment: 'col.op.value,col2.op.value' (comma = OR)
  or(fragment: string): this {
    this.orClauses.push({ fragment })
    return this
  }

  // PostgREST-style .not(col, op, value) — used with ('x', 'is', null).
  not(col: string, op: string, value: unknown): this {
    this.filters.push({ op: 'not', col, value: { op, value } })
    return this
  }

  order(col: string, opts?: { ascending?: boolean }): this {
    this.orderBy.push({ col, asc: opts?.ascending !== false })
    return this
  }

  limit(count: number): this {
    this.limitN = count
    return this
  }

  insert(rows: object | object[]): this {
    this.writeOp = 'insert'
    this.writeRows = Array.isArray(rows) ? rows : [rows]
    return this
  }

upsert(
    rows: object | object[],
    // reserved for onConflict/ignoreDuplicates handling in future revisions
    _opts?: { onConflict?: string; ignoreDuplicates?: boolean }
  ): this {
    this.writeOp = 'upsert'
    this.writeRows = Array.isArray(rows) ? rows : [rows]
    return this
  }

  update(values: Record<string, unknown>): this {
    this.writeOp = 'update'
    this.writeValues = values
    return this
  }

  delete(): this {
    this.writeOp = 'delete'
    return this
  }

  // --------------------------------------------------------------
  // Reads (terminal — cannot be chained further, like supabase-js)
  // --------------------------------------------------------------
  async maybeSingle(): Promise<DbResult<T | null>> {
    // Write chains (insert/update/upsert/delete + select): delegate to
    // execute() which returns the affected rows; a plain SELECT here would
    // ignore the write and return the table's first row instead.
    if (this.writeOp) {
      const res = await this.execute()
      if (res.error) return { data: null, error: res.error }
      return { data: (res.data?.[0] ?? null) as T | null, error: null }
    }
    this.limit(1)
    const rows = await this.executeSelect()
    return { data: (rows[0] ?? null) as T | null, error: null }
  }

  async single(): Promise<DbResult<T>> {
    if (this.writeOp) {
      const res = await this.execute()
      if (res.error) return { data: null, error: res.error }
      const rows = res.data ?? []
      if (rows.length === 0) {
        return { data: null, error: { message: 'No rows returned', code: 'PGRST116' } }
      }
      return { data: rows[0] as T, error: null }
    }
    this.limit(1)
    const rows = await this.executeSelect()
    if (rows.length === 0) {
      return { data: null, error: { message: 'No rows returned', code: 'PGRST116' } }
    }
    return { data: rows[0] as T, error: null }
  }

  // Awaiting the query object (with or without a write op) executes it,
  // mirroring supabase-js thenable behavior.
  then<TResult1 = DbResult<T[]>, TResult2 = never>(
    onfulfilled?: ((value: DbResult<T[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }

  private async execute(): Promise<DbResult<T[]>> {
    try {
      if (this.countOpt === 'exact') return await this.executeCount()
      switch (this.writeOp) {
        case 'insert':
          return await this.doWrite('insert')
        case 'upsert':
          return await this.doWrite('upsert')
        case 'update':
          return await this.doUpdate()
        case 'delete':
          return await this.doDelete()
        default:
          return { data: (await this.executeSelect()) as T[], error: null }
      }
    } catch (err) {
      return { data: null, error: errorOf(err) }
    }
  }

  // --------------------------------------------------------------
  // SQL building
  // --------------------------------------------------------------
  private async whereClause(info: ColumnInfo[] | null): Promise<{ sql: string; params: unknown[] }> {
    const clauses: string[] = []
    const params: unknown[] = []
    for (const f of this.filters) {
      switch (f.op) {
        case 'eq':
          if (f.value === null) {
            clauses.push(`${q(f.col)} IS NULL`)
          } else {
            clauses.push(`${q(f.col)} = ?`)
            params.push(toSqlValue(f.value, info, f.col))
          }
          break
        case 'neq':
          clauses.push(`${q(f.col)} <> ?`)
          params.push(toSqlValue(f.value, info, f.col))
          break
        case 'in': {
          const arr = (Array.isArray(f.value) ? f.value : [f.value]).filter((v) => v !== undefined)
          if (arr.length === 0) {
            clauses.push('1 = 0')
          } else {
            clauses.push(`${q(f.col)} IN (${arr.map(() => '?').join(', ')})`)
            params.push(...arr.map((v) => toSqlValue(v, info, f.col)))
          }
          break
        }
        case 'gte':
          clauses.push(`${q(f.col)} >= ?`)
          params.push(toSqlValue(f.value, info, f.col))
          break
        case 'lt':
          clauses.push(`${q(f.col)} < ?`)
          params.push(toSqlValue(f.value, info, f.col))
          break
        case 'contains': {
          const val = Array.isArray(f.value) ? f.value[0] : f.value
          clauses.push(`JSON_CONTAINS(${q(f.col)}, JSON_QUOTE(?))`)
          params.push(String(val ?? ''))
          break
        }
        case 'not': {
          const inner = (f.value as { op: string; value: unknown }).value
          if (inner === null) {
            clauses.push(`${q(f.col)} IS NOT NULL`)
          } else {
            clauses.push(`${q(f.col)} <> ?`)
            params.push(toSqlValue(inner, info, f.col))
          }
          break
        }
      }
    }
    for (const or of this.orClauses) {
      const parsed = parseOrFragment(or.fragment)
      clauses.push(`(${parsed.sql})`)
      params.push(...parsed.params)
    }
    return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
  }

  private orderSql(): string {
    if (this.orderBy.length === 0) return ''
    return `ORDER BY ${this.orderBy.map((o) => `${q(o.col)} ${o.asc ? 'ASC' : 'DESC'}`).join(', ')}`
  }

  private selectSql(cols: string[] | null): string {
    return cols && cols.length > 0 ? cols.map(q).join(', ') : '*'
  }

  private async executeSelect(): Promise<Row[]> {
    const info = await tableInfo(this.table)
    const { sql: whereSql, params } = await this.whereClause(info)
    const orderSql = this.orderSql()
    const limitSql = this.limitN !== null ? `LIMIT ${Math.max(0, Math.floor(this.limitN))}` : ''
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT ${this.selectSql(this.selectCols)} FROM ${q(this.table)} ${whereSql} ${orderSql} ${limitSql}`,
      params
    )
    return rows.map((r) => normalizeRow(r as Record<string, unknown>, info))
  }

  private async executeCount(): Promise<DbResult<T[]>> {
    const info = await tableInfo(this.table)
    const { sql: whereSql, params } = await this.whereClause(info)
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT COUNT(*) AS \`count\` FROM ${q(this.table)} ${whereSql}`,
      params
    )
    return { data: [], count: Number(rows[0]?.count ?? 0), error: null }
  }

  // --------------------------------------------------------------
  // Writes
  // --------------------------------------------------------------
  private prepareRows(info: ColumnInfo[] | null): Record<string, unknown>[] {
    const idCol = info?.find((c) => c.name === 'id' && c.isPrimary)?.name
    const hasCreated = !!info?.some((c) => c.name === 'created_at')
    const hasUpdated = !!info?.some((c) => c.name === 'updated_at')
    const now = formatUtc(new Date())
    return this.writeRows.map((row) => {
      const out = { ...row }
      if (idCol && (out.id === undefined || out.id === null || out.id === '')) {
        out.id = randomUUID()
      }
      // Fill timestamps explicitly (UTC) so DB DEFAULT CURRENT_TIMESTAMP
      // (session-TZ dependent) never writes local time by accident.
      if (hasCreated && out.created_at === undefined) out.created_at = now
      if (hasUpdated && out.updated_at === undefined) out.updated_at = now
      return out
    })
  }

  private async doWrite(kind: 'insert' | 'upsert'): Promise<DbResult<T[]>> {
    const info = await tableInfo(this.table)
    const arr = this.prepareRows(info)
    if (arr.length === 0) {
      return { data: (this.selectAfterWrite ? [] : null) as T[] | null, error: null } as unknown as DbResult<T[]>
    }

    const cols = [...new Set(arr.flatMap((r) => Object.keys(r)))]
    const valuesSql = arr.map(() => `(${cols.map(() => '?').join(', ')})`).join(', ')
    const params = arr.flatMap((row) => cols.map((c) => toSqlValue(row[c], info, c)))

    if (kind === 'upsert') {
      const pkCols = (info ?? []).filter((c) => c.isPrimary).map((c) => c.name)
      const updateCols = cols.filter((c) => !pkCols.includes(c))
      const updateSql =
        updateCols.length > 0
          ? `ON DUPLICATE KEY UPDATE ${updateCols.map((c) => `${q(c)} = VALUES(${q(c)})`).join(', ')}`
          : ''
      await getPool().execute(
        `INSERT INTO ${q(this.table)} (${cols.map(q).join(', ')}) VALUES ${valuesSql} ${updateSql}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mysql2 param packets accept any values
        params as any[]
      )
    } else {
      await getPool().execute(
        `INSERT INTO ${q(this.table)} (${cols.map(q).join(', ')}) VALUES ${valuesSql}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mysql2 param packets accept any values
        params as any[]
      )
    }

    if (this.selectAfterWrite) {
      const idCol = info?.find((c) => c.name === 'id' && c.isPrimary)?.name
      const ids = arr.map((r) => r[idCol ?? 'id']).filter((v) => v !== undefined && v !== null)
      if (idCol && ids.length > 0) {
        const select = new TableQuery<T>(this.table)
        select.selectCols = this.selectCols
        select.in(idCol, ids)
        return { data: (await select.executeSelect()) as T[], error: null }
      }
      return { data: [], error: null }
    }
    return { data: null, error: null } as unknown as DbResult<T[]>
  }

  private async doUpdate(): Promise<DbResult<T[]>> {
    const info = await tableInfo(this.table)
    const entries = Object.entries(this.writeValues)
    if (entries.length === 0) return { data: null, error: { message: 'No columns to update' } }
    const setSql = entries.map(([c]) => `${q(c)} = ?`).join(', ')
    const setParams = entries.map(([c, v]) => toSqlValue(v, info, c))
    const { sql: whereSql, params: whereParams } = await this.whereClause(info)
    if (!whereSql) return { data: null, error: { message: 'Update requires a filter' } }

    await getPool().execute(
      `UPDATE ${q(this.table)} SET ${setSql} ${whereSql}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mysql2 param packets accept any values
      [...setParams, ...whereParams] as any[]
    )

    if (this.selectAfterWrite) {
      const select = new TableQuery<T>(this.table)
      select.selectCols = this.selectCols
      select.filters = this.filters
      select.orClauses = this.orClauses
      select.orderBy = this.orderBy
      select.limitN = this.limitN
      return { data: (await select.executeSelect()) as T[], error: null }
    }
    return { data: null, error: null } as unknown as DbResult<T[]>
  }

  private async doDelete(): Promise<DbResult<T[]>> {
    const info = await tableInfo(this.table)
    const { sql: whereSql, params } = await this.whereClause(info)
    if (!whereSql) return { data: null, error: { message: 'Delete requires a filter' } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mysql2 param packets accept any values
    await getPool().execute(`DELETE FROM ${q(this.table)} ${whereSql}`, params as any[])
    return { data: null, error: null } as unknown as DbResult<T[]>
  }
}

// 'username.ilike.%x%,description.ilike.%x%' | 'email.eq.x,username.eq.x'
function parseOrFragment(fragment: string): { sql: string; params: unknown[] } {
  const parts = fragment.split(',').map((p) => p.trim()).filter(Boolean)
  const clauses: string[] = []
  const params: unknown[] = []
  for (const part of parts) {
    const firstDot = part.indexOf('.')
    const secondDot = firstDot >= 0 ? part.indexOf('.', firstDot + 1) : -1
    if (firstDot < 0 || secondDot < 0) continue
    const col = part.slice(0, firstDot)
    const op = part.slice(firstDot + 1, secondDot)
    const value = part.slice(secondDot + 1)
    switch (op) {
      case 'eq':
        clauses.push(`${q(col)} = ?`)
        params.push(value)
        break
      case 'ilike':
      case 'like': {
        // Our utf8mb4_unicode_ci collation is case-insensitive, so
        // plain LIKE already matches PostgREST's ilike semantics.
        clauses.push(`${q(col)} LIKE ?`)
        params.push(value.replaceAll('*', '%'))
        break
      }
      default:
        clauses.push('1 = 1')
    }
  }
  return { sql: clauses.join(' OR '), params }
}

export interface DbClient {
  from<T extends Row = Row>(table: string): TableQuery<T>
  rpc<T = unknown>(name: string, args?: object): Promise<DbResult<T>>
}

export const db: DbClient = {
  from<T extends Row = Row>(table: string) {
    return new TableQuery<T>(table)
  },
  async rpc<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<DbResult<T>> {
    // Implemented in lib/db/rpc.ts (kept separate to avoid a static
    // circular import; .ts extension satisfies Node type-stripping)
    const { executeRpc } = await import('./rpc.ts')
    try {
      return { data: (await executeRpc(name, args)) as T, error: null }
    } catch (err) {
      return { data: null, error: errorOf(err) }
    }
  },
}

export function createAdminClient(): DbClient {
  return db
}

function errorOf(err: unknown): DbError {
  const e = err as { message?: string; code?: string }
  return {
    message: e?.message || 'Database error',
    code: typeof e?.code === 'string' ? `DB_${e.code}` : undefined,
    details: err,
  }
}

// Exposed for tests / transactions.
export async function withConnection<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await getPool().getConnection()
  try {
    // Ensure UTC session BEFORE any SQL runs: the pool-level SET (see
    // getPool) is fire-and-forget and races the first query on a fresh
    // connection — without this, NOW() comparisons (rate-limit pruning)
    // silently compare local time against UTC datetimes.
    await (conn as unknown as { query(sql: string): Promise<unknown> }).query(
      "SET time_zone = '+00:00'"
    )
    return await fn(conn)
  } finally {
    conn.release()
  }
}
