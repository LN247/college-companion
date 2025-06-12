import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Button } from "../components/ui/Button";

import { Trash2, Plus } from "lucide-react";
import "../Styles/UserPrefrenceForm.css";
import axios from "axios";

const StepUserPreferencesForm = ({ onFormComplete, semesterId }) => {
  const [offDays, setOffDays] = useState([]);
  const [preferStudyHours, setPreferStudyHours] = useState("");
  const [notificationReminder, setNotificationReminder] = useState("");
  const [studyStartTime, setStudyStartTime] = useState("");
  const [studyEndTime, setStudyEndTime] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([
    {
      id: "1",
      courseId: "",
      startTime: "",
      endTime: "",
      day: "",
      location: "",
      difficultyLevel: 1,
    },
  ]);

  // Fetch course data
  const fetchCourses = async (semesterId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/courses?semesterId=${semesterId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      return [];
    }
  };

  const [mockCourses, setMockCourses] = useState([]);
  useEffect(() => {
    const loadCourses = async () => {
      const courses = await fetchCourses(semesterId);
      setMockCourses(courses);
      // Initialize selectedCourses with the fetched courses
      setSelectedCourses((prev) =>
        prev.map((course) => ({
          ...course,
          courseId: courses.length > 0 ? courses[0].id : "",
          startTime: "",
          endTime: "",
          day: "",
          location: "",
          difficultyLevel: 1,
        }))
      );
    };
    loadCourses();
  }, [semesterId]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const removeCourse = (id) => {
    if (selectedCourses.length > 1) {
      setSelectedCourses(selectedCourses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setSelectedCourses(
      selectedCourses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const toggleOffDay = (day) => {
    setOffDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addCourse = () => {
    setSelectedCourses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        courseId: "",
        startTime: "",
        endTime: "",
        day: "",
        location: "",
        difficultyLevel: 1,
      },
    ]);
  };
  const checkFormCompletion = () => {
    // Check if all required fields are filled
    const allFieldsFilled =
      preferStudyHours &&
      notificationReminder &&
      studyStartTime &&
      studyEndTime &&
      selectedCourses.every(
        (course) =>
          course.courseId &&
          course.startTime &&
          course.endTime &&
          course.day &&
          course.location
      );
    // Check if at least one course is selected
    const atLeastOneCourseSelected = selectedCourses.some(
      (course) => course.courseId
    );
    // Check if off days are selected
    const offDaysSelected = offDays.length > 0;
    // Check if study start time is before end time
    const validStudyTime =
      studyStartTime &&
      studyEndTime &&
      new Date(`1970-01-01T${studyStartTime}:00`) <
        new Date(`1970-01-01T${studyEndTime}:00`);
    // Check if notification reminder is a valid number
    const validNotificationReminder =
      notificationReminder &&
      !isNaN(notificationReminder) &&
      notificationReminder >= 5 &&
      notificationReminder <= 120;
    // Check if preferred study hours is a valid number
    const validPreferStudyHours =
      preferStudyHours &&
      !isNaN(preferStudyHours) &&
      preferStudyHours >= 1 &&
      preferStudyHours <= 12;
    return (
      allFieldsFilled &&
      atLeastOneCourseSelected &&
      offDaysSelected &&
      validStudyTime &&
      validNotificationReminder &&
      validPreferStudyHours
    );
  };
  useEffect(() => {
    onFormComplete(checkFormCompletion());
  }, [
    offDays,
    preferStudyHours,
    notificationReminder,
    studyStartTime,
    studyEndTime,
    selectedCourses,
  ]);

  return (
    <div className="user-preferences-form">
      {/* Study Preferences */}
      <Card className="preferences-card">
        <CardHeader>
          <CardTitle className="section-title">Study Preferences</CardTitle>
        </CardHeader>
        <CardContent className="preferences-content">
          <div className="off-days-section">
            <Label className="section-label">Off Days</Label>
            <div className="days-grid">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleOffDay(day)}
                  className={`day-button ${
                    offDays.includes(day) ? "selected" : ""
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="preferences-grid">
            <div className="input-group">
              <Label htmlFor="preferStudyHours">
                Preferred Study Hours (per day)
              </Label>
              <Input
                id="preferStudyHours"
                type="number"
                min="1"
                max="12"
                value={preferStudyHours}
                onChange={(e) => setPreferStudyHours(e.target.value)}
                placeholder="e.g., 4"
                className="form-input"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="notificationReminder">
                Notification Reminder (minutes)
              </Label>
              <Input
                id="notificationReminder"
                type="number"
                min="5"
                max="120"
                value={notificationReminder}
                onChange={(e) => setNotificationReminder(e.target.value)}
                placeholder="e.g., 15"
                className="form-input"
              />
            </div>
          </div>

          <div className="preferences-grid">
            <div className="input-group">
              <Label htmlFor="studyStartTime">Preferred Study Start Time</Label>
              <Input
                id="studyStartTime"
                type="time"
                value={studyStartTime}
                onChange={(e) => setStudyStartTime(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="studyEndTime">Preferred Study End Time</Label>
              <Input
                id="studyEndTime"
                type="time"
                value={studyEndTime}
                onChange={(e) => setStudyEndTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses */}
      <Card className="courses-card">
        <CardHeader className="courses-header">
          <CardTitle className="section-title">Course Schedule</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCourse}
            className="add-course-button"
          >
            <Plus className="button-icon" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent className="courses-content">
          {selectedCourses.map((course, index) => {
            const selectedCourseData = mockCourses.find(
              (c) => c.id === course.courseId
            );

            return (
              <Card key={course.id} className="course-card">
                <div className="course-header">
                  <h4 className="course-title">Course {index + 1}</h4>
                  {selectedCourses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCourse(course.id)}
                      className="remove-course-button"
                    >
                      <Trash2 className="button-icon" />
                    </Button>
                  )}
                </div>

                <div className="course-grid">
                  <div className="input-group">
                    <Label htmlFor={`course-${course.id}`}>Select Course</Label>
                    <Select
                      value={course.courseId}
                      onValueChange={(value) =>
                        updateCourse(course.id, "courseId", value)
                      }
                    >
                      <SelectTrigger className="select-trigger">
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCourses.map((mockCourse) => (
                          <SelectItem key={mockCourse.id} value={mockCourse.id}>
                            {mockCourse.code} - {mockCourse.name} (
                            {mockCourse.credits} credits)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="time-grid">
                    <div className="input-group">
                      <Label htmlFor={`courseStartTime-${course.id}`}>
                        Start Time
                      </Label>
                      <Input
                        id={`courseStartTime-${course.id}`}
                        type="time"
                        value={course.startTime}
                        onChange={(e) =>
                          updateCourse(course.id, "startTime", e.target.value)
                        }
                        className="form-input"
                      />
                    </div>

                    <div className="input-group">
                      <Label htmlFor={`courseEndTime-${course.id}`}>
                        End Time
                      </Label>
                      <Input
                        id={`courseEndTime-${course.id}`}
                        type="time"
                        value={course.endTime}
                        onChange={(e) =>
                          updateCourse(course.id, "endTime", e.target.value)
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="course-details-grid">
                    <div className="input-group">
                      <Label htmlFor={`courseDay-${course.id}`}>
                        Class Day
                      </Label>
                      <Select
                        value={course.day}
                        onValueChange={(value) =>
                          updateCourse(course.id, "day", value)
                        }
                      >
                        <SelectTrigger className="select-trigger">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="input-group">
                      <Label htmlFor={`courseLocation-${course.id}`}>
                        Location
                      </Label>
                      <Input
                        id={`courseLocation-${course.id}`}
                        value={course.location}
                        onChange={(e) =>
                          updateCourse(course.id, "location", e.target.value)
                        }
                        placeholder="e.g., Room 101, Building A"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepUserPreferencesForm;
