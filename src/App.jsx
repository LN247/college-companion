import React from "react";

import { Routes, Route } from "react-router-dom";
import Resources from './pages/Resources';


import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Notfound from "./pages/Notfound";
import Dashboard from "./pages/dashboard";
import SemesterPlan from "./pages/SemesterPlan";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import AddSemester from "./pages/AddSemester.jsx";
import UserProfileForm from "./pages/UserProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoadingProvider } from "./context/LoadingContext";
import ChatPage  from  "./pages/ChatPage"
import { useLoading } from "./context/LoadingContext";
import Notifications from "./pages/notifications";
import { AdminProvider } from "./context/AdminContext";
import AcademicCalendar from "./components/AcademicCalendar";
import {UserProvider} from "./context/UserContext";

const AppContent = () => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/calendar" element={<AcademicCalendar />} />
        <Route path="*" element={<Notfound />} />
        <Route
          path="/add-semester"
          element={
            <ProtectedRoute>
              <AddSemester />
            </ProtectedRoute>
          }
        />

        <Route path="/chat" element={<ChatPage />} />

        {/* Fix: Remove <UserProvider> here */}
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfileForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timetable"
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
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminProvider>
                <AdminDashboard />
              </AdminProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
};


const AppProviders = ({ children }) => {
  return (
    <LoadingProvider>
      <UserProvider>{children}</UserProvider>
    </LoadingProvider>
  );
};

// Then in App:
function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}


export default App;