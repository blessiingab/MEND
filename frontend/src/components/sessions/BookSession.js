/**
 * Session Booking Component
 */
import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/api';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Loading } from '../common/Loading';

export const BookSession = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [startTime, setStartTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    setError('');
    try {
      const response = await sessionService.getAvailableTherapists();
      const therapistList = Array.isArray(response)
        ? response
        : response?.therapists || response?.data?.therapists || [];
      setTherapists(therapistList);
    } catch (err) {
      setError(err.message || 'Failed to load therapists');
    } finally {
      setLoadingTherapists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTherapist || !startTime) {
      setError('Please select a therapist and date/time');
      return;
    }

    setLoading(true);

    try {
      const startIso = new Date(startTime).toISOString();
      const end = new Date(new Date(startTime).getTime() + 60 * 60000).toISOString();
      const response = await sessionService.bookSession(
        Number(selectedTherapist),
        startIso,
        end,
        notes
      );
      setSuccess('Session booked successfully!');
      setSelectedTherapist('');
      setStartTime('');
      setNotes('');
    } catch (err) {
      setError(err.message || 'Failed to book session');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTherapists) {
    return <Loading message="Loading available therapists..." />;
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Book a Therapy Session</h2>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {therapists.length === 0 && (
        <Alert
          type="info"
          message="No licensed therapists are currently available. Please check back later."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Therapist
          </label>
          <select
            value={selectedTherapist}
            onChange={(e) => setSelectedTherapist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choose a therapist --</option>
            {therapists.map(therapist => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.first_name} {therapist.last_name}
                {therapist.specialization ? ` - ${therapist.specialization}` : ''}
                {therapist.experience_years ? ` (${therapist.experience_years} years exp.)` : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedTherapist && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Selected Therapist</h3>
            {(() => {
              const therapist = therapists.find(t => t.id === parseInt(selectedTherapist));
              return therapist ? (
                <div>
                  <p className="font-medium">{therapist.first_name} {therapist.last_name}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    {therapist.specialization || 'General Therapy'}
                  </p>
                  {therapist.experience_years ? (
                    <p className="text-sm text-gray-600 mb-1">Experience: {therapist.experience_years} years</p>
                  ) : null}
                  {therapist.expertise_area ? (
                    <p className="text-sm text-gray-600 mb-1">Expertise: {therapist.expertise_area}</p>
                  ) : null}
                  {therapist.license_number ? (
                    <p className="text-sm text-gray-600 mb-1">License: {therapist.license_number}</p>
                  ) : null}
                  {therapist.bio && <p className="text-sm text-gray-700 mt-2">{therapist.bio}</p>}
                </div>
              ) : null;
            })()}
          </div>
        )}

        <Input
          label="Session Date & Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific topics you'd like to discuss?"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        <Button
          variant="success"
          fullWidth
          loading={loading}
          type="submit"
          disabled={therapists.length === 0}
        >
          Book Session
        </Button>
      </form>
    </Card>
  );
};
