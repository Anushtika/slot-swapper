import React from 'react';

interface Suggestion {
  mySlot: { id: string; title: string; time: string };
  theirSlot: { id: string; title: string; time: string };
  score: number;
}

export default function SuggestionsPage() {
  const suggestions: Suggestion[] = []; // Example placeholder

  function handleProposeSwap(suggestion: Suggestion) {
    console.log(suggestion);
  }

  return (
    <div>
      {suggestions.length > 0 ? (
        suggestions.map((suggestion) => (
          <div key={suggestion.mySlot.id}>
            Suggestion: {suggestion.mySlot.title} ↔ {suggestion.theirSlot.title}
          </div>
        ))
      ) : (
        <p>No suggestions.</p>
      )}
    </div>
  );
}