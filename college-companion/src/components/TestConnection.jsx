import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

const TestConnection = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courses/`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setCourses(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="test-connection">
      <h2>Test Backend Connection</h2>
      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p>Code: {course.code}</p>
              <p>Credits: {course.credits}</p>
              <p>Instructor: {course.instructor}</p>
            </div>
          ))
        ) : (
          <p>No courses found. Try adding some courses through the admin panel!</p>
        )}
      </div>
    </div>
  );
};

export default TestConnection; 