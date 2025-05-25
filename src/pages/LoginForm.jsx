import React from "react";
import "../Styles/Forms.css";
import { Form, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../utils/api";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import GoogleIcon from "../assets/google-icon.svg";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login_with_google = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError("");
        const result = await googleLogin(tokenResponse.credential);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error || "Failed to login with Google. Please try again.");
        }
      } catch (error) {
        console.error("Google login error:", error);
        setError("An unexpected error occurred during Google login. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Failed to initialize Google login. Please try again.");
      setIsLoading(false);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard'); // or wherever you want to redirect after login
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="left-box">
        <div className="message">
          {" "}
          <h1>ENJOY COLLEGE LIFE</h1>
        </div>
      </div>

      <div className="login-box">
        <div className="welcome-box">
          <h1>Welcome Back</h1>
        </div>
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <div className="login-message">
              {" "}
              <h2>Login</h2>
            </div>

            {error && (
              <div className="error-message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  style={{
                    fill: " rgba(226, 22, 22, 1)",
                    transform: "",
                    msFilter: "",
                  }}
                >
                  <path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path>
                  <path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path>
                </svg>
                <span>{error}</span>
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
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="box">
              <div className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  className="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="remember">Remember me</label>
                <span>
                  <Link to="/reset-password">Forgot password?</Link>{" "}
                </span>
              </div>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-options">
            <div className="line"></div>
            <p className="p">or</p>
            <button
              className="signin-button"
              onClick={() => navigate("/auth/signup")}
              disabled={isLoading}
            >
              Signup
            </button>

            <button
              className="google-button"
              onClick={() => login_with_google()}
              disabled={isLoading}
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

export default LoginForm;
