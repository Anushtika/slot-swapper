import React, { useContext } from 'react';
import { TimezoneContext } from '../contexts/TimezoneContext';

export function useTimezone() {
  const context = useContext(TimezoneContext);

  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }

  const { userTimezone, setUserTimezone } = context; // Safe to destructure now
  return { userTimezone, setUserTimezone };
}