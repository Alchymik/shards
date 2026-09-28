import type { ISODateTime } from '@/shared/lib/dates'
import type { GoalId, VectorId } from '@/shared/lib/ids'

export type Goal = {
  id: GoalId
  vectorId: VectorId
  priority: number //TODO(zod): int ≥ 1 + непрерывность 1..N на уровне вектора
  title: string
  measure: string
  current: number
  target: number
  achievedAt: ISODateTime | null
}
