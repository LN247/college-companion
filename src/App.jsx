import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Notfound from "./pages/Notfound";
import Dashboard from "./pages/Dashboard";
import CollegeLife from "./pages/CollegeLife";
import SemesterPlan from "./pages/SemesterPlan";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Homepage from "./pages/Homepage";
import UserProfileForm from "./pages/UserProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/college-life" element={<CollegeLife />} />
      <Route path="/semester-plan" element={<SemesterPlan />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
