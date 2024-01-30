import { Card, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { languages } from '../main_components/UI_text';

export default function EditPetInfo ({language, selectedPet}) {
   const { register } = useForm();
   const options = ['alive', 'deceased', 'missing', 'other'];
   //const onSubmitState = (pet_state) => UpdateState(pet_state);
   const badformat_token = sessionStorage.getItem('AccessToken');
   /*after many tries' I noticed that the backend doesn't accept the token
   if it has any quotes when sending it in the authorization header, so it needs to
   be sanitized everytime*/
      
   /*Removing quotes from the accesstoken*/
   const sanitizedToken = badformat_token.replace(/"/g, '');
   /*debug*/
   console.log('Accesstoken:');
   console.log(badformat_token);
   console.log(sanitizedToken);
   console.log('UserID:');
   console.log(sessionStorage.getItem('UserID'));
   /*debug*/

   const UpdateAll = () => {
      var successfull_update_fin = languages[`dashboard_pet_list_suomi`]?.[0].update_successful;
      var successfull_update_en = languages[`dashboard_pet_list_english`]?.[0].update_successful;
      var fail_update_fin = languages[`dashboard_pet_list_suomi`]?.[0].update_fail;
      var fail_update_en = languages[`dashboard_pet_list_english`]?.[0].update_fail;

      fetch(`http://localhost:4000/pets/${selectedPet.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${sanitizedToken}`
            },
            body: JSON.stringify({
            status : document.getElementById('newstate').value,
            comment : document.getElementById('internal_info').value
         }),
      })

         .then((response) => {
          if (response.ok) {
            window.alert('FIN: ' + successfull_update_fin + selectedPet.name + '!\n \n' + 
            'EN: ' + successfull_update_en + selectedPet.name + '!');
            return response.json();
          } 
          
          else {
            window.alert('FIN: ' + fail_update_fin + selectedPet.name + '!\n \n' + 
            'EN: ' + fail_update_en + selectedPet.name + '!\n' + response.json());
          }
         })

        .catch((error) => {
            console.error('Error updating state:', error);
         });

   }

   const arrayOfOptions = options.map((state, position) => {
      return <option key={position} value={state}>{state}</option>
   })

   return (
      <Card>
         <Row className = 'align-items-center justify-content-center'>
            <Col className = 'text-center text-md-left'>
               <p>{languages[`dashboard_pet_list_${language}`]?.[0].update_status}</p>
               <form>
                  <select id = 'newstate' {...register('pet_state', { required: true })}>
                  {arrayOfOptions}
                  </select>
               <Row><br></br></Row>
               </form>
               <form>
                  <input id = 'internal_info'
                  placeholder = {languages[`dashboard_pet_list_${language}`]?.[0].edit_internalinfo}
                  {...register('internal_info', { required: true })}>
                  </input>
                  <Button className = 'update-button' onClick = {() => UpdateAll()}>
                  {languages[`dashboard_pet_list_${language}`]?.[0].update_all_button}
                  </Button>
               </form>
            </Col>
         </Row>
      </Card>
   );
}

