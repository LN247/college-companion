import React from "react";
import "../Styles/Forms.css";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import validation from "../utils/validation.js";
const { validateEmail, validatePassword, validateFullname } = validation;
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/google-icon.svg";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const googleSignup = useGoogleLogin({
    // handle google signup here i.e call the api to create a new user
    // and then redirect to the next page
    onError: (error) => {
      setError("Login Failed");
      console.log("Login Failed:", error);
    },
    // handle the success of the google signup
    // and then redirect to the next page

    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      const token = jwtDecode(tokenResponse.credential);
      console.log(token);
    },
  });

  function validateForm() {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const fullnameValidation = validateFullname(fullname);

    if (!fullnameValidation.success) {
      setError(fullnameValidation.message);
      return false;
    }

    if (!emailValidation.success) {
      setError(emailValidation.message);
      return false;
    }
    if (!passwordValidation.success) {
      setError(passwordValidation.message);
      return false;
    }

    setError("");
    return true;
  }
  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    // Handle form submission logic here
    console.log(Object.fromEntries(new FormData(e.target)));
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
          <h1>Join us </h1>
        </div>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <div className="login-message">
              {" "}
              <h2>signup</h2>
            </div>

            {error && (
              <label className="error-message">
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
                {error}
              </label>
            )}

            <div className="input-box">
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="input"
                autoComplete="name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label htmlFor="password" className="label">
                password
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="input"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="remember-me">
              <input
                type="checkbox"
                name="remember"
                className="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="remember">Agree with terms and policy</label>
            </div>

            <button type="submit">Continue</button>
          </form>

          <div className="login-options">
            <div className="line"></div>
            <p className="p">or</p>
            <button
              className="signin-button"
              onClick={() => {
                navigate("/");
              }}
            >
              Login
            </button>

            <button className="google-button" onClick={() => googleSignup()}>
              <img src={GoogleIcon} className="google-icon" />
              continue with Google
            </button>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
