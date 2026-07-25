import { io } from 'socket.io-client';

// Automatically detect if we are on localhost or Vercel production
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We keep it off by default so it doesn't drain battery
});