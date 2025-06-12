import { useEffect, useState } from "react";
import "./App.scss";
import VulnerabilityForm from "./components/vulnerabilityForm/VulnerabilityForm";
import VulnerabilityGrid from "./components/vulnerabilityGrid/VulnerabilityGrid";
import FiltersBar from "./components/filterBar/FiltersBar";
import {
  fetchVulnerabilities,
  createVulnerability,
  updateVulnerability,
  deleteVulnerability,
} from "./services/vulnerabilityService";
import { STATES, CRITICALITY_OPTIONS } from "./utils/constants";

function App() {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    criticality: "",
    cwe: "",
    suggestedFix: "",
    status: "Pending Fix",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVulnerabilities();
  }, []);

  async function loadVulnerabilities() {
    try {
      setVulnerabilities(await fetchVulnerabilities());
    } catch {
      setError("Failed to fetch vulnerabilities");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateVulnerability(editingId, form);
      } else {
        await createVulnerability(form);
      }
      setForm({
        title: "",
        description: "",
        criticality: "",
        cwe: "",
        suggestedFix: "",
        status: "Pending Fix",
      });
      setEditingId(null);
      loadVulnerabilities();
    } catch {
      setError("Failed to save vulnerability");
    }
  }

  function handleEdit(vuln) {
    setForm({ ...vuln });
    setEditingId(vuln.id);
  }

  async function handleDelete(id) {
    try {
      await deleteVulnerability(id);
      loadVulnerabilities();
    } catch {
      setError("Failed to delete");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateVulnerability(id, { status });
      loadVulnerabilities();
    } catch {
      setError("Failed to update status");
    }
  }

  function handleCancel() {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      criticality: "",
      cwe: "",
      suggestedFix: "",
      status: "Pending Fix",
    });
  }

  const filteredVulnerabilities = vulnerabilities
    .filter((vuln) => {
      const matchesStatus = statusFilter ? vuln.status === statusFilter : true;
      const matchesCriticality = criticalityFilter
        ? vuln.criticality === criticalityFilter
        : true;
      const matchesSearch = search
        ? vuln.title?.toLowerCase().includes(search.toLowerCase()) ||
          vuln.description?.toLowerCase().includes(search.toLowerCase()) ||
          vuln.cwe?.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesCriticality && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(b.updatedAt || b.createdAt);
      const dateB = new Date(a.updatedAt || a.createdAt);
      return dateA - dateB;
    });

  return (
    <div className="container">
      <h1>Vulnerability Manager</h1>
      {error && <div className="error">{error}</div>}
      <VulnerabilityForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingId={editingId}
        onCancel={handleCancel}
      />
      <FiltersBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        criticalityFilter={criticalityFilter}
        setCriticalityFilter={setCriticalityFilter}
        search={search}
        setSearch={setSearch}
        onClear={() => {
          setStatusFilter("");
          setCriticalityFilter("");
          setSearch("");
        }}
      />
      <h2 style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
        Vulnerabilities
      </h2>
      <VulnerabilityGrid
        vulnerabilities={filteredVulnerabilities}
        STATES={STATES}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default App;
