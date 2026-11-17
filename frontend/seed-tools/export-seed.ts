// Writes the course content owned by other services into their seed files:
//   - ai-service/seed/ai_activities.json        (prompt templates)
//   - deploy/local/seed/evaluation_ovas.sql      (evaluations and answer keys)
// Run with: pnpm seed:export

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { COURSE_UNITS } from '../src/content'
import { AI_TEMPLATES } from './ai-templates'
import { seedTables } from '../src/api/local/seed'

const root = resolve(import.meta.dirname, '..', '..')
const sql = (value: string) => `'${value.replaceAll("'", "''")}'`

const aiPath = resolve(root, 'ai-service/seed/ai_activities.json')
writeFileSync(aiPath, JSON.stringify(AI_TEMPLATES, null, 2) + '\n')

const rows = COURSE_UNITS.map(({ evaluation }) =>
  `  (${sql(evaluation.id)}, ${sql(evaluation.ova_id)}, ${sql(evaluation.type)}, ${sql(JSON.stringify(evaluation.config))}::jsonb)`,
)
const evaluationPath = resolve(root, 'deploy/local/seed/evaluation_ovas.sql')
writeFileSync(
  evaluationPath,
  [
    '-- Generado por frontend/seed-tools/export-seed.ts. No editar a mano.',
    'INSERT INTO evaluations (id, ova_id, type, config) VALUES',
    rows.join(',\n'),
    'ON CONFLICT (id) DO UPDATE SET ova_id = EXCLUDED.ova_id, type = EXCLUDED.type, config = EXCLUDED.config;',
    '',
  ].join('\n'),
)

console.log(`${AI_TEMPLATES.length} plantillas de IA → ${aiPath}`)
console.log(`${rows.length} evaluaciones → ${evaluationPath}`)

// content-service, activity-service and tracking-service (spec 7.2, 7.3, 7.6).
// Content is seeded once per OVA: if the OVA already exists, the teacher may
// have edited it, so its rows are left alone (RESEED=1 in dev.sh resets it).
const tables = seedTables()
type Rec = Record<string, unknown>
const value = (v: unknown) =>
  v === null || v === undefined ? 'NULL' : typeof v === 'boolean' || typeof v === 'number' ? String(v) : sql(String(v))
const insert = (table: string, columns: string[], row: Rec) =>
  `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map((c) => value(row[c])).join(', ')});`

const contentSql = ['-- Generado por frontend/seed-tools/export-seed.ts. No editar a mano.']
for (const ova of tables.ovas as Rec[]) {
  const body = [
    insert('ovas', ['id', 'title', 'description', 'learning_outcome', 'status', 'created_by', 'created_at'], ova),
    ...(tables.content_blocks as Rec[])
      .filter((b) => b.ova_id === ova.id)
      .map((b) => insert('content_blocks', ['id', 'ova_id', 'type', 'position', 'content'], b)),
    ...(tables.ova_activities as Rec[])
      .filter((a) => a.ova_id === ova.id)
      .map((a) => insert('activities', ['id', 'ova_id', 'title', 'description', 'is_ai'], a)),
    insert('ova_versions', ['id', 'ova_id', 'version_number', 'change_notes', 'created_at'], {
      id: String(ova.id).replace(/^6f1c2a3e/, '7a2d3b4f'),
      ova_id: ova.id,
      version_number: 1,
      change_notes: 'Versión inicial',
      created_at: ova.created_at,
    }),
  ]
  contentSql.push(`DO $seed$ BEGIN\nIF NOT EXISTS (SELECT 1 FROM ovas WHERE id = ${sql(String(ova.id))}) THEN\n${body.join('\n')}\nEND IF;\nEND $seed$;`)
}
const contentPath = resolve(root, 'deploy/local/seed/content_ovas.sql')
writeFileSync(contentPath, contentSql.join('\n') + '\n')

const activityRows = (tables.activities as Rec[]).map(
  (a) =>
    `  (${[a.id, a.ova_id, a.type, a.title, a.description].map(value).join(', ')}, ${sql(JSON.stringify(a.config))}::jsonb, ${value(a.created_at)})`,
)
const activityPath = resolve(root, 'deploy/local/seed/activity_activities.sql')
writeFileSync(
  activityPath,
  [
    '-- Generado por frontend/seed-tools/export-seed.ts. No editar a mano.',
    'INSERT INTO activities (id, ova_id, type, title, description, config, created_at) VALUES',
    activityRows.join(',\n'),
    'ON CONFLICT (id) DO UPDATE SET ova_id = EXCLUDED.ova_id, type = EXCLUDED.type, title = EXCLUDED.title,',
    '  description = EXCLUDED.description, config = EXCLUDED.config;',
    '',
  ].join('\n'),
)

const progressRows = (tables.progress as Rec[]).map(
  (p) => `  (${['id', 'student_id', 'ova_id', 'status', 'percent_complete', 'last_accessed_at'].map((c) => value(p[c])).join(', ')})`,
)
const trackingPath = resolve(root, 'deploy/local/seed/tracking_progress.sql')
writeFileSync(
  trackingPath,
  [
    '-- Generado por frontend/seed-tools/export-seed.ts. No editar a mano.',
    '-- Progreso de ejemplo del grupo; no pisa el avance real de los estudiantes.',
    'INSERT INTO progress (id, student_id, ova_id, status, percent_complete, last_accessed_at) VALUES',
    progressRows.join(',\n'),
    'ON CONFLICT DO NOTHING;',
    '',
  ].join('\n'),
)
console.log(`${(tables.ovas as Rec[]).length} OVA → ${contentPath}`)
console.log(`${activityRows.length} actividades → ${activityPath}`)
console.log(`${progressRows.length} registros de progreso → ${trackingPath}`)
