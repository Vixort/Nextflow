// ============================================================
// Seed the template_tags table: preset tag groups (kept in sync
// with lib/puck/templateTags.ts) + any legacy tags already used
// by existing templates (seeded as custom tags so they remain
// selectable in the tag picker).
//
// Usage:  node scripts/seed-tags.mjs
// Env:    DB_HOST / DB_USER / DB_PASSWORD / DB_NAME
//         (defaults: 127.0.0.1 / root / '' / nextflow)
// ============================================================
import mysql from 'mysql2/promise'

const host = process.env.DB_HOST || '127.0.0.1'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || ''
const database = process.env.DB_NAME || 'nextflow'

// Keep in sync with lib/puck/templateTags.ts (PRESET_TAG_GROUPS).
const PRESET_GROUPS = [
  ['Industry', ['SaaS', 'E-Commerce', 'Portfolio', 'Blog', 'Restaurant', 'Real Estate', 'Agency', 'Startup', 'Finance', 'Fitness', 'Travel', 'Education', 'Healthcare', 'Event', 'Personal']],
  ['Style', ['Minimal', 'Dark', 'Light', 'Bold', 'Elegant', 'Luxury', 'Modern', 'Classic', 'Playful', 'Editorial', 'Geometric', 'Gradient']],
  ['Layout', ['Landing Page', 'One Page', 'Multi-Page', 'Dashboard', 'Etsy Store', 'Showcase', 'Marketing', 'Product', 'Lead Gen', 'Coming Soon']],
  ['Feature', ['Animations', '3D', 'Dark Mode', 'Interactive', 'RTL', 'Blog Engine', 'Cart', 'Booking', 'Auth', 'CMS', 'API', 'SEO']],
  ['Theme', ['Cyberpunk', 'Neo-Brutalism', 'Glassmorphism', 'Retro', 'Aurora', 'Monochrome', 'Bento', 'Glass', 'Warm', 'Cool']],
]

async function main() {
  const conn = await mysql.createConnection({ host, user, password, database })
  try {
    await conn.query("SET time_zone = '+00:00'")

    let presets = 0
    for (const [group, tags] of PRESET_GROUPS) {
      for (const name of tags) {
        const [rows] = await conn.execute(
          `INSERT INTO template_tags (name, group_name, is_preset)
           VALUES (?, ?, 1)
           ON DUPLICATE KEY UPDATE group_name = VALUES(group_name), is_preset = 1`,
          [name, group]
        )
        if (rows.affectedRows > 0) presets += 1
      }
    }

    // Legacy tags already used by templates but not in the preset list —
    // seeded as custom tags so they stay selectable.
    let customs = 0
    const [templateRows] = await conn.query(
      `SELECT tags FROM website_templates WHERE tags IS NOT NULL`
    )
    for (const row of templateRows) {
      let tags = []
      try {
        tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
      } catch {
        continue
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || !tag.trim()) continue
        const [rows] = await conn.execute(
          `INSERT IGNORE INTO template_tags (name, group_name, is_preset)
           VALUES (?, 'Custom', 0)`,
          [tag.trim().slice(0, 40)]
        )
        if (rows.affectedRows > 0) customs += 1
      }
    }

    console.log(`Template tags seeded: ${presets} presets, ${customs} legacy custom tags`)
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
  console.error('seed-tags failed:', err.message)
  process.exit(1)
})
