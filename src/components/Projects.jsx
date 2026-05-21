import React, { useMemo, useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to fetch');
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const defaultCats = ['Analytics', 'Games', 'Dev Ops'];
    const setCats = new Set(projects.map((p) => p.category).filter(Boolean));
    // ensure defaults appear first, then the remaining project categories (no duplicates)
    defaultCats.forEach((c) => setCats.delete(c));
    const combined = ['All', ...defaultCats, ...Array.from(setCats)];
    return combined;
  }, [projects]);

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="projects-page">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 && projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects here yet — check back soon.</h2>
          <Link to="/admin" className="empty-state-link">→ Add your projects</Link>
        </div>
      ) : (
        <>
          <div className="controls-bar">
            <div className="search-box input-with-icon">
              <FaSearch className="input-icon" />
              <input
                type="text"
                placeholder="Search projects, tags, or tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card glass">
                <div className="card-image">
                  {project.image && <img src={project.image} alt={project.title} />}
                  <div className="card-actions-overlay">
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-primary icon-btn external-link" title="View live">
                        <FaExternalLinkAlt size={18} />
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-top">
                    <span className="card-category">{project.category}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.description}</p>
                  <div className="card-tags">
                    {project.tags?.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
