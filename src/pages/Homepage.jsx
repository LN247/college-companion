import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: 'Course Management',
      description: 'Organize your courses, track assignments, and manage deadlines efficiently.',
      icon: '📚'
    },
    {
      title: 'Study Groups',
      description: 'Connect with peers, form study groups, and collaborate on projects.',
      icon: '👥'
    },
    {
      title: 'Resource Library',
      description: 'Access a comprehensive collection of study materials and resources.',
      icon: '📖'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your academic progress and set achievable goals.',
      icon: '📊'
    }
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Welcome to College Companion</h2>
      </div>
    );
  }

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">College Companion</div>
        <div className="nav-links">
          <button onClick={() => setActiveSection('overview')}>Overview</button>
          <button onClick={() => setActiveSection('features')}>Features</button>
          <button onClick={() => setActiveSection('about')}>About</button>
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <h1>Your All-in-One College Success Platform</h1>
          <p>Streamline your academic journey with our comprehensive suite of tools and resources</p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <h2>What Students Say</h2>
          <div className="testimonials-slider">
            <div className="testimonial">
              <p>"College Companion has transformed how I manage my academic life. It's intuitive and incredibly helpful!"</p>
              <cite>- Sarah M., Computer Science</cite>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@collegecompanion.com</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 College Companion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage; 