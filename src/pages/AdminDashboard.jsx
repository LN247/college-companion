import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  UserPlus,
  GraduationCap,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import "../Styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalCourses: 156,
    totalSemesters: 8,
    newUsersThisMonth: 89,
    courseRegistrations: 2341,
    averageGPA: 3.42,
    completionRate: 87.5,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "user_registration",
      user: "John Doe",
      action: "registered for CS101",
      time: "2 minutes ago",
      icon: UserPlus,
    },
    {
      id: 2,
      type: "course_creation",
      user: "Dr. Smith",
      action: "created new course: Advanced Algorithms",
      time: "15 minutes ago",
      icon: BookOpen,
    },
    {
      id: 3,
      type: "semester_start",
      user: "System",
      action: "Fall 2024 semester started",
      time: "1 hour ago",
      icon: Calendar,
    },
    {
      id: 4,
      type: "grade_submission",
      user: "Prof. Johnson",
      action: "submitted grades for Math 201",
      time: "2 hours ago",
      icon: GraduationCap,
    },
  ]);

  const [topCourses, setTopCourses] = useState([
    { name: "Introduction to Programming", students: 156, rating: 4.8 },
    { name: "Data Structures", students: 134, rating: 4.6 },
    { name: "Calculus I", students: 128, rating: 4.4 },
    { name: "English Composition", students: 112, rating: 4.7 },
    { name: "Physics I", students: 98, rating: 4.3 },
  ]);

  const [userGrowth, setUserGrowth] = useState([
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1250 },
    { month: "Mar", users: 1300 },
    { month: "Apr", users: 1280 },
    { month: "May", users: 1350 },
    { month: "Jun", users: 1400 },
    { month: "Jul", users: 1380 },
    { month: "Aug", users: 1450 },
    { month: "Sep", users: 1500 },
    { month: "Oct", users: 1550 },
    { month: "Nov", users: 1600 },
    { month: "Dec", users: 1650 },
  ]);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Monitor and manage your academic platform
            </p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-action-btn">
              <Bell />
              Notifications
            </button>
            <button className="admin-action-btn">
              <Settings />
              Settings
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="analytics-overview">
          <div className="analytics-card primary">
            <div className="analytics-icon">
              <Users />
            </div>
            <div className="analytics-content">
              <h3 className="analytics-number">{stats.totalUsers.toLocaleString()}</h3>
              <p className="analytics-label">Total Users</p>
              <div className="analytics-trend positive">
                <ArrowUp />
                <span>+12.5%</span>
                <span className="trend-period">this month</span>
              </div>
            </div>
          </div>

          <div className="analytics-card success">
            <div className="analytics-icon">
              <BookOpen />
            </div>
            <div className="analytics-content">
              <h3 className="analytics-number">{stats.totalCourses}</h3>
              <p className="analytics-label">Active Courses</p>
              <div className="analytics-trend positive">
                <ArrowUp />
                <span>+8.3%</span>
                <span className="trend-period">this month</span>
              </div>
            </div>
          </div>

          <div className="analytics-card warning">
            <div className="analytics-icon">
              <Calendar />
            </div>
            <div className="analytics-content">
              <h3 className="analytics-number">{stats.totalSemesters}</h3>
              <p className="analytics-label">Active Semesters</p>
              <div className="analytics-trend neutral">
                <span>0%</span>
                <span className="trend-period">this month</span>
              </div>
            </div>
          </div>

          <div className="analytics-card info">
            <div className="analytics-icon">
              <TrendingUp />
            </div>
            <div className="analytics-content">
              <h3 className="analytics-number">{stats.courseRegistrations.toLocaleString()}</h3>
              <p className="analytics-label">Course Registrations</p>
              <div className="analytics-trend positive">
                <ArrowUp />
                <span>+15.2%</span>
                <span className="trend-period">this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="detailed-stats">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <Activity />
                Platform Performance
              </h3>
            </div>
            <div className="stats-card-content">
              <div className="stat-item">
                <div className="stat-label">Active Users</div>
                <div className="stat-value">{stats.activeUsers}</div>
                <div className="stat-percentage">71.5% of total</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">New Users (This Month)</div>
                <div className="stat-value">{stats.newUsersThisMonth}</div>
                <div className="stat-percentage">+7.1% growth</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Average GPA</div>
                <div className="stat-value">{stats.averageGPA}</div>
                <div className="stat-percentage">Good performance</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Completion Rate</div>
                <div className="stat-value">{stats.completionRate}%</div>
                <div className="stat-percentage">Excellent</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <BarChart3 />
                Top Courses
              </h3>
            </div>
            <div className="stats-card-content">
              {topCourses.map((course, index) => (
                <div key={index} className="course-stat-item">
                  <div className="course-info">
                    <div className="course-name">{course.name}</div>
                    <div className="course-students">{course.students} students</div>
                  </div>
                  <div className="course-rating">
                    <span className="rating-stars">★★★★★</span>
                    <span className="rating-number">{course.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <div className="section-header">
            <h2 className="section-title">
              <Activity />
              Recent Activity
            </h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <activity.icon />
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.user}</strong> {activity.action}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="quick-action-btn">
              <Plus />
              Add New Course
            </button>
            <button className="quick-action-btn">
              <UserPlus />
              Add New User
            </button>
            <button className="quick-action-btn">
              <Calendar />
              Create Semester
            </button>
            <button className="quick-action-btn">
              <Download />
              Export Data
            </button>
            <button className="quick-action-btn">
              <Eye />
              View Reports
            </button>
            <button className="quick-action-btn">
              <Settings />
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 