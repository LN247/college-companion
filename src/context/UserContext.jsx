import React, {createContext, useState, useEffect, useContext} from "react";
import axios from "axios";
import { useLoading } from "./LoadingContext";

// Create UserContext
const UserContext = createContext();

const API_BASE = "http://localhost:8000/api";

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [semesters, setSemesters] = useState([]);

  const loadingIndicator = useLoading();

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    loadingIndicator
    setError(null);

    try {



      const response = await axios.get(`${API_BASE}/user-info/`, {
        withCredentials: true,
       });
        setUser(response.data);
        const semestersResponse = await axios.get(`${API_BASE}/semesters/`, {
        withCredentials: true,
      });
        setSemesters(semestersResponse.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);












useEffect(() => {
  console.log("Updated user from state:", user); // Logs updated user after re-render
}, [user]);

  return (
     <UserContext.Provider value={{ user, setUser,semesters,
         isLoading, error, loadingIndicator }}>
    {children || <React.Fragment />}
  </UserContext.Provider>
  );
};

export default UserContext;




