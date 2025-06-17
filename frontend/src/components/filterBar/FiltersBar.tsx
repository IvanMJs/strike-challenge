import React from "react";
import { STATES, CRITICALITY_OPTIONS } from "../../utils/constants";
import "./FiltersBar.scss";
import { useVulnerabilities } from "../../context/VulnerabilityContext";
import { VulnerabilityState } from "../../types/constants";

export default function FiltersBar() {
  const { filters, dispatch, filteredVulnerabilities, vulnerabilities } = useVulnerabilities();

  const handleFilterChange = (key: 'status' | 'criticality' | 'search', value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    handleFilterChange('search', searchTerm);
  };

  return (
    <div className="filters-bar">
      <div className="filters-bar-info">
        Showing {filteredVulnerabilities.length} of {vulnerabilities.length} vulnerabilities
      </div>
      <div className="filters-bar-controls">
        <input
          type="text"
          placeholder="Search vulnerabilities..."
          value={filters.search}
          onChange={handleSearchChange}
          className="filters-bar-search"
          aria-label="Search vulnerabilities"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value as VulnerabilityState | '')}
          className="filters-bar-select"
          aria-label="Filter by status"
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
          aria-label="Filter by criticality"
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
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
