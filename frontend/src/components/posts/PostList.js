/**
 * Post List Component
 */
import React, { useState, useEffect } from 'react';
import { postService } from '../services/api';
import { Card, LoadingSpinner, Button, Alert } from './common/CommonComponents';
import { useAuth } from '../hooks/useCustomHooks';

export const PostList = ({ filterType = null }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    fetchPosts();
  }, [filterType]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts(filterType);
      setPosts(response.data.posts || response.data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (likedPosts.has(postId)) {
        await postService.unlikePost(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await postService.likePost(postId);
        setLikedPosts(prev => new Set(prev).add(postId));
      }
      fetchPosts();
    } catch (err) {
      console.error('Failed to toggle like');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">No posts found</p>
        </Card>
      ) : (
        posts.map(post => (
          <Card key={post.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  by {post.first_name} {post.last_name}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                {post.type}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{post.content.substring(0, 200)}...</p>

            <div className="flex gap-4 items-center">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  likedPosts.has(post.id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ❤️ {post.likes || 0}
              </button>
              <a
                href={`/post/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                Read More
              </a>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
