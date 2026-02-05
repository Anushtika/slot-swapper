interface Slot {
  id: string;
  title: string;
  time: string;
}

interface Suggestion {
  mySlot: Slot;
  theirSlot: Slot;
  score: number;
  reasons: string[];
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  onPropose: (suggestion: Suggestion) => void;
}

export default function SuggestionCard({ suggestion, onPropose }: SuggestionCardProps) {
  return (
    <div className="p-4 bg-gray-800 border rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white text-lg font-bold">
            {suggestion.mySlot.title} ↔ {suggestion.theirSlot.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {suggestion.reasons.join(', ')}
          </p>
        </div>
        <button
          onClick={() => onPropose(suggestion)}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Propose Swap
        </button>
      </div>
    </div>
  );
}