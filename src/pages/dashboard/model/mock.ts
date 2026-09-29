import type { CheckIn } from '@/entities/check-in'
import type { Goal } from '@/entities/goal'
import type { Step } from '@/entities/step'
import type { Vector } from '@/entities/vector'
import type { ISODate, ISODateTime } from '@/shared/lib/dates'
import { asCheckInId, asGoalId, asStepId, asVectorId } from '@/shared/lib/ids'

const today = '2026-09-28' as ISODate // Хардкод для воспроизводимости среза, ирл заменится на getToday() из shared/lib/dates
// Касты `as ISODate` / `as ISODateTime` безопасны: значения заданы нами, а не приходят извне. Внешние данные валидируются через Zod (когда появится).

export const vectors: Vector[] = [
  {
    id: asVectorId('vector1'),
    createdAt: '2026-09-01T10:00:00.000Z' as ISODateTime,
    title: 'Проекты',
    emoji: '⚡'
  }
]

export const goals: Goal[] = [
  {
    id: asGoalId('goal1'),
    vectorId: asVectorId('vector1'),
    priority: 1,
    title: 'Написать 20 битов',
    measure: 'битов',
    current: 2,
    target: 20,
    achievedAt: null
  },
  {
    id: asGoalId('goal2'),
    vectorId: asVectorId('vector1'),
    priority: 2,
    title: 'Учить программирование 10 дней',
    measure: 'дн',
    current: 2,
    target: 10,
    achievedAt: null
  }
]

export const steps: Step[] = [
  {
    id: asStepId('step1'),
    title: 'Писать бит 2 часа',
    goalId: asGoalId('goal1'),
    schedule: { kind: 'daily' },
    createdAt: '2026-09-01T10:00:00.000Z' as ISODateTime
  },
  {
    id: asStepId('step2'),
    title: 'Сделать темплейт проекта для битов',
    goalId: asGoalId('goal1'),
    schedule: { kind: 'once', onDate: today },
    createdAt: '2026-09-25T10:00:00.000Z' as ISODateTime
  },
  {
    id: asStepId('step3'),
    title: 'Учить программирование 1 час',
    goalId: asGoalId('goal2'),
    schedule: {
      kind: 'weekly',
      daysOfWeek: ['tuesday', 'thursday', 'saturday']
    },
    createdAt: '2026-09-01T10:00:00.000Z' as ISODateTime
  }
]

export const checkIns: CheckIn[] = [
  {
    id: asCheckInId('checkin1'),
    stepId: asStepId('step1'),
    note: 'готов припев и интро',
    date: '2026-09-27' as ISODate,
    progressAfter: null
  },
  {
    id: asCheckInId('checkin2'),
    stepId: asStepId('step3'),
    note: 'выучил основы RTK Query',
    date: '2026-09-26' as ISODate,
    progressAfter: 2
  }
]
