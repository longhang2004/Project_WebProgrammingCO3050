// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { userInfo, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div>Loading...</div>; // Hoặc spinner
  }

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;