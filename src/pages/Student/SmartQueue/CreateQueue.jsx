import React, { useState } from 'react';
import dataService from '../../../services/dataService.jsx';
import { useNavigate } from 'react-router-dom';

const CreateQueue = () => {
  const [form, setForm] = useState({ name: '', location: '', description: '', avg_processing_time: 5 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dataService.post('/queues', form);
      if (res.success) {
        navigate(`/student/queue/manage?id=${res.data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-card p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Create New Queue</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Queue Name</label>
          <input className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm mb-2">Location or Address</label>
          <input className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" rows={3} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-2">Processing Time per Client (minutes)</label>
          <input type="number" min="1" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" value={form.avg_processing_time} onChange={(e)=>setForm({...form,avg_processing_time:parseInt(e.target.value||'0')})} required />
        </div>
        <div className="pt-2">
          <button disabled={loading} className="px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">{loading?'Creating...':'Create Queue'}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQueue;

