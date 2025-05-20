import { useState } from "react";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/signupForm";
import Notfound from "./pages/Notfound";
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/404" element={<Notfound />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
