/**
 * PHQ-9 Assessment Component
 */
import React, { useState } from 'react';
import { assessmentService } from '../../services/api';
import { Button, Alert, Card, LoadingSpinner } from './common/CommonComponents';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself or that you\'re a failure',
  'Trouble concentrating on things',
  'Moving or speaking so slowly that others could have noticed',
  'Thoughts that you would be better off dead'
];

export const PHQ9Assessment = () => {
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.some(a => a === null)) {
      setError('Please answer all questions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await assessmentService.submitPHQ9(answers);
      setResult(response);
      window.dispatchEvent(new Event('assessmentUpdated'));
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && result) {
    return (
      <Card>
        <h2 className="text-2xl font-bold mb-4">PHQ-9 Results</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Score</p>
            <p className="text-3xl font-bold text-blue-600">{result.score}</p>
          </div>
          <div>
            <p className="text-gray-600">Severity</p>
            <p className="text-xl font-semibold capitalize">{result.severity}</p>
          </div>
          <div>
            <p className="text-gray-600">Interpretation</p>
            <p className="mt-2">{result.interpretation}</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setSubmitted(false);
              setAnswers(Array(9).fill(null));
              setResult(null);
            }}
          >
            Take Another Assessment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">PHQ-9 Depression Assessment</h2>
      <p className="text-gray-600 mb-6">
        Over the last two weeks, how often have you been bothered by any of the following problems?
      </p>

      {error && <Alert type="error" message={error} />}

      <div className="space-y-6">
        {PHQ9_QUESTIONS.map((question, index) => (
          <div key={index} className="border-b pb-4">
            <p className="font-medium mb-3">{index + 1}. {question}</p>
            <div className="flex gap-4">
              {[
                { value: 0, label: 'Not at all' },
                { value: 1, label: 'Several days' },
                { value: 2, label: 'More than half' },
                { value: 3, label: 'Nearly every day' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={option.value}
                    checked={answers[index] === option.value}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="success"
        fullWidth
        onClick={handleSubmit}
        loading={loading}
        className="mt-6"
      >
        Submit Assessment
      </Button>
    </Card>
  );
};
