/**
 * Career Guidance Component
 */
import React, { useState } from 'react';
import { careerService } from '../services/api';
import { Button, Alert, Card, Input, LoadingSpinner } from './common/CommonComponents';

export const CareerGuidance = () => {
  const [careerGoal, setCareerGoal] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!careerGoal || !currentRole) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // In a real app, you'd have an AI service generating guidance
      const mockGuidance = `
        Based on your goal to become ${careerGoal} from your current role as ${currentRole},
        here's your personalized path:
        
        1. Skills Development: Focus on learning relevant technologies and soft skills
        2. Networking: Connect with professionals in your target field
        3. Experience: Seek projects or roles that align with your goal
        4. Certification: Consider industry-relevant certifications
        5. Mentorship: Find a mentor in your target field
      `;

      const response = await careerService.createGuidanceSession(
        careerGoal,
        currentRole,
        experience,
        mockGuidance,
        [
          'Build foundational skills',
          'Network with professionals',
          'Seek relevant projects',
          'Pursue certifications',
          'Find a mentor'
        ]
      );

      setGuidance(mockGuidance);
      setCareerGoal('');
      setCurrentRole('');
      setExperience('');
    } catch (err) {
      setError(err.message || 'Failed to get guidance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Career Guidance</h2>

      {error && <Alert type="error" message={error} />}

      {!guidance ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Role"
            placeholder="e.g., Junior Developer"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            required
          />

          <Input
            label="Career Goal"
            placeholder="e.g., Senior Full-Stack Developer"
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5"
            />
          </div>

          <Button
            variant="success"
            fullWidth
            loading={loading}
            type="submit"
          >
            Get Personalized Guidance
          </Button>
        </form>
      ) : (
        <div>
          <Alert type="success" message="Your personalized career guidance:" />
          <div className="bg-gray-50 p-4 rounded mt-4 mb-4 text-sm whitespace-pre-line">
            {guidance}
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={() => setGuidance(null)}
          >
            Get Another Guidance
          </Button>
        </div>
      )}
    </Card>
  );
};
