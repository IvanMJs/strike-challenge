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
          <div className="video-background">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="background-video"
            >
              <source
                src="https://cdn.prod.website-files.com/661f1186a2fe0a147b01a1c0%2F67c99ea88ee0cf38f4011a6c_Hero%20Blue%20Video%20%281%29-transcode.webm"
                type="video/webm"
              />
            </video>
          </div>
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
