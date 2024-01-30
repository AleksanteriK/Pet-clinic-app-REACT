import React, { useState } from 'react';
import { Container, Card, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { languages } from '../main_components/UI_text';

export default function AddPet({ language }) {
   const [isListOpen, setListIsOpen] = useState(false);
   const { register, handleSubmit } = useForm();
   const [petData, setPetData] = useState(null); // State to store pet data

   const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
   };

   function toggleList() {
      setListIsOpen((prevIsListOpen) => !prevIsListOpen);
   }

   const now = formatDate(new Date());
   const badformat_token = sessionStorage.getItem('AccessToken');
   const sanitizedToken = badformat_token.replace(/"/g, '');

   const AddNewPet = (data) => {
      fetch('http://localhost:4000/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sanitizedToken}`
      },
      body: JSON.stringify({
        name: data.name,
        petType: data.type,
        dob: data.dob,
        ownerId: sessionStorage.getItem('UserID')
      })
   })
      .then(response => {
         if (response.ok) {
            var modal = document.getElementById("popup");

            if (modal) {
            modal.style.display = "block";

            //Store pet data in state
            setPetData({
              name: data.name,
              type: data.type,
              dob: data.dob
            });

            //Close the form section
            setListIsOpen(false);
          }
        }

         if (!response.ok) {
            alert('EN: ' + 'Adding new pet to the registry failed, check the information you filled! \n \n' +
            'FI: ' + 'Lemmikin lisääminen epäonnistui, tarkista täyttämäsi tiedot!');
         }

        return response.json();
      })

      .then(jsonData => {
         console.log(jsonData);
      })

      .catch(error => {
         console.error('Error fetching pets data:', error);
      });
   };

   const closeModal = () => {
      var modal = document.getElementById("popup");

      if (modal) {
         modal.style.display = "none";
         //Clear pet data when closing the modal
         setPetData(null);
      }
   };

   return (
   <Container>
      <Card className="list-card">
         <Row className='text-center text-md-left'>
         <button className="list-pets-button" onClick={() => toggleList()}>
            {languages[`dashboard_${language}`]?.[0]?.add_pet}
         </button>
         {isListOpen ? (
            <Card>
               <h3>{languages[`dashboard_pet_list_${language}`]?.[0].new_pet}</h3>
               <form onSubmit = {handleSubmit(AddNewPet)}>
                  <input id = 'pet-name'
                  placeholder = {languages[`dashboard_${language}`]?.[0].add_name}
                  {...register('name', { required: true })}>
                  </input>
               <Row><br></br></Row>
                  <input id = 'type'
                  placeholder = {languages[`dashboard_${language}`]?.[0].add_species}
                  {...register('type', { required: true })}>
                  </input>
               <Row><br></br></Row>
                  <p>{languages[`dashboard_pet_list_${language}`]?.[0].DOB}</p>
                  <input
                  type = 'date'
                  id = 'appointment'
                  name = 'dob'
                  max = {now}
                  {...register('dob', { required: true })}
                  />
               <Row><br></br></Row>
                  <button type = 'submit' id = 'send'>
                  {languages[`dashboard_${language}`]?.[0].add_new_pet}
                  </button>
               </form>
            </Card>
         ) : null}
         </Row>
      </Card>
      <div id="popup" className="modal">
         <div className="modal-content">
         <span className="close" onClick={closeModal}>&times;</span>
         {/* Render PetDetails with pet data only when available */}
         {petData && (
            <PetDetails
               name={petData.name}
               type={petData.type}
               dob={petData.dob}
               language={language}
            />
         )}
         </div>
      </div>
   </Container>
  );
}

const PetDetails = ({ name, type, dob, language }) => {
  return (
   <div className='text-center text-md-left'>
      <h3>{languages[`dashboard_${language}`]?.[0]?.successful_add}</h3>
      <p>{languages[`dashboard_${language}`]?.[0]?.new_pet_details}</p>
      <p>{name}</p>
      <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.species}</p>
      <p>{type}</p>
      <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.DOB}</p>
      <p>{dob}</p>
   </div>
  );
};
