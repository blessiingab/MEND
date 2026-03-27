/**
 * Assessments Page Component
 */
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Alert } from '../components/common/Alert';
import { Loading, Badge } from '../components/common/Loading';
import { useFetch } from '../hooks/useCustomHooks';
import { assessmentService } from '../services/api';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or oversleeping',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself',
  'Trouble concentrating on things',
  'Moving or speaking slowly, or opposite - being fidgety',
  'Thoughts that you would be better off dead'
];

const GAD7_QUESTIONS = [
  'Feeling nervous, anxious or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
];

export const AssessmentsPage = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentType, setAssessmentType] = useState('phq9');
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: assessmentHistory, loading: historyLoading, refetch } = useFetch(
    () => assessmentService.getHistory(),
    [] // Only fetch once on component mount
  );

  const questions = assessmentType === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;

  const handleStartAssessment = (type) => {
    setAssessmentType(type);
    setAnswers(new Array(type === 'phq9' ? 9 : 7).fill(0));
    setShowModal(true);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = assessmentType === 'phq9' 
        ? assessmentService.submitPHQ9 
        : assessmentService.submitGAD7;
      
      const response = await endpoint(answers);
      const score = response?.score || response?.data?.score || 'N/A';
      setSubmitMessage(`✓ Assessment submitted successfully! Score: ${score}`);
      window.dispatchEvent(new Event('assessmentUpdated'));
      setShowModal(false);
      setAnswers([]);
      refetch();
      
      setTimeout(() => setSubmitMessage(''), 3000);
    } catch (error) {
      setSubmitMessage('✕ Error submitting assessment: ' + (error.message || error?.msg || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreLevel = (score, type) => {
    if (type === 'phq9') {
      if (score <= 4) return { level: 'Minimal', color: 'success' };
      if (score <= 9) return { level: 'Mild', color: 'warning' };
      if (score <= 14) return { level: 'Moderate', color: 'warning' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'error' };
      return { level: 'Severe', color: 'error' };
    } else {
      if (score <= 4) return { level: 'Minimal', color: 'success' };
      if (score <= 9) return { level: 'Mild', color: 'warning' };
      if (score <= 14) return { level: 'Moderate', color: 'warning' };
      return { level: 'Severe', color: 'error' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mental Health Assessments</h1>
          <p className="text-gray-600 mt-2">Track your mental wellness with evidence-based assessments</p>
        </div>

        {submitMessage && (
          <Alert
            type={submitMessage.includes('✓') ? 'success' : 'error'}
            message={submitMessage}
            dismissible
            onClose={() => setSubmitMessage('')}
            autoClose
          />
        )}

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* PHQ-9 Assessment */}
          <Card hoverable>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">PHQ-9</h2>
              <p className="text-sm text-gray-600 mt-1">Patient Health Questionnaire - Depression</p>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-700">
                Assess severity of depression symptoms with this 9-question screening tool.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm text-gray-700">
                  <strong>Scoring:</strong> 0-4 (Minimal), 5-9 (Mild), 10-14 (Moderate), 15-19 (Moderately Severe), 20+ (Severe)
                </p>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleStartAssessment('phq9')}
              >
                Start Assessment
              </Button>
            </CardBody>
          </Card>

          {/* GAD-7 Assessment */}
          <Card hoverable>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">GAD-7</h2>
              <p className="text-sm text-gray-600 mt-1">Generalized Anxiety Disorder Screening</p>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-700">
                Assess severity of anxiety symptoms with this 7-question screening tool.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                <p className="text-sm text-gray-700">
                  <strong>Scoring:</strong> 0-4 (Minimal), 5-9 (Mild), 10-14 (Moderate), 15+ (Severe)
                </p>
              </div>
              <Button
                variant="success"
                fullWidth
                onClick={() => handleStartAssessment('gad7')}
              >
                Start Assessment
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Assessment History */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Your Assessment History</h2>
          </CardHeader>
          <CardBody>
            {historyLoading ? (
              <Loading message="Loading assessment history..." />
            ) : assessmentHistory && assessmentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Assessment</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Score</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assessmentHistory.map((assessment) => {
                      const scoreLevel = getScoreLevel(assessment.score, assessment.type);
                      return (
                        <tr key={assessment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(assessment.createdAt || assessment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            {assessment.type === 'phq9' ? 'PHQ-9' : 'GAD-7'}
                          </td>
                          <td className="px-4 py-3 text-gray-600 font-bold">{assessment.score}</td>
                          <td className="px-4 py-3">
                            <Badge variant={scoreLevel.color}>{scoreLevel.level}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Alert
                type="info"
                message="No assessments completed yet. Start with an assessment above!"
                dismissible={false}
              />
            )}
          </CardBody>
        </Card>

        {/* Assessment Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${assessmentType.toUpperCase()} Assessment`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmitAssessment}
                loading={isSubmitting}
              >
                Submit Assessment
              </Button>
            </>
          }
        >
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {questions.map((question, index) => (
              <div key={index} className="border-b pb-4">
                <p className="font-semibold text-gray-900 mb-3">{index + 1}. {question}</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3].map((value) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={value}
                        checked={answers[index] === value}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        {['Not at all', 'Few Days', 'Half the Days', 'Nearly Every Day'][value]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};
