import React from "react";
import { useNavigate } from "react-router-dom";
import "./Resources.css";

const Resources = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Study Planner", description: "Plan your semester easily." },
    { title: "Task Manager", description: "Track your daily tasks efficiently." },
    { title: "AI Assistant", description: "Ask questions and get instant answers." },
    { title: "Style Tips", description: "Get daily style & outfit suggestions." },
    { title: "Study Groups", description: "Connect with your perfect study partner." },
    { title: "Progress Charts", description: "Visualize your academic progress." },
  ];

  return (
    <div className="resources-page">
      <h1 className="page-title">College Companion Resources</h1>

      {/* 👇 Go Back Button */}
      <button className="go-back-btn" onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <div className="resources-container">
        <div className="card-grid">
          {features.map((item, index) => (
            <div key={index} className="feature-card">
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
