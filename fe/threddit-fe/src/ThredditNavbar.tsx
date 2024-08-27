import React from 'react';
import { Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap';

const ThredditNavbar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Logo or Brand */}
        <Navbar.Brand href="/">Threddit</Navbar.Brand>

        {/* Toggle for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {/* Centered Search Bar */}
            <Form className="d-flex mx-auto">
              <FormControl
                type="text"
                placeholder="Search Threddit"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Nav>

          {/* Right-Aligned Login/Register Buttons */}
          <Nav className="ms-auto">
            <Button href='/login' variant="primary" className='rounded-pill me-2'>Log In</Button>
            <Button href='/register' variant="primary" className='rounded-pill'>Sign Up</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ThredditNavbar;
