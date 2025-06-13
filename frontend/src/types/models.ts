import { VulnerabilityState } from './constants';

export interface VulnerabilityData {
  id: number | string;
  title: string;
  description: string;
  criticality: string;
  cwe: string;
  suggestedFix?: string;
  status: VulnerabilityState;
}

export interface FilterKeys {
  status: VulnerabilityState | '';
  criticality: string;
  search: string;
}

export interface FilterState extends FilterKeys {}

export interface VulnerabilityContextState {
  vulnerabilities: VulnerabilityData[];
  filters: FilterState;
}

export type FilterAction = {
  type: 'SET_FILTER';
  payload: { key: keyof FilterKeys; value: string };
} | {
  type: 'CLEAR_FILTERS';
};

export type VulnerabilityAction = 
  | { type: 'SET_VULNERABILITIES'; payload: VulnerabilityData[] }
  | { type: 'ADD_VULNERABILITY'; payload: VulnerabilityData }
  | { type: 'UPDATE_VULNERABILITY'; payload: VulnerabilityData }
  | { type: 'DELETE_VULNERABILITY'; payload: VulnerabilityData }
  | { type: 'UPDATE_STATUS'; payload: { vulnerability: VulnerabilityData; status: VulnerabilityState } }
  | FilterAction;