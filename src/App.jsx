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
import { LoadingProvider } from "./context/LoadingContext";
import { useLoading } from "./context/LoadingContext";

const AppContent = () => {
  const { isLoading } = useLoading();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/404" element={<Notfound />} />
        <Route path="*" element={<Notfound />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
