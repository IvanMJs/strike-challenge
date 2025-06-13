export const STATES = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED'
] as const;

export type VulnerabilityState = typeof STATES[number];