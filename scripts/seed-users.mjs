// ============================================================
// Seed demo users of every role type on MariaDB.
// Mirrors scripts/seed-admin.mjs conventions (UTC-naive, bcrypt).
//
// Usage:  node scripts/seed-users.mjs
// Env:    DB_HOST / DB_USER / DB_PASSWORD / DB_NAME
//         (defaults: 127.0.0.1 / root / '' / nextflow)
// ============================================================
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const host = process.env.DB_HOST || '127.0.0.1'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'nextflow'

// Password for every seeded account (override via SEED_PASSWORD).
const SEED_PASSWORD = process.env.SEED_PASSWORD || 'DemoPass123'

// email, username, full_name, role
// NOTE: admin@nextflow.com is managed by scripts/seed-admin.mjs (role owner).
const USERS = [
  ['owner@nextflow.com', 'owner', 'Platform Owner', 'owner'],
  ['mod1@nextflow.com', 'moderator1', 'Moderator One', 'moderator'],
  ['mod2@nextflow.com', 'moderator2', 'Moderator Two', 'moderator'],
  ['user1@nextflow.com', 'user1', 'Regular User One', 'user'],
  ['user2@nextflow.com', 'user2', 'Regular User Two', 'user'],
  ['user3@nextflow.com', 'user3', 'Regular User Three', 'user'],
]

async function main() {
  const conn = await mysql.createConnection({ host, user, password, database })
  try {
    // Match the app layer: all datetimes are UTC-naive.
    await conn.query("SET time_zone = '+00:00'")
    const passwordHash = bcrypt.hashSync(SEED_PASSWORD, 10)

    for (const [email, username, fullName, role] of USERS) {
      const [rows] = await conn.execute(
        `INSERT INTO users (email, username, password_hash, full_name, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           password_hash = VALUES(password_hash),
           full_name = VALUES(full_name),
           role = VALUES(role)`,
        [email, username, passwordHash, fullName, role]
      )
      console.log(
        `User upserted (${rows.affectedRows > 0 ? 'created' : 'updated'}): ${email} [${role}]`
      )
    }
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
  console.error('seed-users failed:', err.message)
  process.exit(1)
})
