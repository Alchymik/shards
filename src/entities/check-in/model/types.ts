import type { ISODate } from '@/shared/lib/dates'
import type { CheckInId, StepId } from '@/shared/lib/ids'

//TODO(zod): unique(stepId, date) — проверка на коллекции CheckIn[]
export type CheckIn = {
  id: CheckInId
  stepId: StepId
  note: string | null
  date: ISODate
  progressAfter: number | null // Значение, введённое пользователем в момент отметки. null = прогресс не менялся. Не снимок goal.current.
}
