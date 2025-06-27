import React, { useState, useCallback, useMemo } from "react";
import { Calendar, GraduationCap, Plus, Users, Clock, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/Button";
import InputWithError from "./InputwithError";
import "../Styles/SemesterManager.css";
import axios from "axios";

export default function SemesterCourseForm({ onFormComplete }) {
  // Semester state
  const [semesterName, setSemesterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [semesterErrors, setSemesterErrors] = useState({});
  const [semesters, setSemesters] = useState([]);

  // Validation helpers
  const validateSemester = useCallback(() => {
    const errors = {};
    if (!semesterName.trim()) errors.semesterName = "Semester Name is required";
    if (!startDate.trim()) errors.startDate = "Start Date is required";
    if (!endDate.trim()) errors.endDate = "End Date is required";
    if (
      startDate.trim() &&
      endDate.trim() &&
      new Date(endDate) < new Date(startDate)
    ) {
      errors.endDate = "End Date cannot be before Start Date";
    }
    setSemesterErrors(errors);
    return Object.keys(errors).length === 0;
  }, [semesterName, startDate, endDate]);

  const API_BASE = "http://127.0.0.1:8000/api";

  const totalContactFields = 3;
  const countCompletedFields = (data) => {
    return Object.values(data).filter((value) => value.trim() !== "").length;
  };

  const isSemesterFormCompleted = () => {
    // All fields must be filled
    const allFilled =
      countCompletedFields({
        semesterName,
        startDate,
        endDate,
      }) === totalContactFields;

    // No validation errors
    const noErrors =
      !semesterErrors.semesterName &&
      !semesterErrors.startDate &&
      !semesterErrors.endDate;

    return allFilled && noErrors;
  };

  // Handle Add Course submit
  const handleSemesterSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const semesterValid = validateSemester();
      if (!semesterValid) {
        onFormComplete(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE}/semesters/`,
          {
            name: semesterName,
            start_date: startDate,
            end_date: endDate,
          },
          { withCredentials: true }
        );
        // Pass the created semester's ID to the parent
        const semesterId = response.data.id;
        
        // Add to local state
        setSemesters(prev => [...prev, {
          id: semesterId,
          name: semesterName,
          startDate,
          endDate,
          status: 'active'
        }]);
        
        // Clear form
        setSemesterName("");
        setStartDate("");
        setEndDate("");
        
        onFormComplete({ valid: true, semesterId });
      } catch (error) {
        // Optionally handle error
        onFormComplete({ valid: false, semesterId: null });
      }
    },
    [validateSemester, onFormComplete, semesterName, startDate, endDate]
  );

  // Memoize semester handlers
  const semesterHandlers = useMemo(
    () => ({
      setSemesterName: (value) => {
        setSemesterName(value);
        if (semesterErrors.semesterName) {
          setSemesterErrors((prev) => ({ ...prev, semesterName: "" }));
        }
      },
      setStartDate: (value) => {
        setStartDate(value);
        if (semesterErrors.startDate || semesterErrors.endDate) {
          setSemesterErrors((prev) => ({
            ...prev,
            startDate: "",
            endDate: "",
          }));
        }
      },
      setEndDate: (value) => {
        setEndDate(value);
        if (semesterErrors.endDate || semesterErrors.startDate) {
          setSemesterErrors((prev) => ({
            ...prev,
            endDate: "",
            startDate: "",
          }));
        }
      },
    }),
    [semesterErrors]
  );

  // Calculate semester stats
  const activeSemesters = semesters.filter(s => s.status === 'active').length;
  const completedSemesters = semesters.filter(s => s.status === 'completed').length;
  const upcomingSemesters = semesters.filter(s => s.status === 'upcoming').length;

  return (
    <div className="semester-manager">
      <div className="semester-manager-container">
        {/* Header Section */}
        <div className="semester-manager-header">
          <h1 className="semester-manager-title">Semester Manager</h1>
          <p className="semester-manager-subtitle">
            Manage your academic semesters and track your progress
          </p>
        </div>

        {/* Stats Section */}
        <div className="semester-stats">
          <div className="semester-stat-card">
            <div className="semester-stat-number">{semesters.length}</div>
            <div className="semester-stat-label">Total Semesters</div>
          </div>
          <div className="semester-stat-card">
            <div className="semester-stat-number">{activeSemesters}</div>
            <div className="semester-stat-label">Active Semesters</div>
          </div>
          <div className="semester-stat-card">
            <div className="semester-stat-number">{completedSemesters}</div>
            <div className="semester-stat-label">Completed</div>
          </div>
          <div className="semester-stat-card">
            <div className="semester-stat-number">{upcomingSemesters}</div>
            <div className="semester-stat-label">Upcoming</div>
          </div>
        </div>

        {/* Semester Form Card */}
        <div className="semester-form-card">
          <div className="semester-form-header">
            <div className="semester-form-title">
              <Plus />
              Add New Semester
            </div>
            <div className="semester-form-description">
              Create a new semester to organize your courses
            </div>
          </div>
          <div className="semester-form-content">
            <form onSubmit={handleSemesterSubmit} noValidate>
              <div className="semester-inputs">
                <InputWithError
                  id="semesterName"
                  label="Semester Name"
                  value={semesterName}
                  onChange={(e) => semesterHandlers.setSemesterName(e.target.value)}
                  error={semesterErrors.semesterName}
                  placeholder="e.g., Fall 2024"
                  icon={Calendar}
                />

                <div className="semester-grid">
                  <InputWithError
                    id="startDate"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => semesterHandlers.setStartDate(e.target.value)}
                    error={semesterErrors.startDate}
                    type="date"
                    icon={Calendar}
                  />
                  <InputWithError
                    id="endDate"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => semesterHandlers.setEndDate(e.target.value)}
                    error={semesterErrors.endDate}
                    type="date"
                    icon={Calendar}
                  />
                </div>
              </div>

              <Button type="submit" className="add-semester-btn">
                <Plus />
                Add Semester
              </Button>
            </form>
          </div>
        </div>

        {/* Semesters List */}
        {semesters.length > 0 && (
          <div className="semesters-card">
            <div className="semester-card-header">
              <div className="semester-card-title">
                <GraduationCap className="semester-header-icon" />
                Your Semesters
              </div>
              <div className="semester-form-description">
                Manage and track your academic semesters
              </div>
            </div>
            <div className="semester-card-content">
              <div className="semesters-grid">
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="semester-item-card">
                    <div className="semester-item-title">{semester.name}</div>
                    <div className={`semester-item-status ${semester.status}`}>
                      {semester.status}
                    </div>
                    <div className="semester-item-details">
                      <div className="semester-item-detail">
                        <Calendar />
                        Start: {new Date(semester.startDate).toLocaleDateString()}
                      </div>
                      <div className="semester-item-detail">
                        <Calendar />
                        End: {new Date(semester.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="semester-item-actions">
                      <button className="semester-action-btn primary">View Courses</button>
                      <button className="semester-action-btn secondary">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
