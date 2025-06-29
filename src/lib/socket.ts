
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://domain.com'
  : 'http://localhost:3000';

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/api/socket',
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export { socket }; // Export socket instance for use in components
