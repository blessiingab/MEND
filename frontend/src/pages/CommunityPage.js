/**
 * Community/Creative Hub Page
 */
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Loading, Badge } from '../components/common/Loading';
import { useFetch, useForm } from '../hooks/useCustomHooks';
import { postService } from '../services/api';

export const CommunityPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('creative');

  const { data: posts, loading: postsLoading, refetch: refetchPosts } = useFetch(
    () => postService.getAllPosts(selectedType, 20, 0),
    [selectedType]
  );

  const validateForm = (values) => {
    const errors = {};
    if (!values.title) errors.title = 'Title is required';
    if (!values.content) errors.content = 'Content is required';
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
    { title: '', content: '' },
    async (values) => {
      setIsSubmitting(true);
      try {
        await postService.createPost(values.title, values.content, selectedType);
        setSuccessMessage('✓ Post created successfully!');
        resetForm();
        setShowCreateModal(false);
        refetchPosts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setSuccessMessage('✕ Error creating post: ' + err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    validateForm
  );

  const handleLikePost = async (postId) => {
    try {
      await postService.likePost(postId);
      refetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Creative Hub</h1>
            <p className="text-gray-600 mt-2">Share your stories and connect with our community</p>
          </div>
          <Button 
            variant="primary"
            size="lg"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Post
          </Button>
        </div>

        {successMessage && (
          <Alert
            type={successMessage.includes('✓') ? 'success' : 'error'}
            message={successMessage}
            dismissible
            onClose={() => setSuccessMessage('')}
            autoClose
          />
        )}

        {/* Type Filter */}
        <div className="flex gap-3 mb-8">
          {['creative', 'story', 'inspiration', 'question'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {postsLoading ? (
            <Loading message="Loading posts..." />
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} hoverable>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="primary">{post.type}</Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
                    >
                      <span className="text-lg">❤️</span>
                      <span className="text-sm">{post.likesCount || 0} Likes</span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">💬</span>
                      <span className="text-sm">{post.commentsCount || 0} Comments</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <Alert
              type="info"
              message={`No ${selectedType} posts yet. Be the first to share!`}
              dismissible={false}
            />
          )}
        </div>

        {/* Create Post Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Post"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                loading={isSubmitting}
              >
                Publish Post
              </Button>
            </>
          }
        >
          <form className="space-y-4">
            <Input
              label="Title"
              name="title"
              placeholder="Give your post a title..."
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title ? errors.title : ''}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Share your thoughts, story, or inspiration..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  touched.content && errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="6"
              />
              {touched.content && errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
