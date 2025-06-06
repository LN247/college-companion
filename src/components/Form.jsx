import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Forms.css";
import validation from "../utils/validation";
import ErrorMessage from "./Error";
import { GoogleLogin } from "@react-oauth/google";

function FormComponent({
  type = "login",
  login_message,
  form_title,
  alternative_method,
  path,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ...(type === "signup"),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const EmailValidation = validation.validateEmail(formData.email);
    const PasswordValidation = validation.validatePassword(formData.password);

    if (!EmailValidation.success) {
      setError(EmailValidation.message);

      return false;
    }

    if (!PasswordValidation.success) {
      setError(PasswordValidation.message);
      return false;
    }

    setError("");

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = `http://localhost:8000/api/${
        type === "login" ? "login" : "register"
      }/`;

      // Add validation for signup
      if (type === "signup") {
        if (!validate()) {
          setLoading(false);

          return true;
        }
      }

      const response = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (type === "login") {
        // Handle successful login
        navigate("/dashboard");
      } else {
        // Handle successful registration
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div className="left-box">
        <div className="message">
          <h1>ENJOY COLLEGE LIFE</h1>
        </div>
      </div>

      <div className="login-box">
        <div className="welcome-box">
          <h1>{login_message}</h1>
        </div>
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <div className="login-message">
              <h2>{form_title}</h2>
              <ErrorMessage message={error} />
            </div>

            {type === "signup" && (
              <div className="input-box">
                <label htmlFor="username" className="label">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="input"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <div className="input-box">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-box">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {type === "signup" && (
              <div className="input-box">
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : form_title}
            </button>
          </form>

          <div className="login-options">
            <div className="line"></div>
            <p className="p">or</p>

            <button
              className="signin-button"
              onClick={() => navigate(path)}
              disabled={loading}
            >
              {alternative_method}
            </button>

            <GoogleLogin
              style={{ width: "100%" }}
              onSuccess={async (credentialResponse) => {
                const idToken = credentialResponse.credential;

                console.log("Google ID Token:", idToken);
                try {
                  const response = await axios.post(
                    "http://localhost:8000/api/google-auth/",
                    { idToken },
                    {
                      withCredentials: true,
                      headers: { "Content-Type": "application/json" },
                    }
                  );
                  // Handle successful login
                  navigate("/dashboard");
                } catch (error) {
                  setError(
                    error.response?.data?.error ||
                      error.message ||
                      "Something went wrong"
                  );
                }
              }}
              onError={() => {
                setError("Google authentication failed. Please try again.");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormComponent;
