import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    FaRobot,
} from "react-icons/fa";
import axios from "axios";
import { onMessageListener } from "../utils/firebase";
import {
  AppBar,
  Toolbar,
  IconButton,
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
import UserContext from "../context/UserContext";
import {useToast} from "@/hooks/use-toast.js";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showRelativeTime, setShowRelativeTime] = useState(true);
  const [tipOfTheDay, setTipOfTheDay] = useState({
    tip: '',
    author: 'AdviceSlip'
  });

  const navItems = [
    { name: "College-Life", icon: <FaGraduationCap />, route: "/chat" },
    { name: "Semester-Plan", icon: <FaCalendarAlt />, route: "/semester-plan" },
    { name: "Progress", icon: <FaChartLine />, route: "/progress" },
    { name: "Timetable", icon: <FaTable />, route: "/timetable" },
    { name: "Notification", icon: <FaBell />, route: "/notifications" },
    { name: "AI Assistant", icon: <FaRobot />, route: "/My assistant " },
  ];


  const semesterEnd = "2025-06-28T23:59:59";
  const {addtoast}=useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);




  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then((res) => res.json())
      .then((data) => {
        if (data.slip) {
          setTipOfTheDay({
            tip: data.slip.advice,
            author: "Advice Slip",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching tip:", error);
      });
  }, []);





    const [notifications, setNotifications] = useState([]);
     useEffect(() => {
    const listen = async () => {
      try {
        const payload = await onMessageListener();
        const incoming = {
          title: payload.notification.title,
          body: payload.notification.body,
          timestamp: new Date().toISOString(),
        };

        setNotifications((prev) => {
          const updated = [incoming, ...prev];
          localStorage.setItem("notifications", JSON.stringify(updated));
          return updated;
        });

           addtoast({
          title: incoming.title,
          description: incoming.body,
          variant: "default",
        });
      } catch (error) {
        console.error("Notification listener error:", error);
      }
    };

    listen();
  }, );

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
    <div className="dashboard-container dashboard-pro__container">
      <AppBar position="static" className="appBar dashboard-pro__appbar">
        <Toolbar className="dashboard-pro__toolbar">
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} className="dashboard-pro__menu-btn">
              <FaBars />
            </IconButton>
          <Typography variant="h6" className="title dashboard-pro__title">
            Student Dashboard
          </Typography>
          <div className="dashboard-pro__profile-btn" onClick={handleProfileMenuOpen}>
            <Avatar className="dashboard-pro__avatar" src={user?.avatar || ''}>
              {user?.name?.[0] || <FaUserCircle />}
            </Avatar>
          </div>
        </Toolbar>
      </AppBar>
      {isMobile ? renderMobileMenu : renderDesktopMenu}
      <main className="mainContent dashboard-pro__main-content">
        <section className="dashboard-pro__analytics-section">
          <div className="dashboard-pro__analytics-grid">
            <div className="dashboard-pro__analytics-card dashboard-pro__analytics-card--courses">
              <FaGraduationCap className="dashboard-pro__analytics-icon" />
              <div>
                <h3>Courses</h3>
                <div className="dashboard-pro__analytics-value">{user?.courses?.length || 0}</div>
              </div>
            </div>
            <div className="dashboard-pro__analytics-card dashboard-pro__analytics-card--progress">
              <FaChartLine className="dashboard-pro__analytics-icon" />
              <div>
                <h3>Progress</h3>
                <div className="dashboard-pro__analytics-value">{user?.progress || 'N/A'}</div>
              </div>
            </div>
            <div className="dashboard-pro__analytics-card dashboard-pro__analytics-card--timetable">
              <FaTable className="dashboard-pro__analytics-icon" />
              <div>
                <h3>Timetable</h3>
                <div className="dashboard-pro__analytics-value">{user?.timetable?.length || 0}</div>
              </div>
            </div>
            <div className="dashboard-pro__analytics-card dashboard-pro__analytics-card--notifications">
              <FaBell className="dashboard-pro__analytics-icon" />
                      <div>
                <h3>Notifications</h3>
                <div className="dashboard-pro__analytics-value">{notifications.length}</div>
              </div>
                      </div>
                    </div>
        </section>
        <section className="dashboard-pro__activity-section">
          <div className="section-header">
            <h2>Recent Activities</h2>
          </div>
          <ul className="dashboard-pro__activity-list">
            {recentActivities.map((activity, idx) => (
              <li key={idx} className="dashboard-pro__activity-item">
                <span className={`dashboard-pro__activity-icon dashboard-pro__activity-icon--${activity.type}`}>{getActivityIcon(activity.type)}</span>
                <div className="dashboard-pro__activity-content">
                  <p>{activity.action}</p>
                  <span className="dashboard-pro__timestamp">{formatTimestamp(activity.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
 <section className="dashboard-pro__notifications-section">
  <div className="section-header">
    <h2>Notifications</h2>
  </div>
  <ul className="dashboard-pro__notifications-list">

    {/* Tip of the Day */}
    {tipOfTheDay.tip && (
      <li className="dashboard-pro__notification-item tip-of-the-day">
        <FaBell className="dashboard-pro__notification-icon" />
        <div className="dashboard-pro__notification-content">
          <p><strong> Tip of the Day:</strong> {tipOfTheDay.tip}</p>
          <span className="dashboard-pro__timestamp">— {tipOfTheDay.author}</span>
        </div>
      </li>
    )}
  </ul>
</section>

      </main>
    </div>
  );
};

export default Dashboard;
