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
import AddSemester from "./pages/AddSemester";
import UserProfileForm from "./pages/UserProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./pages/Loadingpage";
import { LoadingProvider } from "./context/LoadingContext";
import { useLoading } from "./context/LoadingContext";
import ErrorBoundary from "./components/ErrorBoundary";

const AppContent = () => {
  const { isLoading } = useLoading();

  return (
    <ErrorBoundary>
      {isLoading && <LoadingScreen />}
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
              <Dashboard />
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
    </ErrorBoundary>
  );
};

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
