// auth.js
import axios from "axios";
import  {getCookie} from "./getcookies";

const API_BASE = "http://localhost:8000/api";

axios.defaults.withCredentials = true;

 const csrfToken = getCookie('csrftoken');
// Add interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/refresh/")
    ) {
      originalRequest._retry = true;
      try {

        const refreshResponse = await axios.post(
          `${API_BASE}/refresh/`,
          {},
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        );

        // If refresh is successful, retry the original request
        if (refreshResponse.status === 200) {
          return axios(originalRequest);
        } else {
          // If refresh fails, reject the original request
          console.error("Refresh token request failed with status:", refreshResponse.status);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Redirect to login if refresh token fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


  const  fetchData=async() =>{

    try{
        const response = await axios.get(`${API_BASE}/user-info/`, {
      withCredentials: true,
    });
    console.log(response.status);
    return response.status;
    }catch(error){
        console.error("Auth check failed:", error);
        return false;
    }

}



// Create a direct function for imperative calls
export const checkAuthStatus = async () => {
    try {
        return await fetchData();
    } catch (error) {
        console.error("Auth check failed:", error);
        return false;
    }
};
