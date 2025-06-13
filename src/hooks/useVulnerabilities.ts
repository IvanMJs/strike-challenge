import { useCallback } from 'react';
import { useVulnerabilityContext } from '../context/VulnerabilityContext.js';
import { fetchVulnerabilities, createVulnerability, updateVulnerability, deleteVulnerability, VulnerabilityData } from '../services/vulnerabilityService.js';
import { setVulnerabilities, setLoading, setError, addVulnerability, updateVulnerability as updateVulnerabilityAction, deleteVulnerability as deleteVulnerabilityAction, setFilters } from '../actions/vulnerabilityActions.js';
import { VulnerabilityRequest, HistoryEntry, Vulnerability } from '../types/models.js';
import { VulnerabilityState } from '../types/constants.js';

const convertHistory = (history: Array<{ from: string; to: string; at: string }> = []): HistoryEntry[] => {
  return history.map(entry => ({
    from: entry.from as VulnerabilityState,
    to: entry.to as VulnerabilityState,
    at: entry.at
  }));
};

const convertToVulnerability = (data: VulnerabilityData): Vulnerability => {
  if (!data.id) throw new Error('Vulnerability must have an ID');
  return {
    ...data,
    id: data.id,
    status: data.status as VulnerabilityState,
    history: convertHistory(data.history),
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date()
  };
};

export const useVulnerabilities = () => {
  const { state, dispatch } = useVulnerabilityContext();

  const loadVulnerabilities = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchVulnerabilities();
      dispatch(setVulnerabilities(data.map(convertToVulnerability)));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addNewVulnerability = useCallback(async (vulnerability: VulnerabilityRequest) => {
    dispatch(setLoading(true));
    try {
      const data = await createVulnerability({
        ...vulnerability,
        title: vulnerability.title || '',
        status: vulnerability.status || 'Pending Fix',
        history: []
      });
      dispatch(addVulnerability(convertToVulnerability(data)));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateExistingVulnerability = useCallback(async (id: string, vulnerability: VulnerabilityRequest) => {
    dispatch(setLoading(true));
    try {
      const data = await updateVulnerability(id, vulnerability);
      dispatch(updateVulnerabilityAction(convertToVulnerability(data)));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const removeVulnerability = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      await deleteVulnerability(id);
      dispatch(deleteVulnerabilityAction(id));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<{
    status: string;
    criticality: string;
    search: string;
  }>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  return {
    vulnerabilities: state.filteredVulnerabilities,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    loadVulnerabilities,
    addNewVulnerability,
    updateExistingVulnerability,
    removeVulnerability,
    updateFilters
  };
};
