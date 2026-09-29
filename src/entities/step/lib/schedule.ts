import { getDay, differenceInCalendarDays, parseISO } from 'date-fns'
import { type Weekday, type ISODate, weekdays } from '@/shared/lib/dates'
import type { Step } from '../model/types'

export const weekdayFromDate = (date: ISODate): Weekday =>
  weekdays[getDay(parseISO(date)) as 0 | 1 | 2 | 3 | 4 | 5 | 6]

export const isStepScheduledFor = (step: Step, date: ISODate): boolean => {
  switch (step.schedule.kind) {
    case 'weekly': {
      return step.schedule.daysOfWeek.includes(weekdayFromDate(date))
    }
    case 'everyNDays': {
      const dif = differenceInCalendarDays(
        parseISO(date),
        parseISO(step.createdAt)
      )
      return dif >= 0 && dif % step.schedule.n === 0
    }
    case 'once': {
      return step.schedule.onDate === date
    }
    case 'daily': {
      return true
    }
  }
}
