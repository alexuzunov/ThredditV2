import React, { useContext } from 'react';
import { Dropdown, Navbar, Nav, Form, Button, FormControl, Container } from 'react-bootstrap';
import { AuthContext } from './auth/AuthContext';

const ThredditNavbar: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
    }
  };

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

          <Nav className="ms-auto">
            {authContext && authContext.user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-avatar">
                  <img
                    src={authContext.user.avatar || "https://avatar.iran.liara.run/public"}
                    alt="User Avatar"
                    className="rounded-circle"
                    style={{ width: '30px', height: '30px' }}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button href='/login' variant="primary" className='rounded-pill me-2'>Log In</Button>
                <Button href='/register' variant="primary" className='rounded-pill'>Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ThredditNavbar;
