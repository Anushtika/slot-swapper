import React, { useState, useEffect } from 'react';
import client from '../api/client';

interface Slot {
  id: string;
  title: string;
  time: string;
  date: string;
}

interface Swap {
  id: string;
  mySlot: Slot;
  theirSlot: Slot;
  status: string;
  createdAt: string;
}

export default function SwapHistoryPage() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSwaps() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await client.get('/api/swaps');
        setSwaps(data);
      } catch (err: any) {
        console.error('Failed to fetch swaps:', err);
        setError(err.response?.data?.error || 'Failed to load swap history');
      } finally {
        setLoading(false);
      }
    }
    fetchSwaps();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading swap history...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Swap History</h1>
      {swaps.length > 0 ? (
        <ul className="space-y-4">
          {swaps.map((swap) => (
            <li key={swap.id} className="p-4 bg-gray-800 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">
                    {swap.mySlot.title} ↔ {swap.theirSlot.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(swap.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  swap.status === 'accepted' ? 'bg-green-600' : 
                  swap.status === 'pending' ? 'bg-yellow-600' : 
                  'bg-red-600'
                }`}>
                  {swap.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No swap history yet.</p>
      )}
    </div>
  );
}