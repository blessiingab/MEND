/**
 * Community/Creative Hub Page
 */
import React, { useState } from 'react';
import { FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Loading, Badge } from '../components/common/Loading';
import { useAuth, useFetch, useForm } from '../hooks/useCustomHooks';
import { postService } from '../services/api';

export const CommunityPage = () => {
  const { user } = useAuth();
  const isTherapist = user?.role === 'therapist';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentTextByPost, setCommentTextByPost] = useState({});
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const { data: posts, loading: postsLoading, error: postsError, refetch: refetchPosts } = useFetch(
    () => postService.getAllPosts(selectedType, 20, 0),
    [selectedType]
  );

  const postsData = Array.isArray(posts) ? posts : posts?.posts || posts?.data?.posts || [];

  const validateForm = (values) => {
    const errors = {};
    if (!values.title) errors.title = 'Title is required';
    if (!values.content) errors.content = 'Content is required';
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
    { title: '', content: '' },
    async (formValues) => {
      setIsSubmitting(true);
      const publishType = selectedType === 'all' ? 'creative' : selectedType;

      try {
        await postService.createPost(formValues.title, formValues.content, publishType);
        setSuccessMessage('Post created successfully.');
        reset();
        setShowCreateModal(false);
        refetchPosts();
        window.dispatchEvent(new Event('communityUpdated'));
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setSuccessMessage('Error creating post: ' + (err.message || 'Unable to create post'));
      } finally {
        setIsSubmitting(false);
      }
    },
    validateForm
  );

  const handleLikePost = async (postId) => {
    try {
      const likeResult = await postService.likePost(postId);
      if (likeResult?.liked === false) {
        await postService.unlikePost(postId);
      }
      refetchPosts();
      window.dispatchEvent(new Event('communityUpdated'));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await postService.getPostComments(postId, 1000000, 0);
      const comments = Array.isArray(response) ? response : response?.comments || [];
      setCommentsByPost((prev) => ({ ...prev, [postId]: comments }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const toggleComments = (postId) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        fetchComments(postId);
      }
      return next;
    });
  };

  const handleCommentChange = (postId, text) => {
    setCommentTextByPost((prev) => ({ ...prev, [postId]: text }));
  };

  const submitComment = async (postId) => {
    const content = (commentTextByPost[postId] || '').trim();
    if (!content) return;

    try {
      await postService.createComment(postId, content);
      setCommentTextByPost((prev) => ({ ...prev, [postId]: '' }));
      await fetchComments(postId);
      refetchPosts();
      window.dispatchEvent(new Event('communityUpdated'));
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Creative Hub</h1>
            <p className="text-gray-600 mt-2">Share your stories and connect with our community</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            + Create Post
          </Button>
        </div>

        {successMessage && (
          <Alert
            type={successMessage.toLowerCase().includes('error') ? 'error' : 'success'}
            message={successMessage}
            dismissible
            onClose={() => setSuccessMessage('')}
            autoClose
          />
        )}

        <div className="flex gap-3 mb-8 flex-wrap">
          {['all', 'creative', 'story', 'inspiration', 'question', 'art'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {postsLoading ? (
            <Loading message="Loading posts..." />
          ) : postsError ? (
            <Alert type="error" message={postsError} />
          ) : postsData.length > 0 ? (
            postsData.map((post) => {
              const loadedComments = commentsByPost[post.id] || [];
              const likeCount = Number(post.likes ?? post.likes_count ?? post.likesCount ?? 0);
              const backendCommentCount = Number(post.comments_count ?? post.comment_count ?? post.commentsCount ?? 0);
              const commentCount = Math.max(backendCommentCount, loadedComments.length);

              return (
                <Card key={post.id} hoverable>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          by {post.authorName || `${post.first_name || ''} ${post.last_name || ''}`.trim() || 'Unknown'} - {new Date(post.created_at || post.createdAt).toLocaleDateString()}
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
                        <FaHeart className="text-lg" />
                        <span className="text-sm">{likeCount} Likes</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                      >
                        <FaRegCommentDots className="text-lg" />
                        <span className="text-sm">{commentCount} Comments</span>
                      </button>
                    </div>

                    {expandedPosts.has(post.id) && (
                      <div className="pt-4">
                        {loadedComments.length > 0 ? (
                          <div className="space-y-2 mb-3">
                            {loadedComments.map((comment) => (
                              <div key={comment.id} className="border p-2 rounded bg-gray-50 dark:bg-gray-800">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  by {comment.first_name || comment.name || 'User'} - {new Date(comment.created_at || comment.createdAt).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mb-3">No comments yet. Be first to comment!</p>
                        )}

                        <div className="flex gap-2">
                          <input
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
                            placeholder="Write a comment..."
                            value={commentTextByPost[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          />
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => submitComment(post.id)}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })
          ) : (
            <Alert
              type="info"
              message={`No ${selectedType} posts yet. Be the first to share!`}
              dismissible={false}
            />
          )}
        </div>

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
              <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
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
              {touched.content && errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
