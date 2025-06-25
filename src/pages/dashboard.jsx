import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";
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
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  FaBars,
  FaUserCircle,
  FaGraduationCap,
  FaCalendarAlt,
  FaChartLine,
  FaTable,
  FaBell,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";

const SampleDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const user = { name: "John Doe", email: "john@university.edu" };

  // Semester end date (YYYY-MM-DD)
  const semesterEnd = "2023-12-15";

  // Navigation items
  const navItems = [
    { name: "College-Life", icon: <FaGraduationCap /> },
    { name: "Semester-Plan", icon: <FaCalendarAlt /> },
    { name: "Progress", icon: <FaChartLine /> },
    { name: "Timetable", icon: <FaTable /> },
    { name: "Notification", icon: <FaBell /> },
    { name: "Help Center", icon: <FaQuestionCircle /> },
  ];

  // Recent activities data
  const activities = [
    { id: 1, action: "Submitted Math Assignment", time: "2 hours ago" },
    { id: 2, action: "Completed Chemistry Quiz", time: "1 day ago" },
    { id: 3, action: "Joined Programming Club", time: "3 days ago" },
  ];

  // Tips data
  const tips = ["Plan your week every Monday morning"];

  // Calculate time until semester end
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
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
            <ListItem button key={item.name}>
              <ListItemIcon className="menuIcon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  const renderDesktopMenu = (
    <Box className="desktopMenu">
      {navItems.map((item) => (
        <div key={item.name} className="menuItem">
          {item.icon}
          <span>{item.name}</span>
        </div>
      ))}
    </Box>
  );

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
                <Avatar className="avatar">{user.name.charAt(0)}</Avatar>
                <div>
                  <Typography variant="subtitle1">{user.name}</Typography>
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

      {/* Mobile Navigation Drawer */}
      {isMobile && renderMobileMenu}

      {/* Main Content */}
      <main className="mainContent">
        {/* Desktop Navigation */}
        {!isMobile && renderDesktopMenu}

        {/* Dashboard Content */}
        <Grid container spacing={3} className="contentGrid">
          <Grid item xs={12} md={8}>
            <Card className="card">
              <CardContent>
                <Typography variant="h5" gutterBottom className="cardHeader">
                  Recent Activities
                </Typography>
                <div className="activityList">
                  {activities.map((activity) => (
                    <div key={activity.id} className="activityItem">
                      <div className="activityDot"></div>
                      <div>
                        <Typography>{activity.action}</Typography>
                        <Typography variant="body2" className="activityTime">
                          {activity.time}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="tipCard">
              <CardContent>
                <Typography variant="h5" gutterBottom className="cardHeader">
                  Tip of the Day
                </Typography>
                <div className="tipContent">
                  <div className="tipIcon">💡</div>
                  <Typography>
                    {tips[Math.floor(Math.random() * tips.length)]}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export { SampleDashboard };
