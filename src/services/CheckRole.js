/*This ensures that no client or doctor/staff can access to dashboards other
than their own*/

import React, { useEffect } from 'react';

const CheckRole = ({ children }) => {
  useEffect(() => {
    //Check user role and redirect accordingly
    const username = sessionStorage.getItem('Username_for_petclinic');

    if (username && username.includes("@pets.com")) {
      //Redirect only if the user is a doctor or some other staff
      if (window.location.pathname !== '/doctor-dashboard') {
        window.location.href = '/doctor-dashboard';
      }
    } 
    
    else {
      //Redirect only if the user is a client
      if (window.location.pathname !== '/client-dashboard') {
        window.location.href = '/client-dashboard';
      }
    }
  }, []);

  return <>{children}</>;//Render children after redirection
};

export default CheckRole;