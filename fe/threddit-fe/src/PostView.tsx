// PostView.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Collapse, Form, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { IoChatboxOutline } from 'react-icons/io5';
import { Comment, Post } from './helpers/types';

const dummyPosts: Post[] = [
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
          voteStatus: 'none',
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
  ];
  

const PostView: React.FC = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [visibleComments, setVisibleComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate fetching post data
    const fetchedPost = dummyPosts.find(p => p.id === postId);
    setPost(fetchedPost || null);
  }, [postId]);

  const toggleVotePost = (voteType: 'upvote' | 'downvote') => {
    if (post) {
      setPost(prevPost => {
        let newUpvotes = prevPost!.upvotes;
        let newDownvotes = prevPost!.downvotes;
        let newVoteStatus = prevPost!.voteStatus;

        if (voteType === 'upvote') {
          if (newVoteStatus === 'upvoted') {
            newUpvotes -= 1;
            newVoteStatus = 'none';
          } else {
            newUpvotes += 1;
            if (newVoteStatus === 'downvoted') {
              newDownvotes -= 1;
            }
            newVoteStatus = 'upvoted';
          }
        } else if (voteType === 'downvote') {
          if (newVoteStatus === 'downvoted') {
            newDownvotes -= 1;
            newVoteStatus = 'none';
          } else {
            newDownvotes += 1;
            if (newVoteStatus === 'upvoted') {
              newUpvotes -= 1;
            }
            newVoteStatus = 'downvoted';
          }
        }

        return { ...prevPost!, upvotes: newUpvotes, downvotes: newDownvotes, voteStatus: newVoteStatus };
      });
    }
  };

  const toggleVoteComment = (commentId: string, voteType: 'upvote' | 'downvote', comments: Comment[]): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        let newUpvotes = comment.upvotes;
        let newDownvotes = comment.downvotes;
        let newVoteStatus = comment.voteStatus;

        if (voteType === 'upvote') {
          if (newVoteStatus === 'upvoted') {
            newUpvotes -= 1;
            newVoteStatus = 'none';
          } else {
            newUpvotes += 1;
            if (newVoteStatus === 'downvoted') {
              newDownvotes -= 1;
            }
            newVoteStatus = 'upvoted';
          }
        } else if (voteType === 'downvote') {
          if (newVoteStatus === 'downvoted') {
            newDownvotes -= 1;
            newVoteStatus = 'none';
          } else {
            newDownvotes += 1;
            if (newVoteStatus === 'upvoted') {
              newUpvotes -= 1;
            }
            newVoteStatus = 'downvoted';
          }
        }

        return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes, voteStatus: newVoteStatus };
      }

      if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: toggleVoteComment(commentId, voteType, comment.replies) };
      }

      return comment;
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setPost(prevPost => {
        const updatedComments = [
          ...(prevPost!.comments || []),
          {
            id: new Date().toISOString(),
            content: newComment,
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            voteStatus: 'none',
            replies: []
          }
        ];
        return { ...prevPost!, comments: updatedComments };
      });
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyText[commentId]?.trim()) {
      setPost(prevPost => {
        const updatedComments = prevPost!.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [
                ...(comment.replies as Comment[]),
                {
                  id: new Date().toISOString(),
                  content: replyText[commentId],
                  createdAt: new Date().toISOString(),
                  upvotes: 0,
                  downvotes: 0,
                  voteStatus: 'none',
                  replies: []
                }
              ]
            };
          }
          return comment;
        });

        return { ...prevPost!, comments: updatedComments };
      });
      setReplyText({ ...replyText, [commentId]: '' });
      setReplyingTo(prev => {
        const newReplyingTo = new Set(prev);
        newReplyingTo.delete(commentId);
        return newReplyingTo;
      });
    }
  };

  const renderComments = (comments: Comment[]) => {
    return comments.map(comment => (
      <Card key={comment.id} className="mb-2">
        <Card.Body>
          <div className="d-flex align-items-center">
            <Button
              variant={comment.voteStatus === 'upvoted' ? 'success' : 'outline-success'}
              size="sm"
              className="me-2"
              onClick={() => {
                if (post) {
                  setPost(prevPost => ({
                    ...prevPost!,
                    comments: toggleVoteComment(comment.id, 'upvote', prevPost!.comments)
                  }));
                }
              }}
            >
              <FaArrowUp />
              <span className="ms-1">{comment.upvotes}</span>
            </Button>
            <Button
              variant={comment.voteStatus === 'downvoted' ? 'danger' : 'outline-danger'}
              size="sm"
              className="me-2"
              onClick={() => {
                if (post) {
                  setPost(prevPost => ({
                    ...prevPost!,
                    comments: toggleVoteComment(comment.id, 'downvote', prevPost!.comments)
                  }));
                }
              }}
            >
              <FaArrowDown />
              <span className="ms-1">{comment.downvotes}</span>
            </Button>
            <div>
              <p className="mb-1">{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            className="mt-2 ps-0"
            onClick={() => {
              setReplyingTo(prev => {
                const newReplyingTo = new Set(prev);
                if (newReplyingTo.has(comment.id)) {
                  newReplyingTo.delete(comment.id);
                } else {
                  newReplyingTo.add(comment.id);
                }
                return newReplyingTo;
              });
            }}
          >
            {replyingTo.has(comment.id) ? 'Cancel' : 'Reply'}
          </Button>
          {replyingTo.has(comment.id) && (
            <Form>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Write a reply..."
                value={replyText[comment.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
              />
              <Button
                variant="primary"
                size="sm"
                className="mt-2"
                onClick={() => handleReply(comment.id)}
              >
                Submit Reply
              </Button>
            </Form>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 ms-4">
              {renderComments(comment.replies)}
            </div>
          )}
        </Card.Body>
      </Card>
    ));
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>{post.content}</Card.Text>
          <div className="d-flex align-items-center">
            <Button
              variant={post.voteStatus === 'upvoted' ? 'success' : 'outline-success'}
              size="sm"
              className="me-2"
              onClick={() => toggleVotePost('upvote')}
            >
              <FaArrowUp />
              <span className="ms-1">{post.upvotes}</span>
            </Button>
            <Button
              variant={post.voteStatus === 'downvoted' ? 'danger' : 'outline-danger'}
              size="sm"
              className="me-2"
              onClick={() => toggleVotePost('downvote')}
            >
              <FaArrowDown />
              <span className="ms-1">{post.downvotes}</span>
            </Button>
            <Button
              variant="link"
              className="ms-auto"
              onClick={() => setVisibleComments(prev => !prev)}
            >
              <IoChatboxOutline /> {post.comments.length} Comments
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Collapse in={visibleComments}>
        <div>
          <h4>Comments</h4>
          <ListGroup>
            {renderComments(post.comments)}
          </ListGroup>
        </div>
      </Collapse>

      <Form>
        <Form.Group controlId="newComment">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          className="mt-2"
          onClick={handleAddComment}
        >
          Submit Comment
        </Button>
      </Form>
    </Container>
  );
};

export default PostView;
