/**
 * Create Post Component
 */
import React, { useState } from 'react';
import { postService } from '../services/api';
import { Button, Alert, Card, Input } from './common/CommonComponents';

export const CreatePost = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('story');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await postService.createPost(title, content, type);
      setTitle('');
      setContent('');
      setType('story');
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Share Your Story</h2>

      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Give your post a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="story">Story</option>
            <option value="art">Art</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story or describe your artwork..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          ></textarea>
        </div>

        <Button
          variant="success"
          fullWidth
          loading={loading}
          type="submit"
        >
          Publish Post
        </Button>
      </form>
    </Card>
  );
};
