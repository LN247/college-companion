import React from "react";

const LoadingScreen = () => {
  const spinnerStyle = {
    border: "6px solid #ffffff",
    borderTop: "6px solid #F68712",
    borderRadius: "50%",
    width: "70px",
    height: "70px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  };

  const containerStyle = {
    backgroundColor: "#06123D",
    color: "#FFFFFF",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  };

  const textStyle = {
    fontSize: "1.5rem",
    fontWeight: 500
  };

  const styleSheet = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{styleSheet}</style>
      <div style={spinnerStyle}></div>
      <h2 style={textStyle}>Loading, please wait...</h2>
    </div>
  );
};

export default LoadingScreen;

