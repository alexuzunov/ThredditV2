// SubredditView.tsx

import React from 'react';
import { Container, Card, Image, ListGroup, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Subreddit } from './helpers/types';

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
      voteStatus: 'none',
      createdAt: '2024-08-27T10:00:00Z',
      comments: [
        {
          id: '1',
          content: 'Great question! Hooks are a powerful feature of React.',
          createdAt: '2024-08-27T11:00:00Z',
          upvotes: 20,
          downvotes: 2,
          voteStatus: 'none', // Tracking vote status for comments
          replies: [
            {
              id: '3',
              content: 'Yes, particularly useState and useEffect.',
              createdAt: '2024-08-27T12:00:00Z',
              upvotes: 10,
              downvotes: 1,
              voteStatus: 'none',
              replies: []
            }
          ]
        },
        {
          id: '2',
          content: 'Check out the official React docs for a good introduction.',
          createdAt: '2024-08-27T12:00:00Z',
          upvotes: 15,
          downvotes: 0,
          voteStatus: 'none',
          replies: []
        }
      ]
    }
  ],
  isSubscribed: false
};

const SubredditView: React.FC = () => {
  const { subredditName } = useParams();
  const navigate = useNavigate();
  const [subreddit, setSubreddit] = React.useState<Subreddit>(dummySubreddit);

  const handleSubscriptionToggle = () => {
    setSubreddit((prevSubreddit) => ({
      ...prevSubreddit,
      isSubscribed: !prevSubreddit.isSubscribed
    }));
  };

  const handlePostClick = (postId: string) => {
    navigate(`/r/${subredditName}/posts/${postId}`);
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
          <ListGroup.Item key={post.id} onClick={() => handlePostClick(post.id)} style={{ cursor: 'pointer' }}>
            <h5>{post.title}</h5>
            <p>{post.content}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default SubredditView;
