import React, { useState } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ theme, toggleTheme, token, onLogout }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || '';

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header glass">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={closeMenu}>P-M-T.</Link>
        
        {token && (
          <nav className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={closeMenu}>Dashboard</Link>
            <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`} onClick={closeMenu}>Projects</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMenu}>About</Link>
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={closeMenu}>Admin</Link>
          </nav>
        )}

        <div className="nav-actions">
          <button className="btn btn-outline icon-btn" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Light/Dark Theme">
            {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>

          {token && (
            <>
              <div className="user-badge hide-mobile" title={userEmail}>
                {userEmail.split('@')[0]}
              </div>
              <button className="btn btn-outline logout-btn" onClick={() => { closeMenu(); onLogout(); }} title="Logout">
                <FaSignOutAlt size={16} /> <span className="hide-mobile">Logout</span>
              </button>
              <button className="hamburger" onClick={handleToggle} aria-label="Toggle Menu">
                {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
