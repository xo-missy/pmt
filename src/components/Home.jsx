import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-blob hero-blob-left" />
      <div className="hero-blob hero-blob-right" />

      <h1>
        Curated Digital <br />
        <span className="accent-text">Experiences</span>
      </h1>
      <p>
        A premium showcase of innovative projects across design, development, and brand strategy.
      </p>
      <div className="hero-cta">
        <Link to="/projects" className="btn btn-primary btn-hero">
          Explore Now
        </Link>
      </div>
    </section>
  );
}
