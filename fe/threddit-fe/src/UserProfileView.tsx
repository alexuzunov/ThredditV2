// src/components/UserProfileView.tsx

import React from 'react';
import { Container, Card, Image, ListGroup } from 'react-bootstrap';
import { Post, UserProfile } from './types';

// Define dummy data
const dummyUserProfile: UserProfile = {
  id: '1',
  username: 'user123',
  avatarUrl: 'https://via.placeholder.com/100?text=User+Avatar',
  description: 'This is a description of the user. Here you can find more about their interests and activities.',
  posts: [
    {
      id: '1',
      title: 'Exploring React Hooks',
      author: 'john_doe',
      content: 'I recently started using hooks in React. They are very powerful for managing state and side effects.',
      upvotes: 50,
      downvotes: 2,
      createdAt: '2024-08-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'State Management with Redux',
      author: 'jane_smith',
      content: 'Redux is a great library for state management in React applications. Here are some tips on using it effectively.',
      upvotes: 75,
      downvotes: 5,
      createdAt: '2024-08-15T14:30:00Z'
    }
  ]
};

const UserProfileView: React.FC = () => {
  const userProfile = dummyUserProfile; // Using dummy data

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center">
            <Image src={userProfile.avatarUrl || '/default-avatar.png'} roundedCircle width={100} height={100} />
            <div className="ms-3">
              <Card.Title>{userProfile.username}</Card.Title>
              <Card.Text>{userProfile.description}</Card.Text>
            </div>
          </div>
        </Card.Body>
      </Card>

      <h3>Posts by {userProfile.username}</h3>
      <ListGroup>
        {userProfile.posts.map((post: Post) => (
          <ListGroup.Item key={post.id}>
            <h5>{post.title}</h5>
            <p>{post.content}</p>
            <small>Posted by u/{post.author} - {new Date(post.createdAt).toLocaleDateString()}</small>
            <div>
              <span>{post.upvotes} upvotes</span> | <span>{post.downvotes} downvotes</span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default UserProfileView;
