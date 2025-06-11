import React, { useState, useCallback, useMemo } from "react";
import { Calendar, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/Button";
import InputWithError from "./InputwithError";
import "../Styles/plan.css";
import axios from "axios";

export default function SemesterCourseForm({ onFormComplete }) {
  // Semester state
  const [semesterName, setSemesterName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [semesterErrors, setSemesterErrors] = useState({});

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

  return (
    <div className="semester-course-container">
      {/* Semester Information Card */}
      <Card className="semester-card">
        <CardHeader className="card-header-blue">
          <CardTitle className="card-title">
            <GraduationCap className="header-icon" />
            Semester Information
          </CardTitle>
          <CardDescription className="header-description">
            Set up your semester details and course schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="card-content">
          <form
            onSubmit={handleSemesterSubmit}
            noValidate
            className="course-form"
          >
            <InputWithError
              id="semesterName"
              label="Semester Name"
              value={semesterName}
              onChange={(e) => semesterHandlers.setSemesterName(e.target.value)}
              error={semesterErrors.semesterName}
              placeholder="e.g., Fall 2024"
              icon={Calendar}
            />

            <div className="date-grid">
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

              <Button type="submit">Continue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
