import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';

export function useWebSocket() {
  const socket = useContext(WebSocketContext);

  if (!socket) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  useEffect(() => {
    const handleOpen = () => console.log('WebSocket connected');
    const handleClose = () => console.log('WebSocket disconnected');

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('close', handleClose);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('close', handleClose);
    };
  }, [socket]);

  return { socket };
}