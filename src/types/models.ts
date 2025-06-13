import { VulnerabilityState } from './constants.js';

export interface HistoryEntry {
  from: VulnerabilityState;
  to: VulnerabilityState;
  at: string;
}

export interface Vulnerability {
  id: number;
  title: string;
  description?: string;
  criticality?: string;
  cwe?: string;
  suggestedFix?: string;
  status: VulnerabilityState;
  history: HistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VulnerabilityRequest {
  title?: string;
  description?: string;
  criticality?: string;
  cwe?: string;
  suggestedFix?: string;
  status?: VulnerabilityState;
}
