export const STATES = ['Pending Fix', 'In Progress', 'Under Review', 'Solved', 'False Positive', 'Duplicate'] as const;
export type VulnerabilityState = typeof STATES[number];
