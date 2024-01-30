import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import AuthService from '../services/AuthService';
import { languages } from '../main_components/UI_text';

function initialLanguage() {
  return 'suomi';
}

function initialLoginFail() {
  return null;
}

export default function Login() {
  const GetAccessToken = async (logindata) => {
    try {
      const payload_for_token = {
        email: logindata.email,
        password: logindata.password
      };
  
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload_for_token),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
  
      const jsonData = await response.json();
  
      /* Storing the access token received from the backend to sessionStorage */
      sessionStorage.setItem('AccessToken', JSON.stringify(jsonData.access_token));
  
      /* UPDATE ON 25.1.2024 */
      sessionStorage.setItem('UserID', jsonData.id);
  
      /* Storing the username (email) which the user used to log in to the service,
        then displaying it on the client's or doctor's homepage to get a personal
        experience using the service */
      sessionStorage.setItem('Username_for_petclinic', logindata.email);
  
      /* Direct to the correct page, by now if it has fetched the accessToken already,
        it should be safe */
      AuthService.directHome(logindata.email, JSON.stringify(jsonData.access_token));
  
    } catch (error) {
      setFail('Kirjautuminen epäonnistui! / Login failed!');
    }
  }
  

    const {register, handleSubmit, formState: { errors }} = useForm();
    const onSubmit = (logindata) => GetAccessToken(logindata);
    const [language, setLanguage] = useState(() => initialLanguage());
    const [loginFail, setFail] = useState(() => initialLoginFail());

    const handleLanguageChange = (newLanguage) => {
      setLanguage(newLanguage);
    }

    return (
    <div>
      <Container>
        <Row>
        <Button className = 'language-select' onClick = {() => handleLanguageChange('suomi')}>Suomi</Button>
        <Button className = 'language-select' onClick = {() => handleLanguageChange('english')}>English</Button>
        </Row>
      </Container>
      <Container fluid className='mt-5'>
        <Row className='align-items-center justify-content-center'>
            <Col className='text-center text-md-left'>
                <h1>{languages[`login_${language}`][0].title}</h1>
            </Col>
        </Row>
        <Row className='align-items-center justify-content-center'>
            <Col className='text-center text-md-left'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                  placeholder={languages[`login_${language}`][0].email_placeholder}
                  {...register('email', { required: true })}
                  />
                  
                  <input
                  type='password'
                  placeholder={languages[`login_${language}`][0].password_placeholder}
                  {...register('password', { required: true })}
              />
                <Button type="submit">{languages[`login_${language}`][0].login_button}</Button>
                </form>
            </Col>
        </Row>
        <Row className='align-items-center justify-content-center'>
            <Col className='text-center text-md-left'>
                {errors.email && <p>{languages[`login_${language}`][0].error_email}</p>}
                {errors.password && <p>{languages[`login_${language}`][0].error_password}</p>}
            </Col>
        </Row>
        <Row className='align-items-center justify-content-center'>
            <Col className='text-center text-md-left'>
                <div className='error-box'>
                  <span>{loginFail}</span>
                </div>
            </Col>
        </Row>
      </Container>
    </div>
    );
}