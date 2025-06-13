import { useState, useEffect } from "react";
import { STATES } from "../../utils/constants";
import "./FiltersBar.scss";

interface FiltersBarProps {
  criticalityOptions: string[];
  onFilter: (status: string, criticality: string, search: string) => void;
}

const FiltersBar = ({
  criticalityOptions,
  onFilter
}: FiltersBarProps) => {
  const [status, setStatus] = useState("");
  const [criticality, setCriticality] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    onFilter(status, criticality, searchText);
  }, [status, criticality, searchText, onFilter]);

  const handleClear = () => {
    setStatus("");
    setCriticality("");
    setSearchText("");
  };

  return (
    <div className="filters-bar">
      <select
        className="filters-bar-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Statuses</option>
        {Object.values(STATES).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className="filters-bar-select"
        value={criticality}
        onChange={(e) => setCriticality(e.target.value)}
      >
        <option value="">All Criticality</option>
        {criticalityOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="filters-bar-search"
        placeholder="Search by title, description, or CWE..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {(status || criticality || searchText) && (
        <button className="filters-bar-clear" onClick={handleClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FiltersBar;
