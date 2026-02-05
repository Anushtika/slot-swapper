import React from 'react';

interface SlotModalProps {
  slot: {
    title: string;
    time: string;
  };
  onClose: () => void;
}

export default function SlotModal({ slot, onClose }: SlotModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold">{slot.title}</h2>
        <p className="text-gray-400">{slot.time}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}