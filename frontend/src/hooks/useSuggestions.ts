import { useState, useEffect } from 'react';
import client from '../api/client';
import { generateSuggestions } from '../utils/suggestionAlgorithm';

interface Suggestion {
  mySlot: any;
  theirSlot: any;
  score: number;
  reasons: string[];
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSuggestions() {
    setLoading(true);
    try {
      const [mySlots, allSlots, swapHistory] = await Promise.all([
        client.get('/api/slots/mine'),
        client.get('/api/slots/all'),
        client.get('/api/swaps')
      ]);
      const suggestions = generateSuggestions(mySlots.data, allSlots.data, swapHistory.data);
      setSuggestions(suggestions);
    } catch (err) {
      console.error('Failed to fetch swap suggestions:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return { suggestions, loading, refetch: fetchSuggestions };
}