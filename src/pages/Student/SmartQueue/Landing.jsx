import React, { useState } from 'react';
import { QrCode, PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';

const Landing = () => {
  const [queueInput, setQueueInput] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoin = () => {
    try {
      const maybeUrl = new URL(queueInput, 'http://dummy.base');
      const idParam = maybeUrl.searchParams.get('id');
      const queueId = idParam || queueInput.trim();
      if (!queueId) return;
      navigate(`/student/queue/status?id=${encodeURIComponent(queueId)}`);
    } catch {
      const queueIdFallback = queueInput.trim();
      if (!queueIdFallback) return;
      navigate(`/student/queue/status?id=${encodeURIComponent(queueIdFallback)}`);
    }
  };

  const handleScanQR = () => {
    alert('QR scanning will be added later. Paste the link or ID to join.');
  };

  const goCreate = () => navigate('/student/queue/create');

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="glass-card max-w-4xl w-full p-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Smart Queue System</h2>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-gray-900 dark:text-white mb-8">
          VALUE YOUR TIME. WE'LL MANAGE THE WAIT.
        </h1>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-center">
          <input
            type="text"
            value={queueInput}
            onChange={(e) => setQueueInput(e.target.value)}
            placeholder="Enter queue link or ID"
            className="w-full md:w-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleJoin}
            className="px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 inline-flex items-center justify-center"
          >
            JOIN QUEUE <ArrowRight className="h-4 w-4 ml-2" />
          </button>
          <button
            onClick={handleScanQR}
            className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center"
          >
            <QrCode className="h-4 w-4 mr-2" /> Scan QR Code
          </button>
          <button
            onClick={goCreate}
            className="px-5 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-900 inline-flex items-center justify-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Create a Queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;

