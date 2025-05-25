import React from "react";
import "../Styles/Notfound.css";
import { useNavigate } from "react-router-dom";
import NotfoundImage from "../assets/Notfound-background.jpeg";
function Notfound() {
  const navigate = useNavigate();
  return (
    <div className="notfound-container">
      <div className="box1">
        <img src={NotfoundImage} alt="404 error image" height="5vh" />

        <div className="message-box">
          <h1>404 </h1>

          <p> it seems that you are lost </p>
        </div>
      </div>

      <div className="button-box">
        <button onClick={() => navigate(-1)}>back</button>
      </div>
    </div>
  );
}

export default Notfound;
