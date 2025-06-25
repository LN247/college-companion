import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">College Companion</h3>
            <p className="footer-description">
              Your all-in-one platform for academic success and personal growth.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-links">
              <li><a href="#semester-planning">Semester Planning</a></li>
              <li><a href="#community">Community & Networking</a></li>
              <li><a href="#daily-tips">Daily Tips & Insights</a></li>
              <li><a href="#career-test">Career Test</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#blog">Blog</a></li>
              <li><a href="#help-center">Help Center</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} College Companion. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#twitter" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#facebook" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
