// auth.js
import axios from "axios";
import { useNavigate} from "react";
import { useQuery } from '@tanstack/react-query';
const API_BASE = "http://localhost:8000/api";

axios.defaults.withCredentials = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

 const csrfToken = getCookie('csrftoken');


// Add interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const navigate = useNavigate();

    // Prevent endless loop: don't retry for refresh endpoint itself
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


export const useAuthStatus = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["auth"],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    return { status: data, isLoading, error };
};

// Create a direct function for imperative calls
export const checkAuthStatus = async () => {
    try {
        return await fetchData();
    } catch (error) {
        console.error("Auth check failed:", error);
        return false;
    }
};
