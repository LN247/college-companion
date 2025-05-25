import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function login(email, password) {
  try {
    const response = await api.post('/auth/login/', {
      username: email,
      password,
    });
    
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return { success: true, data: response.data };
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Login failed. Please try again.' 
    };
  }
}

async function googleLogin(credential) {
  try {
    const response = await api.post('/auth/google-login/', {
      token: credential,
    });
    
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return { success: true, data: response.data };
    }
    return { success: false, error: 'Google login failed' };
  } catch (error) {
    console.error('Google login error:', error.response?.data || error);
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Google login failed. Please try again.' 
    };
  }
}

export { login, googleLogin };
