/**
 * Session Booking Component
 */
import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/api';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Card, CardBody, CardHeader } from '../common/Card';
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
    try {
      const response = await sessionService.getAvailableTherapists();
      setTherapists(response.data.therapists || response.data);
    } catch (err) {
      setError('Failed to load therapists');
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
      const end = new Date(new Date(startTime).getTime() + 60 * 60000).toISOString();
      const response = await sessionService.bookSession(
        selectedTherapist,
        startTime,
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
    return <Loading />;
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Book a Therapy Session</h2>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

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
              </option>
            ))}
          </select>
        </div>

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
        >
          Book Session
        </Button>
      </form>
    </Card>
  );
};
