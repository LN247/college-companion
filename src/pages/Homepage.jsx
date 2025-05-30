import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Homepage.css';
import { Link } from 'react-router-dom';
import { FaUser, FaBell, FaEnvelope, FaSearch, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CareerOrientation from '../components/CareerOrientation';
import Dashboard from '../components/Dashboard';
import TestConnection from '../components/TestConnection';
import logo from '../assets/logo.png';

const aboutText = `College Companion is designed to help students streamline their academic and social life by providing essential tools like timetable management, study resources, and collaboration features. Connect, grow, and succeed at ICT University with the ultimate student companion platform.`;

const contactInfo = [
  { label: 'Phone', value: '+237682615642' },
  { label: 'Phone', value: '+237670830282' },
  { label: 'Phone', value: '+237686776246' },
  { label: 'Email', value: 'ictucollegecompanion@gmail.com' },
];

const features = [
  {
    title: 'Semester Management',
    description: 'Plan your semester, track assignments, and manage deadlines efficiently.',
    images: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80'
    ]
  },
  {
    title: 'Link Up and Study with Peers',
    description: 'Connect, collaborate, and grow together with your classmates.',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80'
    ]
  },
  {
    title: 'College Life Tips',
    description: 'Get practical advice and tips for thriving in college life.',
    images: [
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
    ]
  },
  {
    title: 'Career Test',
    description: 'Take a career test and get personalized specialty and course suggestions.',
    images: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
    ]
  }
];

const Homepage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [dropdown, setDropdown] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDropdown = (menu) => {
    setDropdown(dropdown === menu ? '' : menu);
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
        <div className="logo">
          <img src={logo} alt="College Companion Logo" style={{ height: '40px', marginRight: '10px' }} />
        </div>
        <div className="nav-links nav-dropdowns">
          <div className="nav-dropdown">
            <button className="nav-dropbtn" onClick={() => handleDropdown('home')}>Home <FaChevronDown /></button>
            {dropdown === 'home' && (
              <div className="nav-dropdown-content">
                <button onClick={() => setActiveSection('overview')}>Overview</button>
                <button onClick={() => setActiveSection('courses')}>Courses</button>
                <button onClick={() => setActiveSection('academic')}>Academics</button>
              </div>
            )}
          </div>
          <div className="nav-dropdown">
            <button className="nav-dropbtn" onClick={() => handleDropdown('features')}>Features <FaChevronDown /></button>
            {dropdown === 'features' && (
              <div className="nav-dropdown-content">
                {features.map((feature, idx) => (
                  <div key={idx} className="feature-dropdown-item">
                    <strong>{feature.title}</strong>
                    <div>{feature.description}</div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                      {feature.images.map((img, i) => (
                        <img key={i} src={img} alt={feature.title} style={{ width: '60px', borderRadius: '6px', border: '2px solid #F68712' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="nav-dropdown">
            <button className="nav-dropbtn" onClick={() => handleDropdown('about')}>About <FaChevronDown /></button>
            {dropdown === 'about' && (
              <div className="nav-dropdown-content">
                <div style={{ maxWidth: 300, padding: '0.5rem' }}>{aboutText}</div>
              </div>
            )}
          </div>
          <div className="nav-dropdown">
            <button className="nav-dropbtn" onClick={() => handleDropdown('contact')}>Contact <FaChevronDown /></button>
            {dropdown === 'contact' && (
              <div className="nav-dropdown-content">
                {contactInfo.map((info, idx) => (
                  <div key={idx} style={{ marginBottom: 6 }}>
                    <strong>{info.label}:</strong> {info.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="nav-icons">
          <FaSearch className="icon" color="#F68712" />
          <FaBell className="icon" color="#F68712" />
          <FaEnvelope className="icon" color="#F68712" />
          <FaUser className="icon" color="#F68712" onClick={() => navigate('/login')} />
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <section className="homepage-hero">
          <h1 className="hero-title">Your Ultimate College Companion</h1>
          <p className="hero-desc">Organize your academic life, connect with peers, and unlock your full potential at ICT University. All your college essentials, in one place.</p>
          <div className="hero-cta">
            <button className="cta-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="cta-btn cta-signup" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </section>
        {/* Dropdown-controlled sections */}
        {activeSection === 'overview' && <Dashboard activeSection="overview" />}
        {activeSection === 'courses' && <Dashboard activeSection="courses" />}
        {activeSection === 'academic' && <Dashboard activeSection="academic" />}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>College Companion</h3>
            <p>Empowering your college journey</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <button onClick={() => handleDropdown('home')}>Home</button>
            <button onClick={() => handleDropdown('features')}>Features</button>
            <button onClick={() => handleDropdown('about')}>About</button>
            <button onClick={() => handleDropdown('contact')}>Contact</button>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: ictucollegecompanion@gmail.com</p>
            <p>Phone: +237682615642</p>
            <p>Phone: +237670830282</p>
            <p>Phone: +237686776246</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 College Companion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage; 