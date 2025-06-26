import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <div className="footer-company-info">
              <h3 className="footer-company-title">CollegeCompanion</h3>
              <p className="footer-company-desc">
                Empowering students worldwide to achieve academic excellence
                through intelligent planning, community support, and
                personalized guidance.
              </p>
            </div>
            <div className="footer-social">
              <a href="#" className="footer-social-btn">
                <Facebook className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-btn">
                <Twitter className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-btn">
                <Instagram className="footer-social-icon" />
              </a>
              <a href="#" className="footer-social-btn">
                <Linkedin className="footer-social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Quick Links</h4>
            <ul className="footer-link-list">
              {[
                "About Us",
                "Features",
                "Pricing",
                "Testimonials",
                "Blog",
                "Career",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="footer-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h4 className="footer-links-title">Support</h4>
            <ul className="footer-link-list">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
                "FAQ",
                "Community Guidelines",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="footer-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="footer-contact">
            <h4 className="footer-contact-title">Get in Touch</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span className="footer-contact-text">
                  support@collegecompanion.com
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-contact-text">+1 (555) 123-4567</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span className="footer-contact-text">San Francisco, CA</span>
              </div>
            </div>
            <div className="footer-newsletter">
              <h5 className="footer-newsletter-title">Stay Updated</h5>
              <div className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="footer-newsletter-input"
                />
                <button className="footer-newsletter-button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2024 CollegeCompanion. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">
              Privacy Policy
            </a>
            <a href="#" className="footer-bottom-link">
              Terms of Service
            </a>
            <a href="#" className="footer-bottom-link">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
