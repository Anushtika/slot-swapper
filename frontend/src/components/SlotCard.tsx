import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface SlotCardProps {
  slot: {
    id: string;
    title: string;
    time: string;
  };
}

export default function SlotCard({ slot }: SlotCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: slot.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-2 rounded bg-gray-700 text-white ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {slot.title} - {slot.time}
    </div>
  );
}