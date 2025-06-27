import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/login/";



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


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

const addSemester = () => {
  const csrfToken = getCookie('csrftoken');


}





export { login };
