import React from "react";
import { useLoading } from "../context/LoadingContext";
import "../Styles/Loadingpage.css";

const LoadingScreen = () => {
  const { loadingMessage } = useLoading();

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2 className="loading-text">{loadingMessage}</h2>
    </div>
  );
};

export default LoadingScreen;

