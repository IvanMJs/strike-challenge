import React from "react";
import { STATES, CRITICALITY_OPTIONS } from "../../utils/constants";
import "./FiltersBar.scss";

interface FiltersBarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  criticalityFilter: string;
  setCriticalityFilter: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  onClear: () => void;
}

export default function FiltersBar({
  statusFilter,
  setStatusFilter,
  criticalityFilter,
  setCriticalityFilter,
  search,
  setSearch,
  onClear,
}: FiltersBarProps) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Search by title, description, or CWE..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="filters-bar-search"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="filters-bar-select"
      >
        <option value="">All Statuses</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={criticalityFilter}
        onChange={(e) => setCriticalityFilter(e.target.value)}
        className="filters-bar-select"
      >
        <option value="">All Criticality</option>
        {CRITICALITY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {(statusFilter || criticalityFilter || search) && (
        <button className="filters-bar-clear" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}
