import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

// Access page {children} only if logged in
export const AuthRouteLoggedIn = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in');
    return <Navigate to="/login" replace />;
  }

  return children;
};

// If logged in, do not access page {children}
export const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : children;
};

export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let isAdmin = false;
  if(token){
    const userRole = jwtDecode(token).role;
    if(userRole === 'admin'){
      isAdmin = true;
    }
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};