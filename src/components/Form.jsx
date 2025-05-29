import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Forms.css";
import validation from "../utils/validation";
import ErrorMessage from "./Error";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "../assets/google-icon.svg";

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

  const GoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError("");
        const result = await googleLogin(tokenResponse.credential);
        if (result.success) {
          // create and api call to register the user or login the user
          navigate("/dashboard");
        } else {
          setError(
            result.error || "Failed to sign up with Google. Please try again."
          );
        }
      } catch (error) {
        console.error("Google signup error:", error);
        setError(
          "An unexpected error occurred during Google signup. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Failed to initialize Google signup. Please try again.");
      setLoading(false);
    },
  });

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

  const login_with_google = () => {
    // Implement Google OAuth logic
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

            <button
              className="google-button"
              onClick={() => GoogleAuth()}
              disabled={loading}
            >
              <img src={GoogleIcon} className="google-icon" alt="Google" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormComponent;
