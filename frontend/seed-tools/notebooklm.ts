// Writes one source document per OVA for NotebookLM (docs/notebooklm). Upload
// it to a notebook and generate a "Video Overview" in Spanish; then upload
// the MP4 with scripts/upload-media.sh (see docs/notebooklm/README.md).
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedTables } from '../src/api/local/seed'
import { COURSE_UNITS } from '../src/content'

const out = join(dirname(fileURLToPath(import.meta.url)), '../../docs/notebooklm')
const ovas = seedTables().ovas as Array<{ id: string; title: string; description: string; learning_outcome: string }>
const slug = (title: string) =>
  title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

mkdirSync(out, { recursive: true })
for (const unit of COURSE_UNITS) {
  const ova = ovas.find((o) => o.id === unit.ovaId)!
  const readings = unit.blocks
    .filter((b) => b.type !== 'video')
    .sort((a, b) => a.position - b.position)
    .map((b) => {
      if (b.type === 'imagen') return `> Diagrama: ${b.content.split('|').slice(1).join('|')}`
      return b.content.replace(/^!\[([^\]]*)\]\([^)]*\)$/gm, '> Diagrama: $1')
    })
  const cases = unit.activities.flatMap((a) =>
    a.type === 'caso_estudio' ? [`### Caso: ${a.title}\n\n${a.config.scenario}`] : [],
  )
  const questions = unit.activities.flatMap((a) =>
    a.type === 'quiz'
      ? a.config.questions.flatMap((q) => (q.explanation ? [`- ${q.prompt.replace(/\*/g, '')} ${q.explanation}`] : []))
      : [],
  )
  const doc = [
    `# ${ova.title} — OVA Hito`,
    '',
    `**Descripción:** ${ova.description}`,
    '',
    `**Resultado de aprendizaje:** ${ova.learning_outcome}`,
    '',
    'Curso de Gestión de Proyectos Informáticos, Universidad de Cartagena. Proyecto conductor: RutaCaribe, plataforma de venta de tiquetes de la Cooperativa de Transportes Brisas del Caribe.',
    '',
    '## Contenido',
    '',
    ...readings.flatMap((r) => [r, '']),
    '## Casos para aplicar',
    '',
    ...cases.flatMap((c) => [c, '']),
    '## Ideas clave',
    '',
    ...questions,
    '',
  ].join('\n')
  writeFileSync(join(out, `${slug(ova.title)}.md`), doc)
}
console.log(`${COURSE_UNITS.length} fuentes en docs/notebooklm`)
