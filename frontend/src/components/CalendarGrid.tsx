import React from 'react';

interface Slot {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface CalendarGridProps {
  slots: Slot[] | any;
}

export default function CalendarGrid({ slots }: CalendarGridProps) {
  // Safety check: ensure slots is an array
  const slotsList = Array.isArray(slots) ? slots : [];

  if (slotsList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No slots to display</p>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate: Record<string, Slot[]> = {};
  slotsList.forEach((slot: Slot) => {
    if (!slotsByDate[slot.date]) {
      slotsByDate[slot.date] = [];
    }
    slotsByDate[slot.date].push(slot);
  });

  return (
    <div className="space-y-6">
      {Object.entries(slotsByDate).map(([date, dateSlots]) => (
        <div key={date} className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-indigo-400">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {dateSlots.map((slot: Slot) => (
              <div
                key={slot.id}
                className="bg-gray-700 border border-gray-600 rounded p-4 hover:border-indigo-500 transition"
              >
                <h4 className="font-semibold text-white mb-2">{slot.title}</h4>
                <p className="text-sm text-gray-400">
                  🕐 {slot.startTime} - {slot.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}