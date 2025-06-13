export const STATES = ['Pending Fix', 'In Progress', 'Under Review', 'Solved', 'False Positive', 'Duplicate'];
export type VulnerabilityState = typeof STATES[number];