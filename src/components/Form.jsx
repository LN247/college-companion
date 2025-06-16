import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Forms.css";
import validation from "../utils/validation";
import InputWithError from "./InputwithError";
import { requestForToken } from "../utils/firebase";
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
    username: "",
    confirmPassword: "",
  });
  const [InputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const errors = {};
    const EmailValidation = validation.validateEmail(formData.email);
    const PasswordValidation = validation.validatePassword(formData.password);

    if (!EmailValidation.success) {
      errors.email = EmailValidation.message;
    }

    if (!PasswordValidation.success) {
      errors.password = PasswordValidation.message;
    }

    // Only check confirm password on signup
    if (
      formData.confirmPassword !== undefined &&
      formData.confirmPassword !== formData.password
    ) {
      errors.ConfirmPassword = "Password fields do not match";
    }

    setInputError(errors);
    return Object.keys(errors).length === 0;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `http://localhost:8000/api/${
        type === "login" ? "login" : "register"
      }/`;

      // Add validation for signup
      if (type === "signup") {
        if (!validate()) {
          setLoading(false);
          return;
        }
      }

      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post(url, dataToSend, {
        body: { "Content-Type": "application/json" },
      });

      // After successful login or signup, get FCM token and send to backend
      const token = await requestForToken();
      if (token) {
        await axios.post(
          "http://localhost:8000/api/save-fcm-token/",
          { token },
          { withCredentials: true }
        );
      }

      if (type === "login") {
        navigate("/dashboard");
      } else {
        // After signup, redirect to login
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
            </div>

            {type === "signup" && (
              <div className="input-box">
                <InputWithError
                  id="username"
                  type="text"
                  name="username"
                  label="Username"
                  className="input"
                  placeholder="username"
                  errors={InputError.username}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <div className="input-box">
              <InputWithError
                id="email"
                type="email"
                name="email"
                label="Email"
                className="input"
                placeholder="example@gmail.com"
                value={formData.email}
                error={InputError.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-box">
              <InputWithError
                id="password"
                type="password"
                label="password"
                name="password"
                className="input"
                value={formData.password}
                error={InputError.password}
                onChange={handleChange}
                placeholder="password"
                disabled={loading}
              />
            </div>

            {type === "signup" && (
              <div className="input-box">
                <InputWithError
                  id="ConfirmPassword"
                  label="confirm Password"
                  type="password"
                  name="confirmPassword"
                  className="input"
                  placeholder="confirm your password"
                  value={formData.confirmPassword}
                  error={InputError.ConfirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <button type="submit" className="submit" disabled={loading}>
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
