import React from 'react';
import { Row, Col, Container, Navbar, Nav, } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="mt-5 p-4 border-top">
        <Row>
          <Col className='text-center'>
            <ul className="list-unstyled">
              <li>©All rights reserved</li>
              <Navbar  expand="lg" className="head mb-4">
                <Container>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav className="ms-auto d-flex align-items-center">
                      <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
                    </Nav>
                </Container>
              </Navbar>
        	    
            </ul>
          </Col>

        </Row>
      </div>
    );
};

export default Footer;
