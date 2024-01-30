import React, { useState, useEffect } from 'react';
import { Row, Col, Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { languages } from '../main_components/UI_text';
import EditPetInfo from './EditPetInfo';
import AddVisit from './AddVisit';

export default function ListPets ({language}) {
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedPetIndex, setSelectedPetIndex] = useState(null);
  const [isListOpen, setListIsOpen] = useState(false);
  const [isDetailsOpen, setDetailsIsOpen] = useState(false);

  /*False is if checkBox is checked to show all, true if alive only*/
  const [checkBox, updateCheckBox] = useState(false)

  useEffect(() => {
    const abortController = new AbortController();
    const badformat_token = sessionStorage.getItem('AccessToken');
    /*after many tries' I noticed that the backend doesn't accept the token
    if it has any quotes when sending it in the authorization header, so it needs to
    be sanitized everytime*/
      
    /*Removing quotes from the accesstoken*/
    const sanitizedToken = badformat_token.replace(/"/g, '');

      if (!badformat_token) {
        console.log('Token not accessible');
        return;
      }

      /*Fetch clients data if user is Doctor / Staff*/ 
      if (sessionStorage.getItem('Username_for_petclinic').includes('@pets.com')
      || sessionStorage.getItem('UserID') === 0) {
        
        fetch ('http://localhost:4000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sanitizedToken}`
          },
        })

        .then (response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          return response.json();
        })

        .then(jsonData => {
          var usernames = jsonData.map(user => user.name);
          setUsers(jsonData);
           /* debug */
           console.log(jsonData);
           console.log('length of response Json array: ' + jsonData.length);
           console.log(usernames);
           /* debug */
        })
  
        .catch(error => {
           console.error('Error fetching pets data:', error);
        });
      }

      /*Fetch pet visits regardless of user*/
      fetch('http://localhost:4000/visits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sanitizedToken}`
         },
      })

      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })

      .then(jsonData => {
        setVisits(jsonData);
         /* debug */
         console.log(jsonData);
         console.log('length of response Json array: ' + jsonData.length);
         console.log(visits[1]);
         /* debug */
      })

      .catch(error => {
         console.error('Error fetching pets data:', error);
      });

      /*Fetch pets*/
      fetch('http://localhost:4000/pets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sanitizedToken}`
         },
      })

      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })

      .then(jsonData => {
        var petNames = jsonData.map(pet => pet.name);
        setPets(jsonData);
         /* debug */
         console.log(jsonData);
         console.log('length of response Json array: ' + jsonData.length);
         console.log(petNames);
         /* debug */
      })

      .catch(error => {
         console.error('Error fetching pets data:', error);
      });

      return () => abortController.abort(); //Cleanup
   }, []);
 
  function toggleList () {
    setListIsOpen((isListOpen) => !isListOpen);
    //Reset selected pet index when closing the list
    setSelectedPetIndex(null);
  }
 
  function toggleDetails (index) {
    //Toggle details only if the selected pet index is different
    setDetailsIsOpen((isDetailsOpen) => !isDetailsOpen);
    setSelectedPetIndex(index);
   }

  function deadOrAlive () {
    updateCheckBox((checkBox) => !checkBox);
    console.log('checkboxcheckBox' + checkBox);
  }
 
  const NameList = ({language}) => {
    return (
    <ul id='petlist'>
      {pets.map((pet, index) => (
        (checkBox && pet.status === 'alive') || !checkBox ? ( 
        <li key={index}>
          {pet.name}
          <button className = 'detail-button' onClick={() => toggleDetails(index)}>
            {languages[`dashboard_pet_list_${language}`]?.[0]?.details_button}
          </button>
        </li>
        ) : null
      ))}
    </ul>
    );
  };
 
  const DetailedInfo = ({language}) => {
    if (selectedPetIndex !== null) {
      const selectedPet = pets[selectedPetIndex];
      console.log('selectedPet.ownerId:', selectedPet.ownerId);
      console.log('users:', users);

      /*If the user is staff / doctor*/
      if (sessionStorage.getItem('Username_for_petclinic').includes('@pets.com')
      || sessionStorage.getItem('UserID') === 0) {
        return (
          <div className = 'pet-details'>
            <h3>{selectedPet.name}</h3>
            <p>ID {selectedPet.id}</p>
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.species} {selectedPet.petType}</p>
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.DOB} {selectedPet.dob}</p>
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.doctor_see_ownerid} {selectedPet.ownerId}</p>
            {selectedPet.ownerId === users.find(user => user.id === selectedPet.ownerId)?.id ? (
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.doctor_see_owner} {users.find(user => user.id === selectedPet.ownerId)?.name}</p>
            ) : null}
            <p>{selectedPet.status}</p>
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.doctor_internal_info}</p>
            <p>{selectedPet.doctorsComment}</p>
            <Row><br></br></Row>
            <EditPetInfo language = {language} selectedPet = {selectedPet}/>
            <AddVisit language = {language} selectedPet = {selectedPet} visits = {visits}></AddVisit>
          </div>
        );
      }

      /*Else if the user is a client / non staff*/
      else {
        return (
          <div className = 'pet-details'>
            <h3>{selectedPet.name}</h3>
            <p>ID {selectedPet.id}</p>
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.species} {selectedPet.petType}</p>
            <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.DOB} {selectedPet.dob}</p>
            <p>{selectedPet.status}</p>
            <Row><br></br></Row>
            <AddVisit language = {language} selectedPet = {selectedPet} visits = {visits}></AddVisit>
          </div>
        );
      }
    }
    return null;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
    ).padStart(2, '0')}`;
  };

  const ListVisits = ({ language }) => {
    if (selectedPetIndex !== null) {
      const selectedPet = pets[selectedPetIndex];
      console.log('selectedPet.ownerId:', selectedPet.ownerId);

      const currentVisits = visits.filter((visit) => visit.date === getCurrentDate());
      const upcomingVisits = visits.filter((visit) => visit.date > getCurrentDate());
      const pastVisits = visits.filter((visit) => visit.date < getCurrentDate());

      const sortedUpcomingVisits = upcomingVisits.slice().sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      const sortedPastVisits = pastVisits.slice().sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
  
      return (
        <div className='visits-list'>
          <table>
            <thead>
              <tr>
                <th>{selectedPet.name}</th>
              </tr>
              <th>
                <th>{languages[`dashboard_${language}`]?.[0].current_visits}</th>
              </th>
            </thead>
            <tbody>
              {currentVisits.map((item) => (
                selectedPet.id === item.petId ? (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td>{item.date}</td>
                    </tr>
                      <React.Fragment>
                        <tr>
                          <td>{languages[`dashboard_pet_list_${language}`]?.[0].comments}</td>
                        </tr>
                        <tr>
                          <td>{item.comment}</td>
                        </tr>
                      </React.Fragment>
                  </React.Fragment>
                ) : null
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <th>
                <th>{languages[`dashboard_${language}`]?.[0].upcoming_visits}</th>
              </th>
            </thead>
            <tbody>
              {sortedUpcomingVisits.map((item) => (
                selectedPet.id === item.petId ? (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td>{item.date}</td>
                    </tr>
                      <React.Fragment>
                        <tr>
                          <td>{languages[`dashboard_pet_list_${language}`]?.[0].comments}</td>
                        </tr>
                        <tr>
                          <td>{item.comment}</td>
                        </tr>
                      </React.Fragment>
                  </React.Fragment>
                ) : null
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <th>
                <th>{languages[`dashboard_${language}`]?.[0].past_visits}</th>
              </th>
            </thead>
            <tbody>
              {sortedPastVisits.map((item) => (
                selectedPet.id === item.petId ? (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td>{item.date}</td>
                    </tr>
                      <React.Fragment>
                        <tr>
                          <td>{languages[`dashboard_pet_list_${language}`]?.[0].comments}</td>
                        </tr>
                        <tr>
                          <td>{item.comment}</td>
                        </tr>
                      </React.Fragment>
                  </React.Fragment>
                ) : null
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    //Return null if selectedPetIndex is null
    return null;
  };

  /*If the user is staff / doctor*/
  if (sessionStorage.getItem('Username_for_petclinic').includes('@pets.com') 
  || sessionStorage.getItem('UserID') === 0) {
    return (
      <div>
        <Card className = 'list-card'>
          <button className = 'list-pets-button'onClick={() => toggleList()}>
          {languages[`dashboard_${language}`]?.[0]?.doctor_list_pets}
          </button>
          {checkBox ? <button onClick={() => deadOrAlive()}>
          {languages[`dashboard_${language}`]?.[0]?.show_alive}
          </button>: <button onClick={() => deadOrAlive()}>
          {languages[`dashboard_${language}`]?.[0]?.show_all}
          </button>}
          {isListOpen ? <NameList language={language}/> : null}
          <Card className = 'list-card'>
            <Row>
              {isDetailsOpen && isListOpen? (
              <>
                <Col>
                  <DetailedInfo language = {language}/>
                </Col>
                <Col>
                  <ListVisits language = {language}/>
                </Col>
              </>
              ) : null}
            </Row>
          </Card>
        </Card>
      </div>
    );
  }

  /*Else if the user is a client / non staff*/
  else {
    return (
      <div>
        <Card className = 'list-card'>
          <button className = 'list-pets-button'onClick={() => toggleList()}>
          {languages[`dashboard_${language}`]?.[0]?.list_pets}
          </button>
           {isListOpen ? <NameList language={language}/> : null}
          <Card>
           {isDetailsOpen ? <DetailedInfo language={language}/> : null}
          <Card className = 'list-card'>
            <Row>
              {isDetailsOpen && isListOpen ? (
              <>
                <Col>
                  <ListVisits language = {language}/>
                </Col>
              </>
              ) : null}
            </Row>
          </Card>
          </Card>
        </Card>
      </div>
    );
  }
 }
 