import React, { useState, useEffect } from 'react';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : 'https://pmt-o5k7.onrender.com');
const CATEGORIES = ['Web App', 'Mobile', 'Design', 'Analytics', 'Games', 'Dev Ops', 'Other'];

const CATEGORY_CONFIGS = {
  'Web App': {
    urlLabel: 'Live Website URL',
    urlRequired: true,
    placeholder: 'e.g. https://myportfolio.com',
    defaultImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  'Mobile': {
    urlLabel: 'App Store / Play Store URL',
    urlRequired: false,
    placeholder: 'e.g. https://play.google.com/store/apps/... (optional)',
    defaultImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
  },
  'Design': {
    urlLabel: 'Figma / Behance / Dribbble URL',
    urlRequired: false,
    placeholder: 'e.g. https://figma.com/file/... (optional)',
    defaultImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80',
  },
  'Analytics': {
    urlLabel: 'Dashboard or Report URL',
    urlRequired: false,
    placeholder: 'e.g. https://public.tableau.com/... (optional)',
    defaultImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  'Games': {
    urlLabel: 'Playable Game URL',
    urlRequired: true,
    placeholder: 'e.g. https://itch.io/games/...',
    defaultImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
  },
  'Dev Ops': {
    urlLabel: 'Repository / Deployment URL',
    urlRequired: false,
    placeholder: 'e.g. https://github.com/... (optional)',
    defaultImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=80',
  },
  'Other': {
    urlLabel: 'Project Link',
    urlRequired: false,
    placeholder: 'e.g. https://github.com/... (optional)',
    defaultImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  },
};

export default function Admin() {
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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

      let formattedUrl = formData.url ? formData.url.trim() : '';
      if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const config = CATEGORY_CONFIGS[formData.category] || CATEGORY_CONFIGS['Other'];
      let finalImageUrl = '';
      if (formattedUrl) {
        finalImageUrl = `https://image.thum.io/get/width/1280/crop/800/${formattedUrl}`;
      } else {
        finalImageUrl = config.defaultImage;
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags:
          typeof formData.tags === 'string'
            ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : formData.tags,
        image: finalImageUrl,
        url: formattedUrl,
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

  const currentConfig = CATEGORY_CONFIGS[formData.category] || CATEGORY_CONFIGS['Other'];

  return (
    <section className="admin-simple">
      <div className="admin-panel-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage your projects via MongoDB.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openNewProject} disabled={loading}>Add Project</button>
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
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Portfolio Management Tool"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={loading}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags (comma separated)</label>
                  <input
                    id="tags"
                    type="text"
                    placeholder="e.g. React, Express, MongoDB"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="url">
                  {currentConfig.urlLabel}
                  {currentConfig.urlRequired && <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>*</span>}
                </label>
                <input
                  id="url"
                  type="text"
                  placeholder={currentConfig.placeholder}
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required={currentConfig.urlRequired}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Detailed description of the project, features, and challenges..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
