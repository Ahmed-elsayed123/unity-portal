import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dataService from '../../../services/dataService.jsx';
import { CheckCircle, Trash2, Pencil, Pause, Play } from 'lucide-react';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const ManageQueue = () => {
  const query = useQuery();
  const id = query.get('id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await dataService.get(`/queues/${id}`);
      if (res.success) setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const serveNext = async () => {
    try {
      await dataService.post(`/queues/${id}/serve`, {});
      fetchData();
    } catch (e) {}
  };

  const toggleActive = async () => {
    try {
      await dataService.put(`/queues/${id}`, { is_active: !data.queue.is_active });
      fetchData();
    } catch {}
  };

  const deleteQueue = async () => {
    if (!window.confirm('Delete this queue?')) return;
    try {
      await dataService.delete(`/queues/${id}`);
      navigate('/student/queue');
    } catch {}
  };

  useEffect(() => {
    if (id) fetchData();
    const t = setInterval(fetchData, 8000);
    return () => clearInterval(t);
  }, [id]);

  if (!id) return <div className="text-center">Invalid queue</div>;
  if (loading || !data) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const joinUrl = data.queue.qr_code;
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
  const nextInQueue = data.waiting?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Queue Created Successfully!</h3>
        <img src={qrImg} alt="QR" className="rounded-lg w-48 h-48" />
        <div>
          <p className="text-sm text-gray-500">Join Link</p>
          <div className="text-sm break-all">{joinUrl}</div>
        </div>
      </div>

      <div className="lg:col-span-2 glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{data.queue.name}</h3>
            <p className="text-sm text-gray-500">Avg Time/Client: {data.queue.avg_processing_time} min</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleActive} className="px-3 py-2 rounded-lg bg-gray-800 text-white">
              {data.queue.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={deleteQueue} className="px-3 py-2 rounded-lg bg-red-600 text-white"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Current</p>
            <div className="text-5xl font-bold">{nextInQueue ? nextInQueue.queue_number : '--'}</div>
            <button onClick={serveNext} className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" /> Mark as Served
            </button>
          </div>
          <div className="glass-card p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Queue Overview</p>
            <div className="text-sm">Total Waiting: {data.waiting.length}</div>
          </div>
        </div>

        <div className="glass-card p-4 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.waiting.map(m => (
                <tr key={m.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">{m.queue_number}</td>
                  <td className="py-2 pr-4">{m.user_id}</td>
                  <td className="py-2 pr-4 capitalize">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageQueue;

