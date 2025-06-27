import React from "react";
import "../Styles/Notfound.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMousePosition } from "../hooks/useMousePosition";
import { Home, Lock, Search, ArrowLeft, RefreshCw } from "lucide-react";
function Notfound() {
  const navigate = useNavigate();
  const mousePosition = useMousePosition();

  return (
    <div className="not-found-container">
      {/* Animated background elements */}
      <div className="background-elements">
        <div
          className="bg-element bg-element-1"
          style={{
            left: mousePosition.x * 0.02 + "px",
            top: mousePosition.y * 0.02 + "px",
          }}
        />
        <div className="bg-element bg-element-2" />
        <div className="bg-element bg-element-3" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <div className="content-container">
        {/* 404 Text with gradient and glow */}
        <div className="error-number-container">
          <h1 className="error-number error-404">404</h1>
          <div className="error-number-glow error-404">404</div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <div className="content-header">
            <Search className="main-icon" />
            <h2 className="error-title">Page Not Found</h2>
            <p className="error-description">
              Oops! The page you're looking for seems to have vanished into the
              digital void. It might have been moved, deleted, or maybe it never
              existed at all.
            </p>
          </div>

          {/* Action buttons */}
          <div className="button-container">
            <button className="primary-button">
              <span className="button-content">
                <Home className="button-icon" />
                Go Home
              </span>
              <div className="button-overlay" />
            </button>

            <button className="secondary-button">
              <span className="button-content">
                <ArrowLeft className="button-icon secondary-icon" />
                Go Back onClick={() => navigate(-1)}
              </span>
            </button>
          </div>
        </div>

        {/* Help text */}
        <p className="help-text">
          Still lost? Try searching or contact our support team
        </p>
      </div>
    </div>
  );
}

export default Notfound;
