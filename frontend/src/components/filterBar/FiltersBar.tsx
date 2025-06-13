import React from "react";
import { STATES, CRITICALITY_OPTIONS } from "../../utils/constants";
import "./FiltersBar.scss";
import { useVulnerabilities } from "../../context/VulnerabilityContext";
import { VulnerabilityState } from "../../types/constants";

export default function FiltersBar() {
  const { filters, dispatch } = useVulnerabilities();

  const handleFilterChange = (key: 'status' | 'criticality' | 'search', value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Search by title, description, or CWE..."
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        className="filters-bar-search"
      />
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value as VulnerabilityState | '')}
        className="filters-bar-select"
      >
        <option value="">All Statuses</option>
        {Object.values(STATES).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={filters.criticality}
        onChange={(e) => handleFilterChange('criticality', e.target.value)}
        className="filters-bar-select"
      >
        <option value="">All Criticality</option>
        {CRITICALITY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {(filters.status || filters.criticality || filters.search) && (
        <button
          className="filters-bar-clear"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
