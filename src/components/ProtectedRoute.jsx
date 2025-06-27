import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Loadingpage from "../components/Loadingpage";
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) return <Loadingpage />;

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
