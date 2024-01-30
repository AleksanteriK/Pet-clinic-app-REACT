/*This component's main purpose is to wrap all components so they can get
the language change information*/

import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import App from './App';
import Footer from './main_components/Default_page-header';

const AppWrapper = () => {
   const [language, setLanguage] = useState('suomi');
 
   const handleLanguageChange = (newLanguage) => {
     setLanguage(newLanguage);
   };
 
   return (
      <BrowserRouter>
       <Footer />
       <App language = {language} handleLanguageChange = {handleLanguageChange}/>
      </BrowserRouter>
   );
};

export default AppWrapper;