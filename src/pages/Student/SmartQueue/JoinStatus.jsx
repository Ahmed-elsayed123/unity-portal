import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dataService from '../../../services/dataService.jsx';
import { BellRing } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.jsx';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const JoinStatus = () => {
  const query = useQuery();
  const queueId = query.get('id');
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [joining, setJoining] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await dataService.get(`/queues/${queueId}/status?user_id=${user.id}`);
      if (res.success) setInfo(res.data);
    } catch {}
  };

  const joinIfNeeded = async () => {
    setJoining(true);
    try {
      // Attempt to fetch; if 404 Not joined, we will join
      const res = await dataService.get(`/queues/${queueId}/status?user_id=${user.id}`);
      if (res.success) {
        setInfo(res.data);
      }
    } catch (e) {
      try {
        const res = await dataService.post(`/queues/${queueId}/join`, { user_id: user.id });
        if (res.success) await fetchStatus();
      } catch {}
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    if (!queueId || !user?.id) return;
    joinIfNeeded();
    const t = setInterval(fetchStatus, 10000);
    return () => clearInterval(t);
  }, [queueId, user?.id]);

  if (!queueId) return <div className="text-center">Invalid queue link</div>;
  if (!info) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const { me, people_ahead, eta_minutes } = info;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Queue Status</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">for: {info.queue.name}</p>
        <div className="text-6xl font-bold text-primary-600">{me.queue_number}</div>
        <p className="mt-2 text-sm text-gray-500">Your Queue Number</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="text-4xl font-extrabold">{people_ahead}</div>
          <p className="text-gray-600 dark:text-gray-400">People Ahead of You</p>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-4xl font-extrabold">{eta_minutes}</div>
          <p className="text-gray-600 dark:text-gray-400">Estimated Wait (min)</p>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="inline-flex items-center px-3 py-2 rounded-lg bg-orange-100 text-orange-700">
            <BellRing className="h-4 w-4 mr-2" /> We'll notify when your turn is near
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinStatus;

