import { Container, Row, Col, Button, Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import EndSession from '../services/EndSession';
import { languages } from './UI_text';
import ListPets from '../minor_components/ListPets';
import ShowVisits from '../minor_components/ShowVisits';

export default function DoctorHome ({language, handleLanguageChange}) {
   var name = sessionStorage.getItem('Username_for_petclinic');

   return (
      <div>
         <header>
            <Container>
            <Row>
               <Col>
                  <Card className='language-exit'>
                     <div>
                        <Button className = 'language-select' onClick = 
                        {() => handleLanguageChange('suomi')}>Suomi</Button>
                        <Button className = 'language-select' onClick = 
                        {() => handleLanguageChange('english')}>English</Button>
                     </div>
                  </Card>
               </Col>
               <Col>
                  <Card className='language-exit'>
                     <Button className = 'language-select' onClick = {EndSession.logOut}>{languages[`dashboard_${language}`][0].logout}</Button>
                  </Card>
               </Col>
            </Row>
            </Container>
         </header>
         <br></br>
         <Row className = 'align-items-center justify-content-center'>
            <Col className = 'text-center text-md-left'>
               <h3>{languages[`dashboard_${language}`][0].greeting} {name}</h3>
            </Col>
         </Row>
         <br></br>
         <Container>
            <Row>
               <Col>
                  <ListPets language = {language}/>
               </Col>
               <Col>
                  <ShowVisits language = {language}/>
               </Col>
            </Row>
         </Container>
      </div>
   )
}