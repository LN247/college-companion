import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/signupForm";
import Notfound from "./pages/Notfound";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
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
      </Router>
    </div>
  );
}

export default App;
