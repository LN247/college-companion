import React from "react";
import { Button } from "./ui/Button";
import {
  ArrowRight,
  BookOpen,
  Users,
  Lightbulb,
  LogIn,
  UserPlus,
} from "lucide-react";
import "../Styles/Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="decorative-circle decorative-circle1"></div>
        <div className="decorative-circle decorative-circle2"></div>
        <div className="decorative-gradient"></div>
      </div>

      <div className="hero-container">
        <div className="hero-grid">
          {/* Left column – Content */}
          <div className="hero-content">
            <h1 className="hero-heading">
              <span className="heading-primary">Navigate College with</span>
              <span className="heading-secondary">Complete Confidence</span>
            </h1>

            <p className="hero-paragraph">
              Your comprehensive companion for academic excellence. Master
              semester planning, connect with like-minded peers, and receive
              personalized guidance to thrive in your college journey.
            </p>

            <div className="hero-buttons">
              <Button className="hero-button primary">
                <UserPlus className="icon" />
                Sign Up Free
                <ArrowRight className="icon arrow" />
              </Button>
              <Button variant="outline" className="hero-button secondary">
                <LogIn className="icon" />
                Login
              </Button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Students</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Universities</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right column – Visual (Mock app interface) */}
          <div className="hero-visual">
            <div className="visual-container">
              <div className="visual-mock">
                <div className="mock-header">
                  <div className="mock-dot red"></div>
                  <div className="mock-dot yellow"></div>
                  <div className="mock-dot green"></div>
                </div>
                <div className="mock-content">
                  <div className="mock-line"></div>
                  <div className="mock-card">
                    <BookOpen className="icon" />
                    <span>Semester Planning</span>
                  </div>
                  <div className="mock-line short"></div>
                  <div className="mock-card">
                    <Users className="icon" />
                    <span>Peer Connections</span>
                  </div>
                  <div className="mock-line shorter"></div>
                  <div className="mock-card">
                    <Lightbulb className="icon" />
                    <span>Daily Insights</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="floating-element float1">
                <BookOpen className="icon" />
              </div>
              <div className="floating-element float2">
                <Lightbulb className="icon" />
              </div>
              <div className="floating-element float3">
                <Users className="icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
