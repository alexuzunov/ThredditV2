// src/components/SubredditView.tsx

import React, { useState } from 'react';
import { Container, Card, Image, ListGroup, Button } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Subreddit } from './types';

// Define dummy data
const dummySubreddit: Subreddit = {
  id: '1',
  name: 'ReactJS',
  description: 'A subreddit for ReactJS discussions and news.',
  bannerUrl: 'https://via.placeholder.com/1200x300?text=ReactJS+Banner',
  iconUrl: 'https://via.placeholder.com/100?text=ReactJS+Icon',
  posts: [
    {
      id: '1',
      title: 'How to use hooks in React?',
      subreddit: 'ReactJS',
      content: 'Can anyone explain the basics of React hooks?',
      upvotes: 120,
      downvotes: 5,
      createdAt: '2024-08-27T10:00:00Z'
    },
    {
      id: '2',
      title: 'Best practices for state management',
      subreddit: 'JavaScript',
      content: 'What are the best practices for managing state in React?',
      upvotes: 95,
      downvotes: 3,
      createdAt: '2024-08-26T14:30:00Z'
    }
  ],
  isSubscribed: false
};

const SubredditView: React.FC = () => {
  const [subreddit, setSubreddit] = useState<Subreddit>(dummySubreddit);

  const handleSubscriptionToggle = () => {
    setSubreddit((prevSubreddit: Subreddit) => ({
      ...prevSubreddit,
      isSubscribed: !prevSubreddit.isSubscribed
    }));
  };

  const handleUpvote = (postId: string) => {
    setSubreddit((prevSubreddit: Subreddit) => ({
      ...prevSubreddit,
      posts: prevSubreddit.posts.map(post =>
        post.id === postId
          ? { ...post, upvotes: post.upvotes + 1 }
          : post
      )
    }));
  };

  const handleDownvote = (postId: string) => {
    setSubreddit((prevSubreddit) => ({
      ...prevSubreddit,
      posts: prevSubreddit.posts.map(post =>
        post.id === postId
          ? { ...post, downvotes: post.downvotes + 1 }
          : post
      )
    }));
  };

  return (
    <Container>
      <Card className="mb-4">
        {subreddit.bannerUrl && (
          <Card.Img variant="top" src={subreddit.bannerUrl} alt={`${subreddit.name} Banner`} />
        )}
        <Card.Body>
          <div className="d-flex align-items-center">
            <Image src={subreddit.iconUrl || '/default-icon.png'} roundedCircle width={50} height={50} />
            <div className="ms-3">
              <Card.Title>{subreddit.name}</Card.Title>
              <Card.Text>{subreddit.description}</Card.Text>
              <Button 
                variant={subreddit.isSubscribed ? 'outline-primary' : 'primary'} 
                onClick={handleSubscriptionToggle}
              >
                {subreddit.isSubscribed ? 'Leave' : 'Join'}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <h3>Posts in r/{subreddit.name}</h3>
      <ListGroup>
        {subreddit.posts.map((post) => (
          <ListGroup.Item key={post.id}>
            <h5>{post.title}</h5>
            <p>{post.content}</p>
            <small>Posted in r/{post.subreddit} - {new Date(post.createdAt).toLocaleDateString()}</small>
            <div className="d-flex align-items-center mt-2">
              <Button
                variant="outline-success"
                className="me-2 d-flex align-items-center"
                onClick={() => handleUpvote(post.id)}
              >
                <FaArrowUp />
              </Button>
              {post.upvotes - post.downvotes}
              <Button
                variant="outline-danger"
                className="ms-2 d-flex align-items-center"
                onClick={() => handleDownvote(post.id)}
              >
                <FaArrowDown />
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default SubredditView;
