import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { languages } from '../main_components/UI_text';

export default function ShowVisits({ language }) {
  const [visits, setVisits] = useState([]);
  const [isListOpen, setListIsOpen] = useState(false);

  function toggleList() {
    setListIsOpen((isListOpen) => !isListOpen);
  }

  useEffect(() => {
    const abortController = new AbortController();
    const badformat_token = sessionStorage.getItem('AccessToken');
    const sanitizedToken = badformat_token.replace(/"/g, '');

    fetch('http://localhost:4000/visits', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sanitizedToken}`
      },
    })

    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
        return response.json();
    })

    .then((jsonData) => {
      setVisits(jsonData);
    })

    .catch((error) => {
      console.error('Error fetching pets data:', error);
    });

      return () => abortController.abort(); // Cleanup
   }, []);

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
    ).padStart(2, '0')}`;
  };

  const currentVisits = visits.filter((visit) => visit.date === getCurrentDate());
  const upcomingVisits = visits.filter((visit) => visit.date > getCurrentDate());
  const pastVisits = visits.filter((visit) => visit.date < getCurrentDate());

  const sortedUpcomingVisits = upcomingVisits.slice().sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  });

  const sortedPastVisits = pastVisits.slice().sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
 
  return (
    <Container>
      <Card className="list-card" onClick={() => toggleList()}>
        <button className="list-pets-button">
          {languages[`dashboard_${language}`]?.[0]?.doctor_show_visits}
        </button>
          {isListOpen ? (
          <Card>
            <div>
              <h2>{languages[`dashboard_${language}`]?.[0]?.current_visits}</h2>
              {currentVisits.length > 0 ? (
              <ul>
              {currentVisits.map((visit) => (
                <div>
                  <li key = {visit.id}>Booking ID: {visit.id}</li>
                  <p>{languages[`dashboard_${language}`]?.[0]?.petId} {visit.petId}</p>
                  <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.comments} {visit.comment}</p>
                </div>
              ))}
              </ul>
              ) : (
              <p>{languages[`dashboard_${language}`]?.[0]?.no_current_visits}</p>
              )}
            </div>
            <div>
            <h2>{languages[`dashboard_${language}`]?.[0]?.upcoming_visits}</h2>
            {sortedUpcomingVisits.length > 0 ? (
            <ul>
            {sortedUpcomingVisits.map((visit) => (
              <div key = {visit.date}>
                <li>{visit.date}</li>
                <p key = {visit.id}>Booking ID: {visit.id}</p>
                <p>{languages[`dashboard_${language}`]?.[0]?.petId} {visit.petId}</p>
                <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.comments} {visit.comment}</p>
              </div>
            ))}
            </ul>
            ) : (
            <p>{languages[`dashboard_${language}`]?.[0]?.no_upcoming_visits}</p>
            )}
            <h2>{languages[`dashboard_${language}`]?.[0]?.past_visits}</h2>
            <ul>
            {sortedPastVisits.map((visit) => (
              <div key = {visit.date}>
                <li>{visit.date}</li>
                <p key = {visit.id}>Booking ID: {visit.id}</p>
                <p>{languages[`dashboard_${language}`]?.[0]?.petId} {visit.petId}</p>
                <p>{languages[`dashboard_pet_list_${language}`]?.[0]?.comments} {visit.comment}</p>
              </div>  
            ))}
            </ul>
            </div>
         </Card>
       ) : null}
     </Card>
   </Container>
 );
}