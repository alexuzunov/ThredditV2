import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Card, Image } from 'react-bootstrap';

interface SubredditCreationFormInputs {
  name: string;
  description: string;
  privacy: string;
  banner?: FileList;
  icon?: FileList;
}

const CreateSubreddit: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SubredditCreationFormInputs>();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const onSubmit = (data: SubredditCreationFormInputs) => {
    console.log(data);
    // Handle subreddit creation logic here
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIconPreview(null);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow-sm" style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Create a Subreddit</Card.Title>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Subreddit Name */}
            <Form.Group className="mb-3" controlId="subredditName">
              <Form.Label>Subreddit Name</Form.Label>
              <Form.Control
                type="text"
                {...register('name', { required: 'Subreddit name is required' })}
                isInvalid={!!errors.name}
                placeholder="Enter the name of your subreddit"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3" controlId="subredditDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                {...register('description', { required: 'Description is required' })}
                isInvalid={!!errors.description}
                placeholder="Enter a brief description of your subreddit"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Privacy Type with Radio Buttons */}
            <Form.Group className="mb-4" controlId="subredditPrivacy">
              <Form.Label>Privacy Type</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Public"
                  id="privacyPublic"
                  value="public"
                  {...register('privacy', { required: 'Please select a privacy type' })}
                  isInvalid={!!errors.privacy}
                />
                <Form.Check
                  type="radio"
                  label="Restricted"
                  id="privacyRestricted"
                  value="restricted"
                  {...register('privacy', { required: 'Please select a privacy type' })}
                  isInvalid={!!errors.privacy}
                />
                <Form.Check
                  type="radio"
                  label="Private"
                  id="privacyPrivate"
                  value="private"
                  {...register('privacy', { required: 'Please select a privacy type' })}
                  isInvalid={!!errors.privacy}
                />
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.privacy?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Banner Image Upload */}
            <Form.Group className="mb-4" controlId="subredditBanner">
              <Form.Label>Upload Banner Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                {...register('banner')}
                accept="image/*"
                onChange={handleBannerChange}
              />
              {/* Banner Preview */}
              {bannerPreview && (
                <div className="mt-3">
                  <Image src={bannerPreview} alt="Banner Preview" fluid rounded />
                </div>
              )}
            </Form.Group>

            {/* Icon Image Upload */}
            <Form.Group className="mb-4" controlId="subredditIcon">
              <Form.Label>Upload Icon Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                {...register('icon')}
                accept="image/*"
                onChange={handleIconChange}
              />
              {/* Icon Preview */}
              {iconPreview && (
                <div className="mt-3">
                  <Image src={iconPreview} alt="Icon Preview" fluid roundedCircle />
                </div>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" className="w-100" variant="primary">Create Subreddit</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateSubreddit;
