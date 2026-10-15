// Writes the course content owned by other services into their seed files:
//   - ai-service/seed/ai_activities.json        (prompt templates)
//   - deploy/local/seed/evaluation_ovas.sql      (evaluations and answer keys)
// Run with: pnpm seed:export

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { COURSE_UNITS } from '../src/content'
import { AI_TEMPLATES } from './ai-templates'

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
