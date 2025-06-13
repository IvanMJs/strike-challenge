import React from "react";
import "./App.scss";
import { VulnerabilityProvider } from './context/VulnerabilityContext';
import { VulnerabilityView } from './views/VulnerabilityView';

function App() {
  return (
    <VulnerabilityProvider>
      <div className="app container">
        <h1>Vulnerability Management</h1>
        <VulnerabilityView />
      </div>
    </VulnerabilityProvider>
  );
}

export default App;
