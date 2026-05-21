import React, { useState, useEffect } from 'react';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '/_/backend');
const CATEGORIES = ['Web App', 'Mobile', 'Design', 'Analytics', 'Games', 'Dev Ops', 'Other'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web App',
    tags: [],
    image: '',
    url: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const endpoint = authMode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Authentication failed');
      localStorage.setItem('token', data.token);
      setEmail('');
      setPassword('');
      setIsAuthenticated(true);
      await fetchProjects();
    } catch (err) {
      setAuthError(err.message || 'Authentication error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setProjects([]);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch');
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const openNewProject = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', category: 'Web App', tags: [], image: '', url: '' });
    setIsModalOpen(true);
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setIsModalOpen(true);
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete project?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/projects/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Delete failed');
        await fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveProject = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags:
          typeof formData.tags === 'string'
            ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : formData.tags,
        image: formData.image,
        url: formData.url,
      };
      const token = localStorage.getItem('token');
      if (editingProject) {
        const id = editingProject._id || editingProject.id;
        const res = await fetch(`${API_URL}/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Update failed');
      } else {
        const res = await fetch(`${API_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Create failed');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      await fetchProjects();
    } catch (error) {
      alert('Error saving project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="admin-login">
        <div className="login-card">
          <h1>{authMode === 'signup' ? 'Sign Up' : 'Login'}</h1>
          <p>{authMode === 'signup' ? 'Create an account to manage projects.' : 'Log in to manage projects.'}</p>
          <form onSubmit={handleAuth}>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
            </label>
            {authError && <p className="error-message">{authError}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button type="submit" className="btn btn-primary">{authMode === 'signup' ? 'Sign Up' : 'Login'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setAuthError(''); }}>
                {authMode === 'signup' ? 'Have an account? Log in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-simple">
      <div className="admin-panel-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage your projects via MongoDB.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewProject} disabled={loading}>Add Project</button>
          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-summary">
        <strong>Total projects:</strong> {projects.length}
      </div>

      {loading && <p className="loading-text">Loading...</p>}

      <div className="project-list">
        {projects.map((project) => {
          const projectId = project._id || project.id;
          return (
            <div key={projectId} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span>{project.category}</span>
                <span>{project.tags?.join(', ')}</span>
              </div>
              <div className="project-actions">
                <button className="btn btn-primary" onClick={() => openEditProject(project)} disabled={loading}>Edit</button>
                <button className="btn btn-primary" onClick={() => deleteProject(projectId)} disabled={loading}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={saveProject}>
              <label>Title<input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required disabled={loading} /></label>
              <label>
                Category
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} disabled={loading}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>Tags (comma separated)<input value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} disabled={loading} /></label>
              <label>Image URL<input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required disabled={loading} /></label>
              <label>Live URL<input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} disabled={loading} /></label>
              <label>Description<textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required disabled={loading} /></label>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
