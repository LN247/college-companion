import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  Plus,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import "../Styles/SemesterPlan.css";

const Timetable = () => {
  const [activeTab, setActiveTab] = useState("generated");
  const [newTask, setNewTask] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskDueTime, setNewTaskDueTime] = useState("");
  const [newTaskReminderDate, setNewTaskReminderDate] = useState("");
  const [newTaskReminderTime, setNewTaskReminderTime] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("fall-2024");
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const semesters = [];

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const schedule = {};

  const handleAddTask = () => {
    if (newTask.trim() && newTaskDueDate && newTaskDueTime) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          dueDate: newTaskDueDate,
          dueTime: newTaskDueTime,
          reminderDate: newTaskReminderDate || newTaskDueDate,
          reminderTime: newTaskReminderTime || "09:00",
          completed: false,
        },
      ]);
      setNewTask("");
      setNewTaskDueDate("");
      setNewTaskDueTime("");
      setNewTaskReminderDate("");
      setNewTaskReminderTime("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePreviousSemester = () => {
    const currentIndex = semesters.findIndex(
      (s) => s.value === selectedSemester
    );
    if (currentIndex < semesters.length - 1) {
      setSelectedSemester(semesters[currentIndex + 1].value);
    }
  };

  const handleNextSemester = () => {
    const currentIndex = semesters.findIndex(
      (s) => s.value === selectedSemester
    );
    if (currentIndex > 0) {
      setSelectedSemester(semesters[currentIndex - 1].value);
    }
  };

  const currentSemester = semesters.find((s) => s.value === selectedSemester);

  return (
    <div className="timetable-container">
      {/* Header */}
      <div className="timetable-header">
        <div className="header-container">
          <div className="header-logo">
            <Calendar className="logo-icon" />
            <span className="logo-text">PlannedCourse</span>
          </div>

          <div className="header-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate("/add-semester");
              }}
              className="notification-btn"
            >
              <Plus className="logo-icon"></Plus>
              Add semester
            </Button>
          </div>
        </div>
      </div>

      <div className="timetable-content">
        <div className="layout-container">
          {/* Main Content */}
          <div className="main-content">
            {/* Page Header with Navigation */}
            <div className="page-header">
              <div className="header-text">
                <h1 className="page-title">Timetable</h1>
                <p className="page-subtitle">
                  Manage your courses and generate timetables
                </p>
              </div>

              {/* Semester Navigation */}
              <div className="semester-nav">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousSemester}
                  disabled={
                    semesters.findIndex((s) => s.value === selectedSemester) ===
                    semesters.length - 1
                  }
                  className="nav-arrow"
                >
                  <ChevronLeft className="arrow-icon" />
                </Button>

                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger className="semester-select">
                    <SelectValue>
                      <div className="select-content">
                        <span className="semester-label">
                          {currentSemester?.label}
                        </span>
                        <span
                          className={`semester-status ${
                            currentSemester?.status === "Completed"
                              ? "completed"
                              : "in-progress"
                          }`}
                        >
                          {currentSemester?.status}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem
                        key={semester.value}
                        value={semester.value}
                        className="semester-item"
                      >
                        <div className="select-content">
                          <span>{semester.label}</span>
                          <span
                            className={`semester-status ${
                              semester.status === "Completed"
                                ? "completed"
                                : "in-progress"
                            }`}
                          >
                            {semester.status}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextSemester}
                  disabled={
                    semesters.findIndex((s) => s.value === selectedSemester) ===
                    0
                  }
                  className="nav-arrow"
                >
                  <ChevronRight className="arrow-icon" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <div className="tabs">
                <button
                  onClick={() => setActiveTab("generated")}
                  className={`tab ${activeTab === "generated" ? "active" : ""}`}
                >
                  Generated Timetable
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`tab ${activeTab === "saved" ? "active" : ""}`}
                >
                  Saved Timetables
                </button>
              </div>
            </div>

            {/* Timetable Grid */}
            {activeTab === "generated" && (
              <Card className="timetable-card">
                <CardContent className="card-content">
                  <div className="table-container">
                    <table className="timetable-table">
                      <thead>
                        <tr className="table-header">
                          <th className="time-header">Time</th>
                          {weekDays.map((day) => (
                            <th key={day} className="day-header">
                              <span className="day-full">{day}</span>
                              <span className="day-short">
                                {day.slice(0, 3)}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time) => (
                          <tr key={time} className="table-row">
                            <td className="time-cell">{time}</td>
                            {weekDays.map((day) => {
                              const course = schedule[time]?.[day];
                              return (
                                <td
                                  key={`${time}-${day}`}
                                  className="course-cell"
                                >
                                  {course && (
                                    <div className="course-badge">{course}</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "saved" && (
              <div className="empty-state">
                <Calendar className="empty-icon" />
                <p className="empty-text">No saved timetables yet</p>
                <p className="empty-subtext">
                  Generate and save your first timetable
                </p>
              </div>
            )}

            {/* Tasks Section */}
            <Card className="tasks-card">
              <CardHeader>
                <CardTitle className="tasks-title">
                  <CheckSquare className="tasks-icon" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="tasks-content">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-item ${task.completed ? "completed" : ""}`}
                  >
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="task-checkbox"
                    >
                      {task.completed && (
                        <CheckSquare className="checkbox-icon" />
                      )}
                    </button>
                    <div className="task-details">
                      <p className="task-title">{task.title}</p>
                      <div className="task-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>
                            Due: {formatDate(task.dueDate)} at{" "}
                            {formatTime(task.dueTime)}
                          </span>
                        </div>
                        <div className="meta-item">
                          <Bell className="meta-icon" />
                          <span>
                            Reminder: {formatDate(task.reminderDate)} at{" "}
                            {formatTime(task.reminderTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Task Form */}
                <div className="task-form">
                  <Input
                    placeholder="Add a new task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="task-input"
                  />

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Due Date</label>
                      <Input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Due Time</label>
                      <Input
                        type="time"
                        value={newTaskDueTime}
                        onChange={(e) => setNewTaskDueTime(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Reminder Date</label>
                      <Input
                        type="date"
                        value={newTaskReminderDate}
                        onChange={(e) => setNewTaskReminderDate(e.target.value)}
                        placeholder="Optional"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reminder Time</label>
                      <Input
                        type="time"
                        value={newTaskReminderTime}
                        onChange={(e) => setNewTaskReminderTime(e.target.value)}
                        placeholder="09:00"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAddTask}
                    className="add-task-btn"
                    disabled={
                      !newTask.trim() || !newTaskDueDate || !newTaskDueTime
                    }
                  >
                    <Plus className="btn-icon" />
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
