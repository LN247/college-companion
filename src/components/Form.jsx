    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios";
    import "../Styles/Forms.css";
    import { useToast } from "../hooks/use-toast";
    import validation from "../utils/validation";
    import InputWithError from "./InputwithError";
    import { GoogleLogin } from "@react-oauth/google";
    import {useLoading} from "../context/LoadingContext";

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
      const [isLoading, setIsLoading] = useState(true);
      const loadingIndicator = useLoading();
      const [responseData, setResponseData] = useState(null);
      const [InputError, setInputError] = useState("");
      const [loading, setLoading] = useState(false);
      const toast = useToast();
      const [error, setError] = useState("");
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


        setIsLoading(true);

        try {
          const url = `http://localhost:8000/api/${
            type === "login" ? "login" : "register"
          }/`;

          // Add validation for signup
          if (type === "signup") {
            if (!validate()) {
              setIsLoading(false);
              return;
            }
          }
          const { confirmPassword, ...dataToSend } = formData;
          const response = await axios.post(url, dataToSend, {
            body: { "Content-Type": "application/json" },
          });

          setResponseData(response.data);



          if (type === "login") {
              console.log(response.data);

                  if (responseData.is_superuser === 1) {
                      navigate("/admin-dashboard");



                  } else {

                      navigate("/dashboard");
                  }

                     toast({
                  title: "Welcome" ,
                  description: `Welcome back ${responseData.username}`,
                 });
              }



           else {
            // After signup, redirect to login
            navigate("/user-profile");
          }

      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }

    }

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

                    <InputWithError
                      id="username"
                      type="text"
                      name="username"
                      label="Username"
                      className="input-field-1"
                      placeholder="username"
                      errors={InputError.username}
                      value={formData.username}
                      onChange={handleChange}
                      disabled={loading}
                    />
                )}


                  <InputWithError
                    id="email"
                    type="email"
                    name="email"
                    label="Email"
                    className="input-field-1"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    error={InputError.email}
                    onChange={handleChange}
                    disabled={loading}
              />


              <InputWithError
                id="password"
                type="password"
                label="password"
                name="password"
                className="input-field-1"
                value={formData.password}
                error={InputError.password}
                onChange={handleChange}
                placeholder="password"
                disabled={loading}
              />

            {type === "signup" && (

                <InputWithError
                  id="ConfirmPassword"
                  label="confirm Password"
                  type="password"
                  name="confirmPassword"
                  className="input-field-1"
                  placeholder="confirm your password"
                  value={formData.confirmPassword}
                  error={InputError.ConfirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
            )}

            <button type="submit" disabled={loading} className="submit">
             {loading ? "Loading..." : form_title}
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
