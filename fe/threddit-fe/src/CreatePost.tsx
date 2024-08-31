import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Card, Tabs, Tab, Image } from 'react-bootstrap';
import axiosInstance from './helpers/axiosInstance';

interface PostCreationFormInputs {
  title: string;
  content?: string;
  url?: string;
  image?: FileList;
  subredditID: string;
}

interface Subreddit {
  id: string;
  name: string;
}

const CreatePost: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PostCreationFormInputs>();
  const [activeTab, setActiveTab] = useState<string>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  useEffect(() => {
    // Fetch subreddits the user has joined
    const fetchSubreddits = async () => {
      try {
        const response = await axiosInstance.get('/user/subreddits');
        setSubreddits(response.data);
      } catch (error) {
        console.error('Failed to load subreddits:', error);
      }
    };

    fetchSubreddits();
  }, []);

  const onSubmit = async (data: PostCreationFormInputs) => {
    try {
      let payload: any = {
        title: data.title,
      };

      if (activeTab === 'text') {
        payload.content = data.content;
      } else if (activeTab === 'link') {
        payload.url = data.url;
      } else if (activeTab === 'image' && data.image?.[0]) {
        const imageFile = data.image[0];
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
          const imageBase64 = reader.result as string;
          payload.image = imageBase64;
          payload.image_name = imageFile.name;

          await postToServer(payload);
        };

        return;
      }

      await postToServer(payload);

    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const postToServer = async (payload: any) => {
    try {
      const response = await axiosInstance.post(`api/posts`, payload);
      console.log('Post created successfully:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow-sm" style={{ width: '30rem' }}>
        <Card.Body>
          {/* Title at the Top */}
          <Card.Title className="text-center mb-4">Create a Post</Card.Title>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="postSubreddit">
              <Form.Label>Choose a Subreddit</Form.Label>
              <Form.Control
                as="select"
                {...register('subredditID', { required: 'Please select a subreddit' })}
                isInvalid={!!errors.subredditID}
              >
                <option value="">Select a subreddit...</option>
                {subreddits.map((subreddit) => (
                  <option key={subreddit.id} value={subreddit.id}>
                    {subreddit.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.subredditID?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Tabs Defined First */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'text')}
              className="mb-3"
            >
              <Tab eventKey="text" title="Text" />
              <Tab eventKey="link" title="Link" />
              <Tab eventKey="image" title="Image" />
            </Tabs>

            {/* Form Fields Based on Selected Tab */}
          
            <Form.Group className="mb-3" controlId="postTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                {...register('title', { required: 'Title is required' })}
                isInvalid={!!errors.title}
                placeholder="Enter the title of your post"
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {activeTab === 'text' && (
              <Form.Group className="mb-3" controlId="postContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  {...register('content', { required: activeTab === 'text' ? 'Content is required' : false })}
                  isInvalid={!!errors.content}
                  placeholder="Enter the content of your post"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.content?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {activeTab === 'link' && (
              <Form.Group className="mb-3" controlId="postUrl">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="url"
                  {...register('url', { required: activeTab === 'link' ? 'URL is required' : false, pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i })}
                  isInvalid={!!errors.url}
                  placeholder="Enter the URL"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.url?.message || 'Please enter a valid URL'}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {activeTab === 'image' && (
              <Form.Group className="mb-3" controlId="postImage">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  {...register('image', { required: activeTab === 'image' ? 'Image is required' : false })}
                  isInvalid={!!errors.image}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image?.message}
                </Form.Control.Feedback>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <Image src={imagePreview} alt="Image Preview" fluid rounded />
                  </div>
                )}
              </Form.Group>
            )}

            <Button type="submit" className="w-100" variant="primary">Post</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePost;
