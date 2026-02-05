import React from 'react';
import CalendarGrid from '../components/CalendarGrid';
import { useSlots } from '../hooks/useSlots';

export default function DashboardPage() {
  const { slots, loading, refetch } = useSlots();

  function handleSlotDrop(draggedId: string, droppedId: string) {
    console.log('Slot dropped:', draggedId, 'on:', droppedId);
    refetch();
  }

  if (loading) {
    return <div className="text-white text-center mt-10">Loading slots...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Your Schedule</h1>
      <CalendarGrid slots={slots} onDrop={handleSlotDrop} />
    </div>
  );
}