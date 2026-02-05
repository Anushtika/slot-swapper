import React, { createContext, useContext, useEffect, useRef } from 'react';

export const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3000/ws');

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket.current}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const socket = useContext(WebSocketContext);
  if (!socket) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return socket;
}