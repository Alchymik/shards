import type { ISODateTime } from '@/shared/lib/dates'
import type { VectorId } from '@/shared/lib/ids'

export type Vector = {
  id: VectorId
  createdAt: ISODateTime
  title: string
  emoji: string
}
