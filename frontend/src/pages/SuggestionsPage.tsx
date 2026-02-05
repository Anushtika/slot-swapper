import React from 'react';
import { useSuggestions } from '../hooks/useSuggestions';
import SuggestionCard from '../components/SuggestionCard';
import client from '../api/client';

interface Suggestion {
  mySlot: any;
  theirSlot: any;
  score: number;
  reasons: string[];
}

export default function SuggestionsPage() {
  const { suggestions, loading, refetch } = useSuggestions();

  async function handleProposeSwap(suggestion: Suggestion) {
    try {
      await client.post('/api/swaps/propose', {
        mySlotId: suggestion.mySlot.id,
        theirSlotId: suggestion.theirSlot.id,
      });
      alert('Swap proposal sent!');
      refetch();
    } catch (err) {
      console.error('Failed to propose swap:', err);
      alert('Failed to send swap proposal');
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading suggestions...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Swap Suggestions</h1>
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={`${suggestion.mySlot.id}-${suggestion.theirSlot.id}-${index}`}
              suggestion={suggestion}
              onPropose={handleProposeSwap}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No suggestions available at the moment.</p>
      )}
    </div>
  );
}