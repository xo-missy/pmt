import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  
  return (
    <header className="header glass">
      <div className="container">
        <Link to="/" className="logo">P-M-T.</Link>
        
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>Projects</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link>
        </nav>

        <div className="nav-actions">
          <button className="btn btn-outline icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
