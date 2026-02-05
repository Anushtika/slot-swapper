import React from 'react';
import { useTimezone } from '../hooks/useTimezone';

export default function TimezonePicker() {
  const { userTimezone, setUserTimezone } = useTimezone();

  const timezones = (Intl as any).supportedValuesOf
    ? (Intl as any).supportedValuesOf('timeZone')
    : ['UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata'];

  return (
    <select
      value={userTimezone}
      onChange={(e) => setUserTimezone(e.target.value)}
      className="p-2 border bg-gray-800 text-white rounded"
    >
      {timezones.map((tz: string) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </select>
  );
}