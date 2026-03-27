/**
 * Sessions Page
 */
import React, { useMemo, useState } from 'react';
import { BookSession } from '../components/sessions/BookSession';
import { useAuth, useFetch } from '../hooks/useCustomHooks';
import { sessionService } from '../services/api';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';

export const SessionsPage = () => {
  const { user } = useAuth();
  const isTherapist = user?.role === 'therapist';

  const [statusBySession, setStatusBySession] = useState({});
  const [notesBySession, setNotesBySession] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupCareFocus, setGroupCareFocus] = useState('');
  const [selectedClientByGroup, setSelectedClientByGroup] = useState({});

  const { data: sessions, loading, error, refetch } = useFetch(
    () => (isTherapist ? sessionService.getTherapistSessions(50, 0) : sessionService.getMySessions(20, 0)),
    [isTherapist]
  );

  const sessionList = useMemo(
    () => (Array.isArray(sessions) ? sessions : sessions?.sessions || []),
    [sessions]
  );
  const {
    data: therapistGroups,
    loading: groupsLoading,
    refetch: refetchGroups
  } = useFetch(
    () => (isTherapist ? sessionService.getTherapistGroups() : Promise.resolve([])),
    [isTherapist]
  );
  const {
    data: therapistClients,
    loading: clientsLoading,
    refetch: refetchClients
  } = useFetch(
    () => (isTherapist ? sessionService.getTherapistClients() : Promise.resolve([])),
    [isTherapist]
  );

  const groupsList = useMemo(
    () => (Array.isArray(therapistGroups) ? therapistGroups : therapistGroups?.groups || []),
    [therapistGroups]
  );
  const clientsList = useMemo(
    () => (Array.isArray(therapistClients) ? therapistClients : therapistClients?.clients || []),
    [therapistClients]
  );

  const saveSessionChanges = async (session) => {
    setActionMessage('');
    const nextStatus = statusBySession[session.id] || session.status;
    const nextNotes = notesBySession[session.id] !== undefined ? notesBySession[session.id] : (session.notes || '');

    setActionLoadingId(session.id);
    try {
      await sessionService.updateSession(session.id, {
        status: nextStatus,
        notes: nextNotes
      });
      setActionMessage('Session updated successfully.');
      await refetch();
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err) {
      setActionMessage(err.message || 'Failed to update session.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const cancelUserSession = async (sessionId) => {
    setActionMessage('');
    setActionLoadingId(sessionId);
    try {
      await sessionService.cancelSession(sessionId);
      setActionMessage('Session cancelled successfully.');
      await refetch();
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err) {
      setActionMessage(err.message || 'Failed to cancel session.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    setActionMessage('');
    if (!groupName.trim()) {
      setActionMessage('Group name is required.');
      return;
    }

    setActionLoadingId('create-group');
    try {
      await sessionService.createTherapistGroup(groupName.trim(), groupDescription.trim(), groupCareFocus.trim());
      setGroupName('');
      setGroupDescription('');
      setGroupCareFocus('');
      setActionMessage('Client group created successfully.');
      await refetchGroups();
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err) {
      setActionMessage(err.message || 'Failed to create group.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const addClientToGroup = async (groupId) => {
    const selectedUserId = selectedClientByGroup[groupId];
    if (!selectedUserId) {
      setActionMessage('Please select a client to add.');
      return;
    }

    setActionMessage('');
    setActionLoadingId(`add-${groupId}`);
    try {
      await sessionService.addMemberToTherapistGroup(groupId, Number(selectedUserId));
      setSelectedClientByGroup((prev) => ({ ...prev, [groupId]: '' }));
      setActionMessage('Client added to group.');
      await Promise.all([refetchGroups(), refetchClients()]);
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err) {
      setActionMessage(err.message || 'Failed to add client to group.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeClientFromGroup = async (groupId, userId) => {
    setActionMessage('');
    setActionLoadingId(`remove-${groupId}-${userId}`);
    try {
      await sessionService.removeMemberFromTherapistGroup(groupId, userId);
      setActionMessage('Client removed from group.');
      await Promise.all([refetchGroups(), refetchClients()]);
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err) {
      setActionMessage(err.message || 'Failed to remove client from group.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">{isTherapist ? 'Manage Therapy Sessions' : 'Therapy Sessions'}</h1>

      {actionMessage ? (
        <Alert
          type={actionMessage.toLowerCase().includes('failed') ? 'error' : 'success'}
          message={actionMessage}
          dismissible
          onClose={() => setActionMessage('')}
        />
      ) : null}

      {!isTherapist && <BookSession />}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">
            {isTherapist ? 'Assigned Client Sessions' : 'My Booked Sessions'}
          </h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loading message="Loading sessions..." />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : sessionList.length === 0 ? (
            <Alert
              type="info"
              message={isTherapist ? 'No client sessions assigned yet.' : 'You have no booked sessions yet.'}
              dismissible={false}
            />
          ) : (
            <div className="space-y-4">
              {sessionList.map((session) => {
                const displayName = `${session.first_name || ''} ${session.last_name || ''}`.trim() || (isTherapist ? 'Client' : 'Therapist');
                const startValue = session.start_time || session.startTime;

                return (
                  <div key={session.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-600">
                          {startValue ? new Date(startValue).toLocaleString() : 'Session time pending'}
                        </p>
                        <p className="text-sm text-gray-600 capitalize mt-1">Status: {session.status}</p>
                      </div>

                      {isTherapist ? (
                        <div className="w-full md:w-80 space-y-2">
                          <label className="text-sm font-medium text-gray-700">Update Status</label>
                          <select
                            className="w-full border border-gray-300 dark:border-gray-600 rounded p-2"
                            value={statusBySession[session.id] || session.status}
                            onChange={(e) =>
                              setStatusBySession((prev) => ({
                                ...prev,
                                [session.id]: e.target.value
                              }))
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <label className="text-sm font-medium text-gray-700">Session Notes</label>
                          <textarea
                            className="w-full border border-gray-300 dark:border-gray-600 rounded p-2"
                            rows="3"
                            placeholder="Add session notes..."
                            value={notesBySession[session.id] !== undefined ? notesBySession[session.id] : (session.notes || '')}
                            onChange={(e) =>
                              setNotesBySession((prev) => ({
                                ...prev,
                                [session.id]: e.target.value
                              }))
                            }
                          />

                          <Button
                            variant="primary"
                            fullWidth
                            loading={actionLoadingId === session.id}
                            onClick={() => saveSessionChanges(session)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div className="md:text-right">
                          {session.notes ? (
                            <p className="text-sm text-gray-700 mt-2 md:mt-0 md:max-w-md">Notes: {session.notes}</p>
                          ) : null}
                          {(session.status === 'pending' || session.status === 'upcoming') ? (
                            <Button
                              variant="danger"
                              size="sm"
                              loading={actionLoadingId === session.id}
                              onClick={() => cancelUserSession(session.id)}
                              className="mt-3"
                            >
                              Cancel Session
                            </Button>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {isTherapist ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Client Groups</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <form onSubmit={createGroup} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                className="border border-gray-300 dark:border-gray-600 rounded p-2"
                placeholder="Group name (e.g. Anxiety Support)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <input
                className="border border-gray-300 dark:border-gray-600 rounded p-2"
                placeholder="Care focus (e.g. CBT)"
                value={groupCareFocus}
                onChange={(e) => setGroupCareFocus(e.target.value)}
              />
              <input
                className="border border-gray-300 dark:border-gray-600 rounded p-2"
                placeholder="Description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
              <Button type="submit" loading={actionLoadingId === 'create-group'}>
                Create Group
              </Button>
            </form>

            {groupsLoading ? (
              <Loading message="Loading groups..." />
            ) : groupsList.length === 0 ? (
              <Alert type="info" message="No groups yet. Create your first client group." dismissible={false} />
            ) : (
              <div className="space-y-4">
                {groupsList.map((group) => {
                  const memberIds = new Set((group.members || []).map((m) => m.id));
                  const availableToAdd = clientsList.filter((client) => !memberIds.has(client.id));
                  return (
                    <div key={group.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <div className="mb-3">
                        <p className="font-semibold text-gray-900">{group.name}</p>
                        {group.care_focus ? (
                          <p className="text-sm text-blue-600">Focus: {group.care_focus}</p>
                        ) : null}
                        {group.description ? (
                          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        ) : null}
                      </div>

                      <div className="flex flex-col md:flex-row gap-2 md:items-center mb-3">
                        <select
                          className="border border-gray-300 dark:border-gray-600 rounded p-2 flex-1"
                          value={selectedClientByGroup[group.id] || ''}
                          onChange={(e) =>
                            setSelectedClientByGroup((prev) => ({
                              ...prev,
                              [group.id]: e.target.value
                            }))
                          }
                        >
                          <option value="">Select client to add</option>
                          {availableToAdd.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.first_name} {client.last_name}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          loading={actionLoadingId === `add-${group.id}`}
                          onClick={() => addClientToGroup(group.id)}
                        >
                          Add Client
                        </Button>
                      </div>

                      {(group.members || []).length === 0 ? (
                        <p className="text-sm text-gray-600">No clients in this group yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {group.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {member.first_name} {member.last_name}
                                </p>
                                <p className="text-xs text-gray-600">{member.email}</p>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                loading={actionLoadingId === `remove-${group.id}-${member.id}`}
                                onClick={() => removeClientFromGroup(group.id, member.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {clientsLoading && !groupsLoading ? <Loading message="Loading clients..." /> : null}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
};
