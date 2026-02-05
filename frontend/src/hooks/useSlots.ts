import { useState, useEffect } from 'react';
import client from '../api/client';

export function useSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSlots() {
    setLoading(true);
    try {
      const { data } = await client.get('/api/slots/mine');
      setSlots(data);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  return { slots, loading, refetch: fetchSlots };
}