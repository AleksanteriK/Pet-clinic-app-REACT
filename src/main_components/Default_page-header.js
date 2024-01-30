import {Container, Row, Col} from 'react-bootstrap';

function Footer(props) {
  return (
    <header className="bg-light py-3">
      <Container className='portal-footer'>
        <Row className="align-items-center">
          <Col xs={12} md={4} className="text-center">
            <img
              src={'https://www.cc.puv.fi/~e2202945/sources/paw.png'}
              alt="Header"
              className="img-fluid"
              style={{
              maxWidth: '100%', // Default size for larger screens
              maxHeight: '80%', // Default size for larger screens
              width: '50%', // Adjust as needed for smaller screens
              height: '30%', // Adjust as needed for smaller screens
              border: '5px solid'
              }}
            />
          </Col>
          <Col xs={12} md={4} className="text-center text-md-left">
              <h1>Pet Clinic Portal{/*languages[`header_${language}`][0].logo_text*/}</h1>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Footer;