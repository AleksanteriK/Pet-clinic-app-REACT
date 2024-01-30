import React from 'react';
import { Card, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { languages } from '../main_components/UI_text';

export default function AddVisit({ language, selectedPet, visits }) {
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const now = formatDate(new Date());
  const badformat_token = sessionStorage.getItem('AccessToken');
  const sanitizedToken = badformat_token.replace(/"/g, '');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const BookAppointment = (data) => {
    const appointmentDate = data.date;
    const appointmentComment = data.comment;

    const existingAppointment = visits.find(
      (visit) => visit.date === appointmentDate && visit.petId === selectedPet.id
    );

    /*Only doctor or staff can book more than one appointment for a single day for one pet*/
    if (existingAppointment && (sessionStorage.getItem('UserID') !== 0 || !sessionStorage.getItem('Username_for_petclinic').includes('@pets.com'))) {
      alert('EN: ' + 'Appointment already exists for this date and pet! \n \n' +
      'FI: ' + 'Varaus epäonnistui, valitsemallesi päivämäärälle ja lemmikille on jo olemassa käynti!');
    }
    
    else {
      fetch('http://localhost:4000/visits', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sanitizedToken}`
         },
         body: JSON.stringify({
            date: appointmentDate,
            petId: selectedPet.id,
            comment: appointmentComment
         })
      })
         
      .then(response => {
        if (response.ok) {
          alert('EN: ' + 'Appointment was booked successfully for ' + selectedPet.name + '!\n \n' +
          'FI: ' + 'Varaus onnistui lemmikillesi ' + selectedPet.name + '!');
        }

        if (!response.ok) {
          alert('EN: ' + 'Booking the Appointment was not successful\n \n' +
          'FI: ' + 'Varauksen tekeminen epäonnistui! \n\n' +
          'Syy / Reason: ' + JSON.stringify(response.json()) + '\n\n' +
          '(Vastaus saatu palvelimelta / Response was received from the server)');

          throw new Error('Network response was not ok');
        }

          return response.json();
      })

      .then(jsonData => {
        console.log(jsonData);
      })

      .catch(error => {
        console.error('Error fetching pets data:', error);
      });
    }
  }

  return (
    <div>
      <Card className = 'align-items-center justify-content-center'>
        <Row className = 'text-center text-md-left'>
          <form onSubmit = {handleSubmit(BookAppointment)}>
            <label htmlFor='appointment'>
              {languages[`dashboard_${language}`]?.[0].book_appointment_date}
            </label>
            <br></br>
            <input
              type = 'date'
              id = 'appointment'
              name = 'date'
              min = {now}
              {...register('date', { required: true })}
            />
            {errors.date && <p>{languages[`dashboard_${language}`]?.[0].date_required}</p>}
            <br></br>
            <label htmlFor='appointment-comment-section'>
              {languages[`dashboard_${language}`]?.[0].add_comment}
            </label>
            <br></br>
            <input
              type = 'text'
              id = 'appointment-comment'
              {...register('comment', { required: true })}
            />
            {errors.comment && <p>{languages[`dashboard_${language}`]?.[0].comment_required}</p>}
            <br></br>
            <button type="submit">
              {languages[`dashboard_${language}`]?.[0].book_button}
            </button>
          </form>
        </Row>
      </Card>
    </div>
  );
}