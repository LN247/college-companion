import React, { useState, useEffect } from "react";
import { Lock, RefreshCw } from "react-feather";
import { useMousePosition } from "../hooks/useMousePosition";
import "../Styles/Notfound.css";
function Unauthorised() {
  const mousePosition = useMousePosition();
  return (
    <div className="unauthorized-container">
      {/* Animated background elements */}
      <div className="background-elements">
        <div
          className="bg-element bg-element-auth-1"
          style={{
            left: mousePosition.x * -0.01 + "px",
            top: mousePosition.y * -0.01 + "px",
          }}
        />
        <div className="bg-element bg-element-auth-2" />
        <div className="bg-element bg-element-auth-3" />
      </div>

      {/* Floating warning icons */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="floating-warning"
          style={{
            left: `${15 + i * 18}%`,
            top: `${25 + (i % 2) * 40}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          <Lock className="warning-icon" />
        </div>
      ))}

      <div className="content-container">
        {/* 401 Text with gradient and glow */}
        <div className="error-number-container">
          <h1 className="error-number error-401">401</h1>
          <div className="error-number-glow error-401">401</div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <div className="content-header">
            <div className="lock-icon-container">
              <Lock className="main-icon" />
              <div className="lock-indicator" />
            </div>
            <h2 className="error-title">Access Denied</h2>
            <p className="error-description">
              Hold up! You don't have permission to access this resource. This
              area is restricted and requires proper authentication credentials.
            </p>
          </div>

          {/* Action buttons */}
          <div className="button-container">
            <button className="primary-button auth-primary">
              <span className="button-content">
                <Lock className="button-icon" />
                Sign In
              </span>
              <div className="button-overlay auth-overlay" />
            </button>

            <button className="secondary-button auth-secondary">
              <span className="button-content">
                <RefreshCw className="button-icon refresh-icon" />
                Try Again
              </span>
            </button>
          </div>
        </div>

        {/* Help text */}
        <p className="help-text auth-help">
          Need access? Contact your administrator or check your credentials
        </p>
      </div>
    </div>
  );
}

export default Unauthorised;
