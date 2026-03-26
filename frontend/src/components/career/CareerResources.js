/**
 * Career Resources Component
 */
import React, { useState, useEffect } from 'react';
import { careerService } from '../services/api';
import { Card, LoadingSpinner, Alert } from './common/CommonComponents';

export const CareerResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [selectedType]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await careerService.getResources(selectedType);
      setResources(response.data.resources || response.data);
    } catch (err) {
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Career Resources</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded ${!selectedType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {['course', 'guide', 'research'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded capitalize ${
                selectedType === type ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map(resource => (
          <Card key={resource.id}>
            <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                {resource.type}
              </span>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Visit →
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
