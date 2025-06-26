import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserAnalytics from "../components/UserAnalytics";
import {
  FaCalendar,
  FaChartLine,
  FaClock,
  FaGraduationCap,
  FaCalendarAlt,
  FaBell,
  FaTimes,
  FaTable,
  FaBars,
  FaUserCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import "../Styles/Dashboard.css";
import { onMessageListener } from "../utils/firebase";
import UserContext from "../context/UserContext";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showRelativeTime, setShowRelativeTime] = useState(true);

  const navItems = [
    { name: "College-Life", icon: <FaGraduationCap />, route: "/chat" },
    { name: "Semester-Plan", icon: <FaCalendarAlt />, route: "/semester-plan" },
    { name: "Progress", icon: <FaChartLine />, route: "/progress" },
    { name: "Timetable", icon: <FaTable />, route: "/timetable" },
    { name: "Notification", icon: <FaBell />, route: "/notifications" },
    { name: "Help Center", icon: <FaQuestionCircle />, route: "/help" },
  ];

  const API_BASE = "http://localhost:8000/api";
  const semesterEnd = "2025-06-26T23:59:59"; // Example semester end date

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    onMessageListener().then((payload) => {
      alert(`New notification: ${payload.notification.title}`);
    });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMobileMenu = (
    <React.Fragment>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <Box className="mobileDrawer">
          <IconButton onClick={handleDrawerToggle} className="closeButton">
            <FaTimes />
          </IconButton>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.route);
                    setMobileOpen(false);
                  }}
                >
                  <ListItemIcon className="menuIcon">{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );

  const renderDesktopMenu = (
    <React.Fragment>
      <Box className="desktopMenu">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="menuItem"
            onClick={() => navigate(item.route)}
            style={{ cursor: "pointer" }}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </Box>
    </React.Fragment>
  );

  // Function to calculate time left until semester end
  const calculateTimeLeft = () => {
    const difference = +new Date(semesterEnd) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  // Mock data - recent activities (declared only once)
  const recentActivities = [
    {
      action: "Created a study plan",
      timestamp: new Date(Date.now() - 7200000),
      type: "plan",
    },
    {
      action: "Updated timetable",
      timestamp: new Date(Date.now() - 86400000),
      type: "timetable",
    },
    {
      action: "Completed assignment",
      timestamp: new Date(Date.now() - 172800000),
      type: "assignment",
    },
    {
      action: "Joined study group",
      timestamp: new Date(Date.now() - 259200000),
      type: "group",
    },
    {
      action: "Set exam reminder",
      timestamp: new Date(Date.now() - 345600000),
      type: "reminder",
    },
  ];

  const tipOfTheDay = {
    tip: "Break your study sessions into 25-minute intervals with 5-minute breaks for better focus.",
    author: "Pomodoro Technique",
  };

  const formatTimestamp = (date) => {
    if (showRelativeTime) {
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return "just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
    return date.toLocaleString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "plan":
        return <FaCalendar />;
      case "timetable":
        return <FaTable />;
      case "assignment":
        return <FaGraduationCap />;
      case "group":
        return <FaUserCircle />;
      case "reminder":
        return <FaBell />;
      default:
        return <FaClock />;
    }
  };

  return (
    <div className="dashboardContainer">
      {/* App Bar */}
      <AppBar position="static" className="appBar">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              className="menuButton"
            >
              <FaBars />
            </IconButton>
          )}
          <Typography variant="h6" className="title">
            Academic Dashboard
          </Typography>
          <div className="countdown">
            <span>{timeLeft.days}d</span>
            <span>{timeLeft.hours}h</span>
            <span>{timeLeft.minutes}m</span>
            <span>{timeLeft.seconds}s</span>
            <Typography variant="caption">Until Semester End</Typography>
          </div>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
            className="profileButton"
          >
            <FaUserCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className="profileMenu"
          >
            <MenuItem onClick={handleMenuClose}>
              <div className="userInfo">
                <Avatar className="avatar">
                  {user && user.username
                    ? String(user.username).charAt(0)
                    : "?"}
                </Avatar>

                <div>
                  <Typography variant="subtitle1">{user.username}</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </div>
              </div>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile && renderMobileMenu}

      <main className="mainContent">
        {!isMobile && renderDesktopMenu}

        <div className="welcome-section">
          <h1>Welcome, {user?.name || "Student"}</h1>
          <p className="date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <UserAnalytics />

        <div className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button
              className="time-toggle"
              onClick={() => setShowRelativeTime(!showRelativeTime)}
            >
              {showRelativeTime ? "Show Absolute Time" : "Show Relative Time"}
            </button>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span className="timestamp">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tip-section">
          <Card className="tip-card styled-tip-card">
            <h2 className="tip-heading">✨ Tip of the Day ✨</h2>
            <CardContent>
              {tipOfTheDay ? (
                <>
                  <p className="tip-text">"{tipOfTheDay.tip}"</p>
                  <p className="tip-author">— {tipOfTheDay.author}</p>
                </>
              ) : (
                <p className="tip-text">Loading tip...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
