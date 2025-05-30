import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/login/";

async function login(email, password) {
  try {
    const response = await axios.post(
      API_URL,
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    console.log("Login successful:", response);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || "Login failed. Please try again.",
    };
  }
}

export { login };
