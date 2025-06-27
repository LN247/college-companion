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
  const [semesterTimetable,setSemesterTimetable]=useState([]);
  const [userTimetable,setuserTimetable]=useState([]);
  const [events, setEvents] = useState([]);
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

        const classTimetable  = await  axios.get(`${API_BASE}/fixed-schedules`,{
          withCredentials:true
        })
          setSemesterTimetable(classTimetable.data);
        const GeneratedTimetable= await  axios.get(`${API_BASE}/study-blocks`,{
          withCredentials:true
        })
        setuserTimetable(GeneratedTimetable.data);

    //fetch the event from the backend and set the events and export events 


    } catch (error) {
      console.error("Auth check failed:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

// Fetch events from backend
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("access_token"); // or your auth logic
      const response = await fetch("/api/events/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data); // Set the events state
      } else {
        setEvents([]);
      }
    } catch (error) {
      setEvents([]);
    }
  };

  fetchEvents();
}, []);

useEffect(() => {
  console.log("Updated user from state:", user); // Logs updated user after re-render
}, [user]);

  return (
     <UserContext.Provider value={{ user, setUser,semesters,
         isLoading,semesterTimetable,userTimetable, error, loadingIndicator, events, setEvents }}>
    {children || <React.Fragment />}
  </UserContext.Provider>
  );
};

export default UserContext;

// Export events for use elsewhere if needed
export { events };




