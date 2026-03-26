/**
 * Career Page
 */
import React, { useState } from 'react';
import { CareerGuidance } from '../components/career/CareerGuidance';
import { CareerResources } from '../components/career/CareerResources';

export const CareerPage = () => {
  const [selectedTab, setSelectedTab] = useState('guidance');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Career Guidance</h1>

      <div className="mb-8 flex gap-4 border-b">
        <button
          onClick={() => setSelectedTab('guidance')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            selectedTab === 'guidance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Get Guidance
        </button>
        <button
          onClick={() => setSelectedTab('resources')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            selectedTab === 'resources'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Resources
        </button>
      </div>

      {selectedTab === 'guidance' && <CareerGuidance />}
      {selectedTab === 'resources' && <CareerResources />}
    </div>
  );
};
