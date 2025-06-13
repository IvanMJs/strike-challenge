import { useState, useEffect } from 'react';
import "./App.scss";
import VulnerabilityForm from "./components/vulnerabilityForm/VulnerabilityForm";
import VulnerabilityGrid from "./components/vulnerabilityGrid/VulnerabilityGrid";
import FiltersBar from "./components/filterBar/FiltersBar";
import { VulnerabilityProvider } from "./context/VulnerabilityContext";
import { CRITICALITY_OPTIONS } from "./utils/constants";
import { useVulnerabilities } from "./hooks/useVulnerabilities";
import { Vulnerability } from './types/models';
import { VulnerabilityState } from './types/constants';

interface FormState {
  title: string;
  description: string;
  criticality: string;
  cwe: string;
  suggestedFix: string;
  status: VulnerabilityState;
}

const initialFormState: FormState = {
  title: "",
  description: "",
  criticality: "",
  cwe: "",
  suggestedFix: "",
  status: "Pending Fix"
};

function AppContent() {
  const {
    vulnerabilities,
    loading,
    error,
    loadVulnerabilities,
    addNewVulnerability,
    updateExistingVulnerability,
    removeVulnerability,
    updateFilters
  } = useVulnerabilities();

  const [form, setForm] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<string>();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadVulnerabilities();
  }, [loadVulnerabilities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(undefined);
    setEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExistingVulnerability(editingId, form);
      } else {
        await addNewVulnerability(form);
      }
      resetForm();
      await loadVulnerabilities();
    } catch (error) {
      console.error('Failed to save vulnerability:', error);
      alert(error instanceof Error ? error.message : 'Failed to save vulnerability');
    }
  };

  const handleEdit = (vulnerability: Vulnerability) => {
    setForm({
      title: vulnerability.title,
      description: vulnerability.description || "",
      criticality: vulnerability.criticality || "",
      cwe: vulnerability.cwe || "",
      suggestedFix: vulnerability.suggestedFix || "",
      status: vulnerability.status
    });
    setEditingId(vulnerability.id.toString());
    setEditMode(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await removeVulnerability(id.toString());
      await loadVulnerabilities();
    } catch (error) {
      console.error('Failed to delete vulnerability:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete vulnerability');
    }
  };

  const handleStatusChange = async (id: number, status: VulnerabilityState) => {
    try {
      const vuln = vulnerabilities.find(v => v.id === id);
      if (vuln) {
        await updateExistingVulnerability(id.toString(), { ...vuln, status });
        await loadVulnerabilities();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleFilter = (status: string, criticality: string, search: string) => {
    updateFilters({ status, criticality, search });
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <VulnerabilityForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editing={editMode}
          criticalityOptions={CRITICALITY_OPTIONS}
        />
        <FiltersBar
          criticalityOptions={CRITICALITY_OPTIONS}
          onFilter={handleFilter}
        />
        <VulnerabilityGrid
          vulnerabilities={vulnerabilities}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <VulnerabilityProvider>
      <AppContent />
    </VulnerabilityProvider>
  );
}

export default App;
