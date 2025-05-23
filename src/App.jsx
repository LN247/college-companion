import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/signupForm";
import Notfound from "./pages/Notfound";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/404" element={<Notfound />} />
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
