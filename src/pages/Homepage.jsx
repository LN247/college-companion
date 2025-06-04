import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Homepage.css";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBell,
  FaEnvelope,
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaLightbulb,
  FaVial,
  FaChartBar,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CareerOrientation from "../components/CareerOrientation";
import Dashboard from "../components/Dashboard";
import TestConnection from "../components/TestConnection";
import logo from "../assets/logo.png";

const Homepage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Semester Management",
      description:
        "Plan your semester, track assignments, and manage deadlines efficiently.",
      icon: <FaCalendarAlt color="#F68712" />,
      images: [
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      title: "Link Up and Study with Peers",
      description:
        "Connect, collaborate, and grow together with your classmates.",
      icon: <FaUsers color="#F68712" />,
      images: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      title: "College Life Tips",
      description:
        "Get practical advice and tips for thriving in college life.",
      icon: <FaLightbulb color="#F68712" />,
      images: [
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      ],
    },
    {
      title: "Career Test",
      description:
        "Take a career test and get personalized specialty and course suggestions.",
      icon: <FaVial color="#F68712" />,
      images: [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
      ],
    },
  ];

  const handleGetStarted = () => {
    navigate("/login");
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
        <div className="logo-1">
          <img src={logo} className="logo" alt="College Companion Logo" />
        </div>
        <div className="dashboard-menu">
          <div
            className={`dashboard-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            <FaChartBar className="dashboard-icon" />
            <span>Overview</span>
          </div>
          <div
            className={`dashboard-item ${
              activeSection === "courses" ? "active" : ""
            }`}
            onClick={() => setActiveSection("courses")}
          >
            <FaBook className="dashboard-icon" />
            <span>Courses</span>
          </div>
          <div
            className={`dashboard-item ${
              activeSection === "academic" ? "active" : ""
            }`}
            onClick={() => setActiveSection("academic")}
          >
            <FaGraduationCap className="dashboard-icon" />
            <span>Academic</span>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-icons">
          <FaSearch className="icon" color="#F68712" />
          <FaBell className="icon" color="#F68712" />
          <FaEnvelope className="icon" color="#F68712" />
          <FaUser
            className="icon"
            color="#F68712"
            onClick={() => navigate("/login")}
          />
        </div>
      </nav>

      <main className="main-content">
        {activeSection === "overview" ? (
          <Dashboard activeSection={activeSection} />
        ) : (
          <>
            <section className="hero-section">
              <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1>Empowering Your College Journey</h1>
                <p>
                  Connect, grow, and succeed at ICT University with the ultimate
                  student companion platform.
                </p>
                <div className="cta-buttons">
                  <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    className="cta-button signup"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </motion.div>
            </section>

            <section className="career-orientation-section">
              <CareerOrientation />
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
                    {feature.images && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "1rem",
                          justifyContent: "center",
                        }}
                      >
                        {feature.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="College Life"
                            style={{
                              width: "80px",
                              borderRadius: "8px",
                              border: "2px solid #F68712",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="test-connection-section">
              <TestConnection />
            </section>

            <section className="testimonials-section">
              <h2>College Life</h2>
              <div className="testimonial-grid">
                <motion.div
                  className="testimonial-card"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p>
                    "The campus life here is amazing! From study groups to
                    social events, there's always something exciting happening."
                  </p>
                  <h4>- Sarah, Computer Science</h4>
                </motion.div>
                <motion.div
                  className="testimonial-card"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p>
                    "The library is my second home! Great study spaces and
                    resources for every student."
                  </p>
                  <h4>- Michael, Business</h4>
                </motion.div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>College Companion</h3>
            <p>Empowering your college journey</p>
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
