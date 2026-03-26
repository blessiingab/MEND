/**
 * Sessions Page
 */
import React, { useState } from 'react';
import { BookSession } from '../components/sessions/BookSession';

export const SessionsPage = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Therapy Sessions</h1>

      {showBooking ? (
        <>
          <button
            onClick={() => setShowBooking(false)}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to sessions
          </button>
          <BookSession />
        </>
      ) : (
        <>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold mb-8"
          >
            + Book New Session
          </button>
          <div className="text-center text-gray-500">
            <p>Your therapy sessions will appear here</p>
          </div>
        </>
      )}
    </div>
  );
};
