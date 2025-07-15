import React, { useContext, useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import axios from "axios";
import { Plus, Trash2, BookOpen, Edit3, Save, X, Clock, Calendar } from "lucide-react";
import "../Styles/CourseForm.css";
import {API_BASE} from "../consatants/Constants";
import userContext from "../context/UserContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CourseForm = ({ semester, level,onFormComplete }) => {
  const formRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCourseStepComplete, setIsCourseStepComplete] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    course: "",
    day: "",
    start_time: "",
    end_time: "",
    difficulty_level:"",
    semester:semester.semesterId,

  });




// Dynamically find the name of the selected course
const selectedCourseName = courses.find((c) => c.id === currentCourse.name)  ;


  // Fetch courses based on semester and level
  useEffect(() => {
    if (semester && level) {
      axios
        .get(`${API_BASE}/courses/?semester=${semester.semester_type}&academicLevel=${level}`,{withCredentials: true})
        .then((response) => {
          const fetchedCourses = Array.isArray(response.data) ? response.data : response.data.courses || [];
          setCourses(fetchedCourses);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    }
  }, [semester, level]);


    useEffect(() => {
    if (selectedCourses.length >= 2) {
      setIsCourseStepComplete(true);
      onFormComplete(true);
    } else {
      setIsCourseStepComplete(false);
      onFormComplete(false);
    }
  }, [selectedCourses, onFormComplete]);




  // Reset form
  const resetForm = () => {
    setCurrentCourse({
      course: "",
      day: "",
      start_time: "",
      end_time: "",
      difficulty_level: '',
      semester:semester.semesterId,
    });
    setEditingId(null);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add a new course
  const addCourse = () => {
    if (!currentCourse.course || !currentCourse.day || !currentCourse.start_time || !currentCourse.end_time|| !currentCourse.difficulty_level
) {
      alert("Please fill in all fields before adding the course.");
      return;
    }

    // Check for time conflicts
    const hasConflict = selectedCourses.some(existingCourse =>
      existingCourse.day === currentCourse.day &&
      ((currentCourse.start_time >= existingCourse.start_time && currentCourse.start_time < existingCourse.end_time) ||
       (currentCourse.end_time > existingCourse.start_time && currentCourse.end_time <= existingCourse.end_time) ||
       (currentCourse.start_time <= existingCourse.start_time && currentCourse.end_time >= existingCourse.end_time))
    );

    if (hasConflict) {
      alert("Time conflict detected! Please choose a different time slot.");
      return;
    }

    const newCourse = {
      ...currentCourse,
       day: currentCourse.day,
      start_time: currentCourse.start_time,
      end_time: currentCourse.end_time,
      difficulty_level: currentCourse.difficulty_level,
      semester: parseInt(semester.semesterId, 10)

    };

    setSelectedCourses([...selectedCourses, newCourse]);
    resetForm();
  };

  // Remove a course
  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  // Start editing a course
  const startEdit = (course) => {
    setCurrentCourse({ ...course ,semester:semester.semesterId,difficulty_level:course.level||"Medium"});
    setEditingId(course.id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Save edited course
  const saveEdit = () => {
    if (!currentCourse.course || !currentCourse.day || !currentCourse.startTime || !currentCourse.endTime) {
      alert("Please fill in all fields before saving.");
      return;
    }

    // Check for time conflicts (excluding the course being edited)
    const hasConflict = selectedCourses.some(existingCourse =>
      existingCourse.id !== editingId &&
      existingCourse.day === currentCourse.day &&
      ((currentCourse.start_time >= existingCourse.start_time && currentCourse.start_time < existingCourse.end_time) ||
       (currentCourse.end_time > existingCourse.start_time && currentCourse.end_time <= existingCourse.end_time) ||
       (currentCourse.start_time <= existingCourse.start_time && currentCourse.end_time >= existingCourse.end_time))
    );

    if (hasConflict) {
      alert("Time conflict detected! Please choose a different time slot.");
      return;
    }

    setSelectedCourses(selectedCourses.map(course =>
      course.id === editingId ? { ...currentCourse } : course
    ));
    resetForm();
  };

  // Update current course form
  const updateCurrentCourse = (field, value) => {
    setCurrentCourse(prev => ({ ...prev, [field]: value }));
  };

  // Format time for display
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedCourses.length === 0) {
    alert("Please add at least one course before submitting.");
    return;
  }

  try {
    await axios.post(
      `${API_BASE}/fixed-schedules/`,
       selectedCourses ,
      { withCredentials: true }
    );


    resetForm();
    alert(
      `Successfully added ${selectedCourses.length} course${
        selectedCourses.length !== 1 ? "s" : ""
      } to your schedule!`
    );
    console.log("Submitted Courses:", selectedCourses);
  } catch (error) {

    alert("Failed to add courses. Please try again.");
    console.error("Error submitting courses:", error);
  }
};


  return (
    <div className="course-form">
      {/* Header Section */}
      <div className="form-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <BookOpen className="header-icon" />
          </div>
          <div className="header-text">
            <h1>Course Management</h1>
            <p>Add and manage your course schedule</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{selectedCourses.length}</span>
              <span className="stat-label">Courses Added</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Form Section */}
      <Card className="form-card" ref={formRef}>
        <div className="form-card-header">
          <div className="form-title">
            <BookOpen size={20} />
            <h2>{editingId ? 'Edit Course' : 'Add New Course'}</h2>
          </div>
          {editingId && (
                  <Button
              onClick={resetForm}
              variant="ghost"
                    size="sm"
              className="cancel-edit-btn"
            >
              <X size={16} />
              Cancel Edit
                  </Button>
              )}
            </div>

        <div className="form-grid">
          <div className="form-group">
            <Label className="form-label">
              <BookOpen size={16} />
              Course Name
            </Label>
              <Select
                    onValueChange={(value) => setCurrentCourse({ ...currentCourse, course: value })}
                    value={currentCourse.course || ""}
                                     >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                       <SelectContent>
                       {courses.map((course) => (
                           <SelectItem key={course.id} value={course.id}>
                             {course.name}
                              </SelectItem>
                       ))}
                    </SelectContent>
                    </Select>

          </div>

          <div className="form-group">
            <Label className="form-label">
              <Calendar size={16} />
              Day of Week
            </Label>
            <Select
              value={currentCourse.day}
              onValueChange={(value) => updateCurrentCourse("day", value)}
            >
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label className="form-label">
              <Clock size={16} />
              Start Time
            </Label>
            <input
              type="time"
              className="form-input time-input"
              value={currentCourse.start_time}
              onChange={(e) => updateCurrentCourse("start_time", e.target.value)}
                />
              </div>

          <div className="form-group">
            <Label className="form-label">
              <Clock size={16} />
              End Time
            </Label>
            <input
              type="time"
              className="form-input time-input"
              value={currentCourse.end_time}
              onChange={(e) => updateCurrentCourse("end_time", e.target.value)}
              />
            </div>
        </div>

              <div className="mb-4">
  <Label htmlFor="difficulty_level">Difficulty Level</Label>
  <Select
    value={currentCourse.difficulty_level}
    onValueChange={(value) => setCurrentCourse({
      ...currentCourse,
      difficulty_level: value
    })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select difficulty level" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="easy">Easy</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="hard">Hard</SelectItem>
    </SelectContent>
  </Select>
</div>


        <div className="form-actions">
          {editingId ? (
            <Button onClick={saveEdit} className="primary-btn">
              <Save size={16} />
              Save Changes
            </Button>
          ) : (
            <Button onClick={addCourse} className="primary-btn">
              <Plus size={16} />
              Add Course
            </Button>
          )}
        </div>
      </Card>

      {/* Added Courses Section */}
      {selectedCourses.length > 0 && (
        <div className="added-courses-section">
          <div className="section-header">
            <h2>Added Courses</h2>
            <span className="course-count">{selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="courses-grid">
            {selectedCourses.map((course, index) => (
              <Card key={course.id} className={`course-card ${editingId === course.id ? 'editing' : ''}`}>
                <div className="course-card-header">
                  <div className="course-number">
                    <BookOpen size={16} />
                    <span>Course {index + 1}</span>
            </div>
                  <div className="course-actions">
                    <Button
                      onClick={() => startEdit(course)}
                      variant="ghost"
                      size="sm"
                      className="edit-btn"
                      disabled={editingId && editingId !== course.id}
                    >
                      <Edit3 size={16} />
                    </Button>
              <Button
                      onClick={() => removeCourse(course.id)}
                      variant="ghost"
                      size="sm"
                      className="delete-btn"
                      disabled={editingId && editingId !== course.id}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="course-details">
                  <div className="course-name">
                    <h3>{selectedCourseName}</h3>
                  </div>

                  <div className="course-schedule">
                    <div className="schedule-item">
                      <Calendar size={14} />
                      <span>{course.day}</span>
                    </div>
                    <div className="schedule-item">
                      <Clock size={14} />
                      <span>{formatTime(course.start_time)} - {formatTime(course.end_time)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="submit-section">
            <Button onClick={handleSubmit} className="submit-btn" disabled={!isCourseStepComplete}>
              <BookOpen size={16} />
              Submit All Courses
              </Button>
          </div>
            </div>
          )}
    </div>
  );
};

export default CourseForm;