import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '/_/backend');

export default function Signup({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Registration failed. Try a different email.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      
      if (onLogin) {
        onLogin(data.token);
      }
      
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Server error. Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-blob auth-blob-left" />
      <div className="auth-blob auth-blob-right" />

      <div className="auth-card glass">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Register to begin publishing your portfolio.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className="auth-input-wrapper">
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
              <FaEnvelope className="auth-input-icon" />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">PASSWORD</label>
            <div className="auth-input-wrapper">
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <FaLock className="auth-input-icon" />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <div className="auth-input-wrapper">
              <input
                id="confirmPassword"
                type="password"
                className="auth-input"
                placeholder="Min. 6 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <FaLock className="auth-input-icon" />
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
