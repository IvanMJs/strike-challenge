import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.scss';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-content">
          <h1>Vulnerability Management</h1>

          {user && (
            <>
              {/* Hamburger menu for mobile */}
              <button className="menu-toggle" onClick={toggleMenu}>
                <span className="hamburger"></span>
              </button>

              {/* User info and navigation */}
              <div className={`user-info ${isMenuOpen ? 'active' : ''}`}>
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
