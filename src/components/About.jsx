import React from 'react';
import { FaHeart, FaCode, FaBolt } from 'react-icons/fa';
import './About.css';

export default function About() {
  const features = [
    {
      icon: FaCode,
      title: 'Showcase Your Work',
      description:
        'Display your best projects with detailed descriptions, technologies used, and visual assets.',
    },
    {
      icon: FaBolt,
      title: 'Modern Design',
      description:
        'Built with cutting-edge technologies including React and responsive CSS.',
    },
    {
      icon: FaHeart,
      title: 'User-Focused',
      description:
        'Designed to create an engaging experience for visitors exploring your portfolio.',
    },
  ];

  return (
    <section className="about">
      <div>
        <h1 className="section-title">About Portfolio Management Tool</h1>

        <div className="about-content">
          <div className="about-card">
            <p>
              Welcome to the Portfolio Management Tool – a modern, elegant platform designed to showcase your professional work and projects. This application combines sleek design with powerful functionality to help you present your portfolio in the best possible light.
            </p>
            <p>
              Whether you're a developer, designer, or creative professional, this portfolio tool provides an intuitive interface to manage, organize, and display your projects to potential clients and employers.
            </p>
            <p>
              Built with modern web technologies and a focus on user experience, this platform ensures your work is presented beautifully across all devices.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <Icon size={32} className="feature-icon" />
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
