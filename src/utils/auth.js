// auth.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

axios.defaults.withCredentials = true;

// Add interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh
        await axios.post(`${API_BASE}/refresh/`, { withCredentials: true });
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        window.location.href = "/"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/user-info/`, {
      withCredentials: true,
    });
    console.log(response.status);
    return response.status;
  } catch (error) {
    console.error("Auth check failed:", error);
    return {
      isAuthenticated: false,
      message: error.response?.data?.message || "Authentication check failed",
    };
  }
};
