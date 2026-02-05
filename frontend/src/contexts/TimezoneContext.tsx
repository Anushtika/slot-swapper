import React, { createContext, useContext, useState } from 'react';

export interface TimezoneContextType {
  userTimezone: string;
  setUserTimezone: (timezone: string) => void;
}

// Proper default initialization
export const TimezoneContext = createContext<TimezoneContextType>({
  userTimezone: 'UTC',
  setUserTimezone: () => {}
});

export const TimezoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <TimezoneContext.Provider value={{ userTimezone, setUserTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
}