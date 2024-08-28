import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Container, Form } from 'react-bootstrap';
import axiosInstance from './helpers/axiosInstance';

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
        setErrorMessage(null); // Clear previous errors
        await axiosInstance.post('/login', data);
        // Handle successful registration, e.g., redirect to login page
        alert('Login successful!');
    } catch (error: any) {
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || 'An error occurred');
        } else {
            setErrorMessage('An error occurred');
        }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-sm" style={{ width: '24rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Threddit Login</Card.Title>
          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                {...register('username', { required: 'Username is required' })}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                {...register('password', { required: 'Password is required' })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100" variant="primary">Log In</Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">New to Threddit?</span>{' '}
            <a href="/register" className="link-primary">Sign up</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
