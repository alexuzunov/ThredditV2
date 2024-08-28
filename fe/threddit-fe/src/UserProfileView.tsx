// src/components/UserProfileView.tsx

import React, { useState } from 'react';
import { Container, Card, Image, Button } from 'react-bootstrap';
import { Post } from './helpers/types';

// Dummy data for user profile and posts
const dummyUserProfile = {
  id: '2',
  username: 'john_doe',
  avatarUrl: 'https://via.placeholder.com/150?text=John+Doe',
  bio: 'Lover of React and all things JavaScript.',
  posts: [
    {
      id: '1',
      title: 'How to use hooks in React?',
      subreddit: 'ReactJS',
      content: 'Can anyone explain the basics of React hooks?',
      upvotes: 120,
      downvotes: 5,
      createdAt: '2024-08-27T10:00:00Z',
      comments: [
        {
          id: '1',
          content: 'Great question! Hooks are a powerful feature of React.',
          createdAt: '2024-08-27T11:00:00Z',
          replies: [
            {
              id: '3',
              content: 'Yes, particularly useState and useEffect.',
              createdAt: '2024-08-27T12:00:00Z'
            }
          ]
        },
        {
          id: '2',
          content: 'Check out the official React docs for a good introduction.',
          createdAt: '2024-08-27T12:00:00Z'
        }
      ]
    }
  ],
};

const UserProfileView: React.FC = () => {
  const [profileUser, setProfileUser] = useState(dummyUserProfile);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center">
            <Image src={profileUser.avatarUrl || '/default-avatar.png'} roundedCircle width={100} height={100} />
            <div className="ms-3">
              <Card.Title>@{profileUser.username}</Card.Title>
              <Card.Text>{profileUser.bio}</Card.Text>
              {profileUser.id && ( // Conditionally render Follow button
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <h3>{profileUser.username}'s Posts</h3>
      {profileUser.posts.map((post: Post) => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content}</Card.Text>
            <small>{new Date(post.createdAt).toLocaleDateString()}</small>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default UserProfileView;
