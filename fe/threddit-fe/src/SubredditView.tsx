// src/components/SubredditView.tsx

import React, { useState } from 'react';
import { Container, Card, Image, ListGroup, Button, Collapse } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { IoChatboxOutline } from "react-icons/io5";
import { Comment, Post, Subreddit } from './helpers/types';

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
  isSubscribed: false
};

const SubredditView: React.FC = () => {
  const [subreddit, setSubreddit] = useState<Subreddit>(dummySubreddit);
  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());

  const handleSubscriptionToggle = () => {
    setSubreddit((prevSubreddit) => ({
      ...prevSubreddit,
      isSubscribed: !prevSubreddit.isSubscribed
    }));
  };

  const handleUpvote = (postId: string) => {
    setSubreddit((prevSubreddit) => ({
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

  const toggleComments = (postId: string) => {
    setVisibleComments((prev) => {
      const newVisibleComments = new Set(prev);
      if (newVisibleComments.has(postId)) {
        newVisibleComments.delete(postId);
      } else {
        newVisibleComments.add(postId);
      }
      return newVisibleComments;
    });
  };

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <Card key={comment.id} className="mb-2">
        <Card.Body>
          <p>{comment.content}</p>
          <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 ms-4">
              {renderComments(comment.replies)} {/* Recursive rendering for nested comments */}
            </div>
          )}
        </Card.Body>
      </Card>
    ));
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
        {subreddit.posts.map((post: Post) => (
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
                <FaArrowUp className="me-1" />
                {post.upvotes}
              </Button>
              <Button
                variant="outline-danger"
                className="me-2 d-flex align-items-center"
                onClick={() => handleDownvote(post.id)}
              >
                <FaArrowDown className="me-1" />
                {post.downvotes}
              </Button>
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center"
                onClick={() => toggleComments(post.id)}
              >
                <IoChatboxOutline className="me-1" />
                {post.comments.length}
              </Button>
            </div>
            <Collapse in={visibleComments.has(post.id)}>
              <div className="mt-3">
                {renderComments(post.comments)}
              </div>
            </Collapse>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default SubredditView;
