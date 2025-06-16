import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  BookOpen,
  Hash,
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import axios from "axios";
import "../Styles/CourseForm.css";
import {useAdmin} from "../context/AdminContext";

function CourseForm({ onFormComplete }) {
  // List of courses and editing state
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const { Courses, addCourses, updateCourses, deleteCourses } = useAdmin([]);
  // Course inputs and errors
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState("");
  const [semester, setSemester] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");

  const semesterOptions = ["Fall", "Spring", "Summer"];

  const academicLevelOptions = [
    "Freshman ",
    "Sophomore ",
    "Junior ",
    "Senior ",
    "Master",
    "PhD",
  ];

  const API_BASE = "http://127.0.0.1:8000/api";

  const totalFields = 5;
  const countCompletedFields = (data) => {
    return Object.values(data).filter(
      (value) =>
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "number" && !isNaN(value) && value !== "")
    ).length;
  };

  const isCourseFormComplete = () => {
    return (
      countCompletedFields({
        courseName,
        courseCode,
        credits,
        semester,
        academicLevel,
      }) === totalFields
    );
  };

  // Track previous completion status to avoid infinite loop
  const prevComplete = useRef(isCourseFormComplete());

  useEffect(() => {
    // Form is only complete if there are at least 6 courses
    const complete = courses.length >= 6;
    if (prevComplete.current !== complete) {
      prevComplete.current = complete;
      onFormComplete(complete);
    }
  }, [courses, onFormComplete]);

  const [courseErrors, setCourseErrors] = useState({});

  // Editable row state & errors
  const [editRow, setEditRow] = useState({
    courseName: "",
    courseCode: "",
    credits: "",
    semester: "",
    academicLevel: "",
  });
  const [editErrors, setEditErrors] = useState({});

  // Validation helpers
  const validateCourse = useCallback((inputs) => {
    const errors = {};
    if (!inputs.courseName.trim())
      errors.courseName = "Course Name is required";
    if (!inputs.courseCode.trim())
      errors.courseCode = "Course Code is required";
    if (inputs.credits === "") errors.credits = "Credits is required";
    else if (isNaN(Number(inputs.credits)) || Number(inputs.credits) < 0)
      errors.credits = "Credits must be 0 or more";
    if (!inputs.semester || inputs.semester.trim() === "")
      errors.semester = "Semester is required";
    if (!inputs.academicLevel || inputs.academicLevel.trim() === "")
      errors.academicLevel = "Academic Level is required";
    return errors;
  }, []);

  // Handle Add Course submit
  const handleAddCourse = useCallback(
    async (e) => {
      e.preventDefault();

      const courseErrors = validateCourse({
        courseName,
        courseCode,
        credits,
        semester,
        academicLevel,
      });

      setCourseErrors(courseErrors);

      if (Object.keys(courseErrors).length > 0) return;

      try {
        // Check if course already exists
        const courseExists = courses.some(
          (course) =>
            course.courseCode === courseCode || course.courseName === courseName
        );
        if (courseExists) {
          setCourseErrors((prev) => ({
            ...prev,
            courseName: "Course with this name or code already exists.",
          }));
          return;
        }
        // Add new course to the list
        if (courses.length >= 10) {
          setCourseErrors((prev) => ({
            ...prev,
            courseName: "You can only add up to 10 courses.",
          }));
          return;
        }

        const response = await axios.post(
          `${API_BASE}/courses/`,
          {
            name: courseName,
            code: courseCode,
            credits: credits,
            semester: semester,
            academicLevel: academicLevel,

          },
          { withCredentials: true }
        );


        setCourses((prev) => [
          ...prev,
          {
            courseName,
            courseCode,
            credits,
            semester,
            academicLevel,

          },
        ]);
        setCourseName("");
        setCourseCode("");
        setCredits("");
        setSemester("");
        setAcademicLevel("");
        setCourseErrors({});
      } catch (error) {
        setCourseErrors((prev) => ({
          ...prev,
          courseName: "Failed to add course. Please try again.",
        }));
      }

    },
    [
      courseName,
      courseCode,
      credits,
      semester,
      academicLevel,
      validateCourse,
      courses,

    ]
  );

  // Start editing a row
  const handleEditClick = useCallback(
    (index) => {
      setEditingIndex(index);
      setEditRow({ ...courses[index] });
      setEditErrors({});
    },
    [courses]
  );

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditErrors({});
  }, []);

  // Save edited course
  const handleSaveEdit = useCallback(
    (index) => {
      const errors = validateCourse(editRow);
      setEditErrors(errors);

      if (Object.keys(errors).length > 0) return;

      // Make API call to save edited course
      axios
        .patch(`${API_BASE}/courses/${courses[index].id}/`, {
          ...editRow,
          withCredentials: true,
        })
        .then((response) => {
          // Update local state with edited course
          setCourses((prev) => {
            const newCourses = [...prev];
            newCourses[index] = { ...editRow };
            return newCourses;
          });
          setEditingIndex(null);
        })
        .catch((error) => {
          console.error("Failed to save course:", error);
          setEditErrors((prev) => ({
            ...prev,
            courseName: "Failed to save course. Please try again.",
          }));
        });
    },
    [editRow, validateCourse, courses, API_BASE]
  );

  // Delete course
  const handleDelete = useCallback(
    (index) => {
      if (window.confirm("Are you sure you want to delete this course?")) {
        // Make API call to delete course if needed
        axios
          .delete(`${API_BASE}/courses/${courses[index].id}/`, {
            withCredentials: true,
          })
          .catch((error) => {
            console.error("Failed to delete course:", error);
          });
        // Update local state
        setCourses((prev) => prev.filter((_, i) => i !== index));
        if (editingIndex === index) handleCancelEdit();
      }
    },
    [courses, editingIndex, handleCancelEdit, API_BASE]
  );

  return (
    <div className="course-form-container">
      <div className="course-form-wrapper">
        {/* Add Course Form */}
        <Card className="course-form-card">
          <CardHeader className="course-form-header">
            <div className="course-form-icon-container">
              <BookOpen className="course-form-icon" />
            </div>
            <CardTitle className="course-form-title">Add a Course</CardTitle>
            <CardDescription className="course-form-description">
              Enter course details to add to your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCourse} className="course-form">
              <div className="course-form-grid">
                <div className="course-form-field course-form-field-full">
                  <Label htmlFor="courseName" className="input-label">
                    Course Name
                  </Label>
                  <div className="input-container">
                    <BookOpen className="input-icon" />
                    <Input
                      id="courseName"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="e.g., Introduction to Programming"
                      className="text-input"
                    />
                  </div>
                  {courseErrors.courseName && (
                    <p className="error-message">{courseErrors.courseName}</p>
                  )}
                </div>

                <div className="course-form-field">
                  <Label htmlFor="courseCode" className="input-label">
                    Course Code
                  </Label>
                  <div className="input-container">
                    <Hash className="input-icon" />
                    <Input
                      id="courseCode"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g., CS101"
                      className="text-input"
                    />
                  </div>
                  {courseErrors.courseCode && (
                    <p className="error-message">{courseErrors.courseCode}</p>
                  )}
                </div>

                <div className="course-form-field">
                  <Label htmlFor="credits" className="input-label">
                    Credits
                  </Label>
                  <div className="input-container">
                    <GraduationCap className="input-icon" />
                    <Input
                      id="credits"
                      type="number"
                      min="0"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      placeholder="3"
                      className="text-input"
                    />
                  </div>
                  {courseErrors.credits && (
                    <p className="error-message">{courseErrors.credits}</p>
                  )}
                </div>

                <div className="course-form-field">
                  <Label htmlFor="semester" className="input-label">
                    Semester
                  </Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger className="select-trigger">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {courseErrors.semester && (
                    <p className="error-message">{courseErrors.semester}</p>
                  )}
                </div>

                <div className="course-form-field">
                  <Label htmlFor="academicLevel" className="input-label">
                    Academic Level
                  </Label>
                  <Select
                    value={academicLevel}
                    onValueChange={setAcademicLevel}
                  >
                    <SelectTrigger className="select-trigger">
                      <SelectValue placeholder="Select Academic Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicLevelOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {courseErrors.academicLevel && (
                    <p className="error-message">
                      {courseErrors.academicLevel}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="submit-course">
                <Plus className="button-icon" />
                Add Course
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Courses List */}
        <Card className="course-list-card">
          <CardHeader>
            <CardTitle className="course-list-title">
              <BookOpen className="title-icon" />
              Course Schedule ({courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"})
            </CardTitle>
            <CardDescription className="course-list-description">
              Manage your enrolled courses for this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Courses.length === 0 ? (
              <div className="empty-state">
                <BookOpen className="empty-icon" />
                <h3 className="empty-title">No courses added yet</h3>
                <p className="empty-description">
                  Add your first course using the form above
                </p>
              </div>
            ) : (
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="table-header">
                        Course Name
                      </TableHead>
                      <TableHead className="table-header">
                        Course Code
                      </TableHead>
                      <TableHead className="table-header">Credits</TableHead>
                      <TableHead className="table-header">Semester</TableHead>
                      <TableHead className="table-header">
                        Academic Level
                      </TableHead>
                      <TableHead className="table-header actions-header">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Courses.map((course, index) => {
                      const isEditing = editingIndex === index;
                      return (
                        <TableRow key={index} className="table-row">
                          <TableCell>
                            {isEditing ? (
                              <div className="edit-field">
                                <Input
                                  value={editRow.courseName}
                                  onChange={(e) =>
                                    setEditRow((prev) => ({
                                      ...prev,
                                      courseName: e.target.value,
                                    }))
                                  }
                                  className="edit-input"
                                />
                                {editErrors.courseName && (
                                  <p className="field-error">
                                    {editErrors.courseName}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="course-name">
                                {course.name}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div className="edit-field">
                                <Input
                                  value={editRow.courseCode}
                                  onChange={(e) =>
                                    setEditRow((prev) => ({
                                      ...prev,
                                      courseCode: e.target.value,
                                    }))
                                  }
                                  className="edit-input"
                                />
                                {editErrors.courseCode && (
                                  <p className="field-error">
                                    {editErrors.courseCode}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="course-code">
                                {course.code}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div className="edit-field">
                                <Input
                                  type="number"
                                  min="0"
                                  value={editRow.credits}
                                  onChange={(e) =>
                                    setEditRow((prev) => ({
                                      ...prev,
                                      credits: e.target.value,
                                    }))
                                  }
                                  className="edit-input credits-input"
                                />
                                {editErrors.credits && (
                                  <p className="field-error">
                                    {editErrors.credits}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span>{course.credits}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div className="edit-field">
                                <Select
                                  value={editRow.semester}
                                  onValueChange={(value) =>
                                    setEditRow((prev) => ({
                                      ...prev,
                                      semester: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="edit-select-trigger">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {semesterOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {editErrors.semester && (
                                  <p className="field-error">
                                    {editErrors.semester}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span>{course.semester}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div className="edit-field">
                                <Select
                                  value={editRow.academicLevel}
                                  onValueChange={(value) =>
                                    setEditRow((prev) => ({
                                      ...prev,
                                      academicLevel: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="edit-select-trigger">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {academicLevelOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {editErrors.academicLevel && (
                                  <p className="field-error">
                                    {editErrors.academicLevel}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span>{course.academicLevel}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="action-buttons">
                              {isEditing ? (
                                <>
                                  <Button
                                    onClick={() => handleSaveEdit(index)}
                                    size="sm"
                                    className="icon-button save-button"
                                  >
                                    <Save className="action-icon" />
                                  </Button>
                                  <Button
                                    onClick={handleCancelEdit}
                                    size="sm"
                                    variant="outline"
                                    className="icon-button cancel-button"
                                  >
                                    <X className="action-icon" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleEditClick(index)}
                                    size="sm"
                                    variant="outline"
                                    className="icon-button edit-button"
                                  >
                                    <Edit3 className="action-icon" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(index)}
                                    size="sm"
                                    variant="outline"
                                    className="icon-button delete-button"
                                  >
                                    <Trash2 className="action-icon" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseForm;
