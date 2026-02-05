interface Slot {
  id: string;
  title: string;
  time: string;
}

export interface SwapHistory {
  [user: string]: { success?: boolean; rejected?: boolean };
}

export function calculateSwapScore(mySlot: Slot, theirSlot: Slot, swapHistory: SwapHistory): number {
  let score = 50;

  if (mySlot.time === theirSlot.time) score += 10;
  if (swapHistory[theirSlot.id]?.success) score += 15;

  return score;
}

export function generateSuggestions(
  mySlots: Slot[],
  allSlots: Slot[],
  swapHistory: SwapHistory,
  limit = 5
): {
  mySlot: Slot;
  theirSlot: Slot;
  score: number;
  reasons: string[];
}[] {
  const suggestions = [];

  for (const mySlot of mySlots) {
    for (const theirSlot of allSlots) {
      if (theirSlot.id !== mySlot.id) {
        const score = calculateSwapScore(mySlot, theirSlot, swapHistory);
        suggestions.push({
          mySlot,
          theirSlot,
          score,
          reasons: [],
        });
      }
    }
  }
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}