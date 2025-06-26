import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [Courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE = "http://localhost:8000/api";

  useEffect(() => {
    const fetchSemestersAndCourses = async () => {
      setLoading(true);
      try {
        const coursesResponse = await axios.get(`${API_BASE}/courses/`);
        const semestersResponse = await axios.get(`${API_BASE}/semesters/`);

        setSemesters(semestersResponse.data);
        setCourses(coursesResponse.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching semesters and courses:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSemestersAndCourses();
  }, []);

  // Functions (same as original, without types)
  const addSemester = (semester) => {
    const newSemester = {
      ...semester,
      id: semester.id,
    };
    setSemesters((prev) => [...prev, newSemester]);
  };

  const updateSemester = (id, updates) => {
    setSemesters((prev) =>
      prev.map((sem) => (sem.id === id ? { ...sem, ...updates } : sem))
    );
  };

  const deleteSemester = (id) => {
    setSemesters((prev) => prev.filter((sem) => sem.id !== id));
    setCourses((prev) => prev.filter((course) => course.semesterId !== id));
  };

  const addCourse = (course) => {
    const newCourse = {
      ...course,
      id: course.id,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = (id, updates) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, ...updates } : course
      )
    );
  };

  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        semesters,
        Courses,
        addSemester,
        updateSemester,
        deleteSemester,
        addCourse,
        updateCourse,
        deleteCourse,
        loading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export default AdminContext;
