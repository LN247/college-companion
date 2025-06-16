import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [mockSemesters, setMockSemesters] = useState([]);
  const [mockCourses, setMockCourses] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE = "http://127.0.0.1:8000/api"; // Ensure this is correct

  useEffect(() => {
    const fetchSemestersAndCourses = async () => {
      setLoading(true); // Start loading
      try {
        const semestersResponse = await axios.get(`${API_BASE}/semesters/`);
        const coursesResponse = await axios.get(`${API_BASE}/courses/`);

        setMockSemesters(semestersResponse.data);
        setMockCourses(coursesResponse.data);
        setLoading(false); // Stop loading on success
      } catch (err) {
        console.error("Error fetching semesters and courses:", err);
        setError(err);
        setLoading(false); // Stop loading on error
      }
    };

    fetchSemestersAndCourses();
  }, []); // Run only on mount

  // Initialize semesters and courses based on mockSemesters and mockCourses
  const [semesters, setSemesters] = useState([]);
  const [Courses, setCourses] = useState([]);

  useEffect(() => {
    setSemesters(mockSemesters);
    setCourses(mockCourses);
  }, [mockSemesters, mockCourses]);  // Update when mockSemesters or mockCourses change

  // Functions (same as original, without types)
  const addSemester = (semester) => {
    const newSemester = {
      ...semester,
      id: semester.id
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
        loading,  // Expose loading state
        error,    // Expose error state
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