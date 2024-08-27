import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const Home: React.FC = () => {
  return (
    <>
      {/* Main Content */}
      <Container className="mt-4">
        <Row>
          {/* Main Feed */}
          <Col md={8}>
            <h2 className="mb-4">Home</h2>

            {/* Post List (Placeholder Posts) */}
            {Array.from({ length: 5 }).map((_, idx) => (
              <Card className="mb-4 shadow-sm" key={idx}>
                <Card.Body>
                  <Card.Title>Post Title {idx + 1}</Card.Title>
                  <Card.Text>
                    This is a brief description of post {idx + 1}. This content is just a placeholder to show how the posts will look.
                  </Card.Text>
                  <Button variant="primary">Read More</Button>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Sidebar */}
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>About</Card.Title>
                <Card.Text>
                  Welcome to the home page! This is where you can find the latest posts and updates.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Useful Links</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item action href="#link1">Link 1</ListGroup.Item>
                  <ListGroup.Item action href="#link2">Link 2</ListGroup.Item>
                  <ListGroup.Item action href="#link3">Link 3</ListGroup.Item>
                  <ListGroup.Item action href="#link4">Link 4</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
