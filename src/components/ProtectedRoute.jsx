     import React, { useContext } from 'react';
     import { Navigate } from 'react-router-dom';
     import UserContext from '../context/UserContext';

     const ProtectedRoute = ({ children }) => {
       const { user, isLoading } = useContext(UserContext);




       if (isLoading) return <p>Loading...</p>;
        console.log(user);
       if (!user) return <Navigate to="/login" />;

       return children;
     };

     export default ProtectedRoute;