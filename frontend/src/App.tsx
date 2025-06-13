import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.scss";
import { VulnerabilityProvider } from './context/VulnerabilityContext';
import { AuthProvider } from './context/AuthContext';
import { VulnerabilityView } from './views/VulnerabilityView';
import { LoginForm } from './components/login/LoginForm';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { Header } from './components/header/Header';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <VulnerabilityProvider>
                    <>
                      <Header />
                      <div className="container">
                        <VulnerabilityView />
                      </div>
                    </>
                  </VulnerabilityProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
