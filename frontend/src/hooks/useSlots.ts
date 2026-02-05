import { useState, useEffect } from 'react';
import client from '../api/client';

export function useSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSlots() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.get('/slots/mine'); // ✅ Removed /api
      setSlots(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch slots';
      setError(errorMessage);
      console.error('Failed to fetch slots:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  return { slots, loading, error, refetch: fetchSlots };
}