import React, { useState, useEffect } from 'react';

interface Slot {
  id: string;
  title: string;
  time: string;
}

interface Swap {
  id: string;
  mySlot: Slot;
  theirSlot: Slot;
  date: string;
}

export default function SwapHistoryPage() {
  const [swaps, setSwaps] = useState<Swap[]>([]);

  useEffect(() => {
    async function fetchSwaps() {
      // Fetch swap data here
      setSwaps([
        {
          id: '1',
          mySlot: { id: '1', title: 'Slot A', time: '10:00' },
          theirSlot: { id: '2', title: 'Slot B', time: '11:00' },
          date: '2026-02-05T10:00:00Z',
        },
      ]);
    }
    fetchSwaps();
  }, []);

  return (
    <>
      <h1>Swap History</h1>
      <ul>
        {swaps.map((swap) => (
          <li key={swap.id}>
            {swap.mySlot.title} ↔ {swap.theirSlot.title} at {new Date(swap.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </>
  );
}