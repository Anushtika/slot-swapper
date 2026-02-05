import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function DragOverlay() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50">
      {/* Custom drag preview can be added here */}
    </div>
  );
}