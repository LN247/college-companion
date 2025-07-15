import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Notfound from "./pages/Notfound";
import Dashboard from "./pages/dashboard";
import SemesterPlan from "./pages/SemesterPlan";
import Settings from "./pages/Settings";
import {ToastProvider} from './context/ToastContext'
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import AddSemester from "./pages/AddSemester.jsx";
import UserProfileForm from "./pages/UserProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { LoadingProvider } from "./context/LoadingContext";
import { useLoading } from "./context/LoadingContext";
import Notifications from "./pages/notifications";
import { AdminProvider } from "./context/AdminContext";
import AcademicCalendar from "./components/AcademicCalendar";
import { UserProvider } from "./context/UserContext";
import ChatPage from "./pages/ChatPage";
import Unauthorised from "./pages/Unauthorised";
import AIAssistant from "./pages/AIAssistant.jsx";
import AboutUs from  "./pages/AboutUs.jsx"

const AppContent = () => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route path="/signup" element={<SignupForm />} />
        <Route path="/calendar" element={<AcademicCalendar />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/not-authorized" element={<Unauthorised />} />
        <Route path="About Us" element={<AboutUs />} />
        
        <Route
          path="/add-semester"
          element={
            <ProtectedRoute>
              <AddSemester />
            </ProtectedRoute>
          }
        />

        <Route path="/chat" element={<ChatPage />} />
         <Route path='/My assistant' element={<AIAssistant/>}></Route>

        {/* Fix: Remove <UserProvider> here */}
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
          <Dashboard />
          }
        />
     

        <Route
          path="/timetable"
          element={

              <SemesterPlan />

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

<Route    path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfileForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={

              <AdminProvider>
                <AdminDashboard />
              </AdminProvider>

          }
        />
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

function App() {



  return (
         <ToastProvider>
    <AppProviders>
      <AppContent />
    </AppProviders>
               </ToastProvider>
  );
}

export default App;
