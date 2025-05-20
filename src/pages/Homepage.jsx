import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Homepage.css';
import { Link } from 'react-router-dom';
import { FaUser, FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  const handleGetStarted = () => {
    navigate('/auth/login');
  };

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
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-icons">
          <FaSearch className="icon" />
          <FaBell className="icon" />
          <FaEnvelope className="icon" />
          <FaUser className="icon" onClick={() => navigate('/auth/login')} />
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Welcome to College Companion</h1>
            <p>Your all-in-one solution for college life management</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
            >
              Get Started
            </motion.button>
          </motion.div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <h2>What Students Say</h2>
          <div className="testimonial-grid">
            <motion.div
              className="testimonial-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p>"College Companion has made managing my academic life so much easier!"</p>
              <h4>- Sarah M.</h4>
            </motion.div>
            <motion.div
              className="testimonial-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p>"The study group feature helped me ace my finals!"</p>
              <h4>- John D.</h4>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>College Companion</h3>
            <p>Making college life easier</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@collegecompanion.com</p>
            <p>Phone: (555) 123-4567</p>
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