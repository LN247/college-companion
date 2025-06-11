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
import AddSemester from "/src/pages/AddSemester.jsx";
import UserProfileForm from "./pages/UserProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/user-profile" element={<UserProfileForm />} />
      <Route path="*" element={<Notfound />} />
      <Route
        path="/add-semester"
        element={
          <ProtectedRoute>
            <AddSemester />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/college-life"
        element={
          <ProtectedRoute>
            <CollegeLife />
          </ProtectedRoute>
        }
      />
      <Route
        path="/semester-plan"
        element={
          <ProtectedRoute>
            <SemesterPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpCenter />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
