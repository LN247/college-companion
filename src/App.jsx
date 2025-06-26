import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Notfound from "./pages/Notfound";
import Dashboard from "./pages/dashboard";
import CollegeLife from "./pages/CollegeLife";
import SemesterPlan from "./pages/SemesterPlan";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./pages/Loadingpage";
import { useLoading } from "./context/LoadingContext";
import Notifications from "./pages/notifications";

// Optional: import if you have this file
// import UserProfileForm from "./pages/UserProfileForm";

const AppContent = () => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      {/* <Route path="/profile" element={<UserProfileForm />} /> */}

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
      
        <Route path="/college-life" element={<CollegeLife />} />
        <Route path="/semester-plan" element={<SemesterPlan />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpCenter />} />
  
      </Route>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notifications" element={<Notifications />} />
      {/* 404 Route */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
};

export default AppContent;
