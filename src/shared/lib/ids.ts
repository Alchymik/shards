export type VectorId = string & { readonly __brand: 'VectorId' }
export type GoalId = string & { readonly __brand: 'GoalId' }
export type StepId = string & { readonly __brand: 'StepId' }
export type CheckInId = string & { readonly __brand: 'CheckInId' }

export const generateVectorId = () => crypto.randomUUID() as VectorId
export const generateGoalId = () => crypto.randomUUID() as GoalId
export const generateStepId = () => crypto.randomUUID() as StepId
export const generateCheckInId = () => crypto.randomUUID() as CheckInId
