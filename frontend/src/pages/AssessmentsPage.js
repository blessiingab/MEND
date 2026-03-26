/**
 * Assessments Page
 */
import React, { useState } from 'react';
import { PHQ9Assessment } from '../components/assessment/PHQ9Assessment';
import { GAD7Assessment } from '../components/assessment/GAD7Assessment';

export const AssessmentsPage = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('phq9');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mental Health Assessments</h1>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setSelectedAssessment('phq9')}
          className={`px-6 py-3 rounded font-semibold transition ${
            selectedAssessment === 'phq9'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          PHQ-9 (Depression)
        </button>
        <button
          onClick={() => setSelectedAssessment('gad7')}
          className={`px-6 py-3 rounded font-semibold transition ${
            selectedAssessment === 'gad7'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          GAD-7 (Anxiety)
        </button>
      </div>

      {selectedAssessment === 'phq9' && <PHQ9Assessment />}
      {selectedAssessment === 'gad7' && <GAD7Assessment />}
    </div>
  );
};
