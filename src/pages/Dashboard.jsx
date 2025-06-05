import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaUser, FaCalendar, FaChartLine, FaClock, FaCog, FaGraduationCap, FaBook, FaCalendarAlt, FaFileAlt, FaChartBar, FaBell, FaSignOutAlt, FaQuestionCircle, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/Dashboard.css';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showRelativeTime, setShowRelativeTime] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({
    upcomingAssignments: 0,
    studyHours: 0,
    completedTasks: 0,
    upcomingExams: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const decoded = jwtDecode(token);
        setUserData({
          name: `${decoded.first_name} ${decoded.last_name}`,
          email: decoded.email,
          username: decoded.username
        });

        // Fetch analytics data
        // TODO: Replace with actual API call
        setAnalytics({
          upcomingAssignments: 3,
          studyHours: 12,
          completedTasks: 8,
          upcomingExams: 2
        });

        // Fetch notifications
        // TODO: Replace with actual API call
        const mockNotifications = [
          { id: 1, message: 'Assignment due in 2 days', type: 'assignment', timestamp: new Date(Date.now() - 3600000) },
          { id: 2, message: 'New study group invitation', type: 'group', timestamp: new Date(Date.now() - 7200000) },
          { id: 3, message: 'Exam schedule updated', type: 'exam', timestamp: new Date(Date.now() - 86400000) }
        ];
        setNotifications(mockNotifications);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Mock data - replace with actual API calls
  const recentActivities = [
    { action: 'Created a study plan', timestamp: new Date(Date.now() - 7200000), type: 'plan' },
    { action: 'Updated timetable', timestamp: new Date(Date.now() - 86400000), type: 'timetable' },
    { action: 'Completed assignment', timestamp: new Date(Date.now() - 172800000), type: 'assignment' },
    { action: 'Joined study group', timestamp: new Date(Date.now() - 259200000), type: 'group' },
    { action: 'Set exam reminder', timestamp: new Date(Date.now() - 345600000), type: 'reminder' }
  ];

  const tipOfTheDay = {
    tip: "Break your study sessions into 25-minute intervals with 5-minute breaks for better focus.",
    author: "Pomodoro Technique"
  };

  const formatTimestamp = (date) => {
    if (showRelativeTime) {
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
    return date.toLocaleString();
  };

  const menuItems = [
    { label: 'College Life', icon: <FaGraduationCap />, path: '/college-life', available: true },
    { label: 'Semester Plan', icon: <FaCalendar />, path: '/semester-plan', available: true },
    { label: 'Progress', icon: <FaChartLine />, path: '/progress', available: true },
    { label: 'Timetable', icon: <FaClock />, path: '/timetable', available: true },
    { label: 'Profile', icon: <FaUser />, path: '/profile', available: true },
    { label: 'Settings', icon: <FaCog />, path: '/settings', available: true },
    { label: 'Help Center', icon: <FaUser />, path: '/help', available: false }
  ];

  const featureIcons = [
    { label: 'College Life', icon: <FaGraduationCap />, path: '/college-life' },
    { label: 'Semester Plan', icon: <FaCalendar />, path: '/semester-plan' },
    { label: 'Progress', icon: <FaChartLine />, path: '/progress' },
    { label: 'Timetable', icon: <FaClock />, path: '/timetable' },
    { label: 'Profile', icon: <FaUser />, path: '/profile' },
    { label: 'Settings', icon: <FaCog />, path: '/settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Profile Menu */}
      <div className="profile-menu">
        <button 
          className="profile-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-controls="profile-dropdown"
        >
          <div className="flex items-center space-x-2">
            <FaUser className="text-gray-600" />
            <span>{userData?.name || 'Loading...'}</span>
            <FaChevronDown className="text-gray-600" />
          </div>
        </button>
        {isDropdownOpen && (
          <div className="profile-dropdown" id="profile-dropdown" role="menu">
            <div className="user-info p-4 border-b">
              <p className="font-semibold">{userData?.name}</p>
              <p className="text-sm text-gray-600">{userData?.email}</p>
            </div>
            <button
              className="menu-item"
              onClick={() => navigate('/profile')}
              role="menuitem"
            >
              <span className="menu-icon"><FaUser /></span>
              View Profile
            </button>
            <button
              className="menu-item"
              onClick={() => navigate('/college-life')}
              role="menuitem"
            >
              <span className="menu-icon"><FaGraduationCap /></span>
              College Life
            </button>
            <button
              className="menu-item"
              onClick={() => navigate('/semester-plan')}
              role="menuitem"
            >
              <span className="menu-icon"><FaCalendar /></span>
              Semester Plan
            </button>
            <button
              className="menu-item"
              onClick={() => navigate('/progress')}
              role="menuitem"
            >
              <span className="menu-icon"><FaChartLine /></span>
              Progress
            </button>
            <button
              className="menu-item"
              onClick={() => navigate('/timetable')}
              role="menuitem"
            >
              <span className="menu-icon"><FaClock /></span>
              Timetable
            </button>
            <button
              className="menu-item"
              onClick={() => navigate('/settings')}
              role="menuitem"
            >
              <span className="menu-icon"><FaCog /></span>
              Settings
            </button>
            <button
              className="menu-item"
              onClick={() => navigate('/help')}
              role="menuitem"
            >
              <span className="menu-icon"><FaQuestionCircle /></span>
              Help Center
            </button>
            <button
              className="menu-item text-red-500"
              onClick={handleLogout}
              role="menuitem"
            >
              <span className="menu-icon"><FaSignOutAlt /></span>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Welcome Message */}
      <div className="welcome-section">
        <h1>Welcome, {userData?.name || 'Student'}</h1>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Feature Icons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          className="feature-icon"
          onClick={() => navigate('/college-life')}
        >
          <div className="icon-wrapper">
            <FaGraduationCap />
          </div>
          <span>College Life</span>
        </div>
        <div 
          className="feature-icon"
          onClick={() => navigate('/semester-plan')}
        >
          <div className="icon-wrapper">
            <FaCalendarAlt />
          </div>
          <span>Semester Plan</span>
        </div>
        <div 
          className="feature-icon"
          onClick={() => navigate('/progress')}
        >
          <div className="icon-wrapper">
            <FaChartLine />
          </div>
          <span>Progress</span>
        </div>
        <div 
          className="feature-icon"
          onClick={() => navigate('/timetable')}
        >
          <div className="icon-wrapper">
            <FaClock />
          </div>
          <span>Timetable</span>
        </div>
        <div 
          className="feature-icon"
          onClick={() => navigate('/notifications')}
        >
          <div className="icon-wrapper">
            <FaBell />
          </div>
          <span>Notifications</span>
        </div>
        <div 
          className="feature-icon"
          onClick={() => navigate('/help')}
        >
          <div className="icon-wrapper">
            <FaQuestionCircle />
          </div>
          <span>Help Center</span>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button 
            className="time-toggle"
            onClick={() => setShowRelativeTime(!showRelativeTime)}
          >
            {showRelativeTime ? 'Show Absolute Time' : 'Show Relative Time'}
          </button>
        </div>
        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.type === 'plan' ? <FaCalendar /> : <FaClock />}</div>
              <div className="activity-content">
                <p>{activity.action}</p>
                <span className="timestamp">{formatTimestamp(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="tip-section">
        <h2>Tip of the Day</h2>
        <div className="tip-card">
          <p className="tip-text">{tipOfTheDay.tip}</p>
          <p className="tip-author">— {tipOfTheDay.author}</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h2>Analytics Overview</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-icon">
              <FaFileAlt />
            </div>
            <div className="analytics-content">
              <h3>Upcoming Assignments</h3>
              <p className="analytics-value">{analytics.upcomingAssignments}</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">
              <FaClock />
            </div>
            <div className="analytics-content">
              <h3>Study Hours</h3>
              <p className="analytics-value">{analytics.studyHours}h</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">
              <FaChartBar />
            </div>
            <div className="analytics-content">
              <h3>Completed Tasks</h3>
              <p className="analytics-value">{analytics.completedTasks}</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">
              <FaCalendar />
            </div>
            <div className="analytics-content">
              <h3>Upcoming Exams</h3>
              <p className="analytics-value">{analytics.upcomingExams}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <div className="section-header">
          <h2>Notifications</h2>
          <span className="notification-badge">{notifications.length}</span>
        </div>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <div className="notification-icon">
                <FaExclamationCircle />
              </div>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
