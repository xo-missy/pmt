import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '/_/backend');
import './Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const mostViewedProject =
    projects.length > 0
      ? projects.reduce((max, p) => (p.views || 0) > (max.views || 0) ? p : max, projects[0])
      : null;

  const recentActivity = projects.slice(0, 5).map((project, index) => ({
    id: project.id,
    action: `Added project: ${project.title}`,
    timestamp: `${index + 1} days ago`,
  }));

  const stats = [
    { label: 'Total Projects', value: totalProjects, color: 'var(--primary)' },
    { label: 'Featured Projects', value: featuredProjects, color: '#FFD700' },
    { label: 'Most Viewed Project', value: mostViewedProject?.views || 0, color: 'var(--accent)' },
    { label: 'Recent Activities', value: recentActivity.length, color: '#00D4FF' },
  ];

  return (
    <section className="dashboard">
      <div>
        <h1 className="section-title">Dashboard</h1>
      </div>

      <div className="dashboard-stat-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-card">
            <div className="dashboard-card-top">
              <div>
                <p>{stat.label}</p>
                <h3 className={`stat-value stat-${index}`}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostViewedProject && (
        <div className="dashboard-highlight">
          <h2>Most Viewed Project</h2>
          <div className="dashboard-highlight-content">
            {mostViewedProject.image && (
              <img src={mostViewedProject.image} alt={mostViewedProject.title} />
            )}
            <div className="dashboard-highlight-text">
              <h3>{mostViewedProject.title}</h3>
              <p>{mostViewedProject.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-activity">
        <h2>Recent Activity</h2>
        <div className="dashboard-activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="dashboard-activity-item">
                <p>{activity.action}</p>
                <p className="timestamp">{activity.timestamp}</p>
              </div>
            ))
          ) : (
            <p className="dashboard-empty-state">No recent activity yet</p>
          )}
        </div>
      </div>
    </section>
  );
}
