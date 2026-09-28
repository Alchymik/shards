// Step, StepId, Schedule (discriminated union)
import type { ISODate, Weekday } from '@/shared/lib/dates'
import type { StepId, GoalId } from '@/shared/lib/ids'

export type Schedule =
  | { kind: 'daily' }
  | { kind: 'weekly'; daysOfWeek: Weekday[] }
  | { kind: 'everyNDays'; n: number } //TODO zod(n >= 2)
  | { kind: 'once'; onDate: ISODate }

export type Step = {
  id: StepId
  title: string
  goalId: GoalId
  schedule: Schedule
}
