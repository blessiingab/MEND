/**
 * Sessions Page
 */
import React from 'react';
import { BookSession } from '../components/sessions/BookSession';
import { useFetch } from '../hooks/useCustomHooks';
import { sessionService } from '../services/api';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';

export const SessionsPage = () => {
  const { data: sessions, loading, error } = useFetch(
    () => sessionService.getMySessions(20, 0),
    []
  );

  const sessionList = Array.isArray(sessions) ? sessions : sessions?.sessions || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Therapy Sessions</h1>

      <BookSession />

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">My Booked Sessions</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loading message="Loading your sessions..." />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : sessionList.length === 0 ? (
            <Alert type="info" message="You have no booked sessions yet." dismissible={false} />
          ) : (
            <div className="space-y-3">
              {sessionList.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-semibold text-gray-900">
                    {session.first_name} {session.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.start_time || session.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 capitalize mt-1">Status: {session.status}</p>
                  {session.notes ? (
                    <p className="text-sm text-gray-700 mt-2">Notes: {session.notes}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};