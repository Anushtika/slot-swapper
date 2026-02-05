import React from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import SlotCard from './SlotCard';

interface Slot {
  id: string;
  title: string;
  time: string;
}

interface CalendarGridProps {
  slots: Slot[];
  onDrop: (draggedId: string, droppedId: string) => void;
}

export default function CalendarGrid({ slots, onDrop }: CalendarGridProps) {
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active?.id && over?.id) {
      onDrop(active.id, over.id);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-7 gap-2">
        {slots.map((slot) => (
          <CalendarCell key={slot.id} slot={slot} />
        ))}
      </div>
    </DndContext>
  );
}

interface CalendarCellProps {
  slot: Slot;
}

function CalendarCell({ slot }: CalendarCellProps) {
  const { setNodeRef } = useDroppable({ id: slot.id });

  return (
    <div ref={setNodeRef} className="border border-gray-700 bg-gray-800 rounded p-4">
      <SlotCard slot={slot} />
    </div>
  );
}