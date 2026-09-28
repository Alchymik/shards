export type ISODate = `${number}-${number}-${number}` & {
  readonly __brand: 'ISODate'
} // 'YYYY-MM-DD'
export type ISODateTime = `${ISODate}T${string}` & {
  readonly __brand: 'ISODateTime'
} // ISO 8601 timestamp

export const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
] as const
export type Weekday = (typeof weekdays)[number]
