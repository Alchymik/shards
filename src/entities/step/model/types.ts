// Step, StepId, Schedule (discriminated union)
import type { ISODate, ISODateTime, Weekday } from '@/shared/lib/dates'
import type { StepId, GoalId } from '@/shared/lib/ids'

export type Schedule =
  | { kind: 'daily' }
  | { kind: 'weekly'; daysOfWeek: Weekday[] }
  | { kind: 'everyNDays'; n: number } //TODO zod(n >= 2)
  | { kind: 'once'; onDate: ISODate }

export type Step = {
  id: StepId
  goalId: GoalId
  title: string
  schedule: Schedule
  createdAt: ISODateTime
}
