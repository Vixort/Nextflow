// ============================================================
// Seed / reset the admin account on MariaDB.
// Mirrors scripts/seed-admin.js but speaks MySQL instead of
// Supabase (PostgREST).
//
// Usage:  node scripts/seed-admin.mjs
// Env:    DB_HOST / DB_USER / DB_PASSWORD / DB_NAME
//         (defaults: 127.0.0.1 / root / '' / nextflow)
// ============================================================
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const host = process.env.DB_HOST || '127.0.0.1'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'nextflow'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nextflow.com'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function main() {
  const conn = await mysql.createConnection({ host, user, password, database })
  try {
    const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
    const [rows] = await conn.execute(
      `INSERT INTO users (email, username, password_hash, role)
       VALUES (?, ?, ?, 'owner')
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         username = VALUES(username),
         role = 'owner'`,
      [ADMIN_EMAIL, ADMIN_USERNAME, passwordHash]
    )
    console.log('Admin upserted:', rows.affectedRows > 0 ? 'created' : 'updated', `(${ADMIN_EMAIL})`)
  } catch (err) {
    if (err?.code === 'ER_NO_SUCH_TABLE') {
      console.error('Table does not exist. Please run: bash scripts/init-mariadb.sh')
      process.exit(1)
    }
    throw err
  } finally {
    await conn.end()
  }
}

main().catch((err) => {
  console.error('seed-admin failed:', err.message)
  process.exit(1)
})
