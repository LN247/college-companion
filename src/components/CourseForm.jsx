import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  BookOpen,
  Hash,
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Contact,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import axios from "axios";
import { Button } from "./ui/Button";
import InputWithError from "./InputwithError";
import TableCellInput from "./TabelCellInput";

function CourseForm({ onFormComplete, semesterId }) {
  // List of courses and editing state
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Course inputs and errors
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credits, setCredits] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api";

  const totalFields = 4;
  const countCompletedFields = (data) => {
    return Object.values(data).filter((value) => value.trim() !== "").length;
  };
  const isCourseFormComplete = () => {
    return (
      countCompletedFields({ courseName, courseCode, credits, difficulty }) ===
      totalFields
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
    difficulty: "",
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
    else if (isNaN(inputs.credits) || Number(inputs.credits) < 0)
      errors.credits = "Credits must be 0 or more";
    if (!inputs.difficulty.trim()) errors.difficulty = "Difficulty is required";
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
        difficulty,
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
            course_name: courseName,
            course_code: courseCode,
            course_credits: credits,
            course_timings: timings,
            semester: semesterId,
          },
          { withCredentials: true }
        );

        setCourses((prev) => [
          ...prev,
          { courseName, courseCode, credits, timings, semester: semesterId },
        ]);
        setCourseName("");
        setCourseCode("");
        setCredits("");
        setTimings("");
        setCourseErrors({});
      } catch (error) {
        setCourseErrors((prev) => ({
          ...prev,
          courseName: "Failed to add course. Please try again.",
        }));
      }
    },
    [courseName, courseCode, credits, difficulty, validateCourse, courses]
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
        .put(`/api/courses/${courses[index].id}/`, {
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
    [editRow, validateCourse]
  );

  // Delete course
  const handleDelete = useCallback(
    (index) => {
      if (window.confirm("Are you sure you want to delete this course?")) {
        // Make API call to delete course if needed
        axios
          .delete(`/api/courses/${courses[index].id}/`, {
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
    [editingIndex, handleCancelEdit]
  );

  //

  const generateSchedule = () => {
    // Logic to generate course schedule
  };

  // Handlers for input fields
  const courseHandlers = {
    setCourseName,
    setCourseCode,
    setCredits,
    setDifficulty,
  };

  // Generate course list rows
  const courseList = useMemo(() => {
    return courses.map((course, index) => {
      const isEditing = editingIndex === index;
      return (
        <tr key={index} className="table-row">
          <td className="table-cell">
            {isEditing ? (
              <TableCellInput
                label="Course Name"
                value={editRow.courseName}
                onChange={(e) =>
                  setEditRow((prev) => ({
                    ...prev,
                    courseName: e.target.value,
                  }))
                }
                error={editErrors.courseName}
              />
            ) : (
              <span className="course-name">{course.courseName}</span>
            )}
          </td>
          <td className="table-cell">
            {isEditing ? (
              <TableCellInput
                label="Course Code"
                value={editRow.courseCode}
                onChange={(e) =>
                  setEditRow((prev) => ({
                    ...prev,
                    courseCode: e.target.value,
                  }))
                }
                error={editErrors.courseCode}
              />
            ) : (
              <span className="course-code">{course.courseCode}</span>
            )}
          </td>
          <td className="table-cell">
            {isEditing ? (
              <TableCellInput
                label="Credits"
                type="number"
                min="0"
                value={editRow.credits}
                onChange={(e) =>
                  setEditRow((prev) => ({
                    ...prev,
                    credits: e.target.value,
                  }))
                }
                error={editErrors.credits}
              />
            ) : (
              <span className="course-credits">{course.credits}</span>
            )}
          </td>
          <td className="table-cell">
            {isEditing ? (
              <TableCellInput
                label="Timings"
                value={editRow.difficulty}
                onChange={(e) =>
                  setEditRow((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
                error={editErrors.difficulty}
              />
            ) : (
              <span className="course-timings">{course.timings}</span>
            )}
          </td>
          <td className="table-cell actions-cell">
            <div className="action-buttons">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => handleSaveEdit(index)}
                    type="button"
                    size="sm"
                    className="action-btn save-btn"
                    aria-label="Save course"
                  >
                    <Save className="action-icon" />
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="action-btn cancel-btn"
                    aria-label="Cancel editing"
                  >
                    <X className="action-icon" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleEditClick(index)}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="action-btn edit-btn"
                    aria-label="Edit course"
                  >
                    <Edit3 className="action-icon" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(index)}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="action-btn delete-btn"
                    aria-label="Delete course"
                  >
                    <Trash2 className="action-icon" />
                  </Button>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    });
  }, [
    courses,
    editingIndex,
    editRow,
    editErrors,
    handleSaveEdit,
    handleCancelEdit,
    handleEditClick,
    handleDelete,
  ]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Add a Course</CardTitle>
          <CardDescription>
            Enter course details to add to your schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCourse}>
            <div className="course-inputs">
              <InputWithError
                id="courseName"
                label="Course Name"
                value={courseName}
                onChange={(e) => courseHandlers.setCourseName(e.target.value)}
                error={courseErrors.courseName}
                placeholder="e.g., Introduction to Programming"
                icon={BookOpen}
              />

              <div className="course-grid">
                <InputWithError
                  id="courseCode"
                  label="Course Code"
                  value={courseCode}
                  onChange={(e) => courseHandlers.setCourseCode(e.target.value)}
                  error={courseErrors.courseCode}
                  placeholder="e.g., CS101"
                  icon={Hash}
                />
                <InputWithError
                  id="credits"
                  label="Credits"
                  value={credits}
                  onChange={(e) => courseHandlers.setCredits(e.target.value)}
                  error={courseErrors.credits}
                  type="number"
                  min="0"
                  placeholder="3"
                  icon={GraduationCap}
                />
              </div>

              <InputWithError
                id="difficulty"
                label="Difficulty"
                value={difficulty}
                onChange={(e) => courseHandlers.setDifficulty(e.target.value)}
                error={courseErrors.difficulty}
                placeholder="e.g., Easy, Medium, Hard, Very Hard"
                icon={Contact}
              />
            </div>

            <Button type="submit" className="add-course-btn">
              <Plus className="btn-icon" />
              Add Course
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Added Courses Section */}
      <Card className="courses-card">
        <CardHeader className="card-header-emerald">
          <CardTitle className="card-title">
            <BookOpen className="header-icon" />
            Course Schedule ({courses.length}{" "}
            {courses.length === 1 ? "course" : "courses"})
          </CardTitle>
          <CardDescription className="header-description">
            Manage your enrolled courses for this semester
          </CardDescription>
        </CardHeader>
        <CardContent className="card-content">
          {courses.length === 0 ? (
            <div className="empty-courses">
              <BookOpen className="empty-icon" />
              <p className="empty-text">No courses added yet</p>
              <p className="empty-subtext">
                Add your first course using the form above
              </p>
            </div>
          ) : (
            <div className="courses-table-container">
              <table className="courses-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header">Course Name</th>
                    <th className="table-header">Course Code</th>
                    <th className="table-header">Credits</th>
                    <th className="table-header">Timings</th>
                    <th className="table-header actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>{courseList}</tbody>
              </table>
              <Button
                disabled={!isCourseFormComplete() || !semesterId}
                onClick={generateSchedule}
              >
                continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseForm;
