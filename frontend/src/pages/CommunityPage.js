/**
 * Community Page
 */
import React, { useState } from 'react';
import { CreatePost } from '../components/posts/CreatePost';
import { PostList } from '../components/posts/PostList';

export const CommunityPage = () => {
  const [filterType, setFilterType] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community</h1>

      <div className="mb-8">
        <CreatePost onSuccess={() => setRefresh(!refresh)} />
      </div>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setFilterType(null)}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterType === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilterType('story')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterType === 'story'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Stories
        </button>
        <button
          onClick={() => setFilterType('art')}
          className={`px-4 py-2 rounded font-semibold transition ${
            filterType === 'art'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Art
        </button>
      </div>

      <PostList filterType={filterType} key={refresh} />
    </div>
  );
};
