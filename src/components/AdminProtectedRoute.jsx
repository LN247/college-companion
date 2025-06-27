import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Loadingpage from "./Loadingpage";

const AdminProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) return <Loadingpage />;

  if (!user) return <Navigate to="/login" />;

  if (!user.is_superuser) return <Navigate to="/not-authorized" />;

  return children;
};

export default AdminProtectedRoute;
