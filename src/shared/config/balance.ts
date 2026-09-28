export const balance = {
  windowDays: 7, // скользящее окно вектора
  scaleMax: 120, // максимум значения вектора
  routinePool: 100, // пул рутинного вклада в daily_score
  goalProgressBonus: 10, // бонус за продвижение одной цели
  goalProgressBonusCap: 20 // кап суммарного бонуса в день
} as const

export const defaultVectors = [
  { title: 'Здоровье', emoji: '🖤' },
  { title: 'Карьера', emoji: '💵' },
  { title: 'Проекты', emoji: '⚡' }
] as const
