import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './services/Login';
import DoctorHome from './main_components/DoctorHome';
import ClientHome from './main_components/ClientHome';
import AuthCheck from './services/AuthCheck';
import CheckRole from './services/CheckRole';

function App ({language, handleLanguageChange})  {

  return (
      <Routes>
        {/*Redirect to login if the path is not matched*/}
        <Route path="*" element={<Navigate to="/login" />}/>
        <Route path='/login' element={<Login
        language = {language} handleLanguageChange = {handleLanguageChange}/>}/>
        <Route path='/doctor-dashboard' 
        element={<CheckRole><AuthCheck><DoctorHome
        language = {language} handleLanguageChange = {handleLanguageChange}/></AuthCheck></CheckRole>}/>
        <Route path='/client-dashboard'
        element={<AuthCheck><CheckRole><ClientHome
        language = {language} handleLanguageChange = {handleLanguageChange}/></CheckRole></AuthCheck>}/>
      </Routes>
  );
};

export default App;
