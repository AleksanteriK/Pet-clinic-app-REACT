import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from './AuthService';

const AuthCheck = ({ children }) => {
  //Check if accesstoken exists
  const isAuthenticated = AuthService.isAuthenticated();

  //If authenticated, render the child components
  if (isAuthenticated) {
    return <>{children}</>;
  }

  //If not authenticated, redirect to the login page
  return <Navigate to='/login' />;
};

export default AuthCheck;