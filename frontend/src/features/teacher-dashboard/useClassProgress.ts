import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { contentApi } from '../../api/content'
import { trackingApi } from '../../api/tracking'
import type { OVA, Progress, User } from '../../types/domain'

export const GROUP_ID = 'gpi-2026-2'

export interface StudentRow {
  student: User
  byOva: Map<string, Progress>
  average: number
  lastAccess: string | null
}

/** UC-13: progress of every student of the group, per OVA. */
export function useClassProgress() {
  const students = useQuery({ queryKey: ['users', 'estudiante'], queryFn: () => authApi.listUsers('estudiante') })
  const ovas = useQuery({
    queryKey: ['ovas'],
    queryFn: contentApi.list,
    select: (rows: OVA[]) => rows.filter((o) => o.status === 'publicado').sort((a, b) => a.created_at.localeCompare(b.created_at)),
  })
  const report = useQuery({ queryKey: ['usage-report', GROUP_ID], queryFn: () => trackingApi.usageReport(GROUP_ID) })

  const progress = useQueries({
    queries: (students.data ?? []).map((student) => ({
      queryKey: ['progress', student.id],
      queryFn: () => trackingApi.progress(student.id),
    })),
  })

  const rows = useMemo<StudentRow[]>(() => {
    if (!students.data || !ovas.data) return []
    return students.data.map((student, index) => {
      const items = progress[index]?.data ?? []
      const byOva = new Map(items.map((item) => [item.ova_id, item]))
      const average = Math.round(
        ovas.data.reduce((sum, ova) => sum + (byOva.get(ova.id)?.percent_complete ?? 0), 0) / Math.max(ovas.data.length, 1),
      )
      const lastAccess = items.map((item) => item.last_accessed_at).sort().at(-1) ?? null
      return { student, byOva, average, lastAccess }
    })
  }, [students.data, ovas.data, progress])

  return {
    rows,
    ovas: ovas.data ?? [],
    report: report.data,
    isLoading: students.isPending || ovas.isPending || progress.some((query) => query.isPending),
    error: students.error ?? ovas.error ?? report.error,
    refetch: () => {
      students.refetch()
      ovas.refetch()
      report.refetch()
    },
  }
}

/** UC-14: usage report as CSV (RF-18). */
export function toCSV(rows: StudentRow[], ovas: OVA[]): string {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
  const header = ['Estudiante', 'Correo', ...ovas.map((ova) => `${ova.title} (%)`), 'Promedio (%)', 'Último acceso']
  const lines = rows.map((row) => [
    row.student.full_name,
    row.student.email,
    ...ovas.map((ova) => row.byOva.get(ova.id)?.percent_complete ?? 0),
    row.average,
    row.lastAccess ?? '',
  ])
  return '﻿' + [header, ...lines].map((line) => line.map(escape).join(';')).join('\r\n')
}
