// src/components/Register.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axiosInstance from './helpers/axiosInstance';

interface RegistrationFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormInputs>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegistrationFormInputs) => {
    try {
      setErrorMessage(null); // Clear previous errors
      await axiosInstance.post('/register', data);
      // Handle successful registration, e.g., redirect to login page
      alert('Registration successful!');
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'An error occurred');
      } else {
        setErrorMessage('An error occurred');
      }
    }
  };

  const validatePasswordMatch = (value: string) => {
    if (value !== watch('password')) {
      return 'Passwords do not match';
    }
    return true;
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-sm" style={{ width: '24rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Sign Up for Reddit</Card.Title>
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

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message || 'Please enter a valid email address'}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                {...register('password', { required: 'Password is required', minLength: 6 })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message || 'Password must be at least 6 characters'}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                {...register('confirmPassword', { required: 'Please confirm your password', validate: validatePasswordMatch })}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100" variant="primary">Sign Up</Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">Already have an account?</span>{' '}
            <a href="/login" className="link-primary">Sign in</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
