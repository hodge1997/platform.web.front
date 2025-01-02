// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path according to your folder structure

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth(); // Get the authentication status from the context

  if (!isLoggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the child components
  return children;
};

export default ProtectedRoute;
