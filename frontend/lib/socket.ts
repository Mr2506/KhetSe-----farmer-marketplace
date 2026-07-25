import { io } from 'socket.io-client';

// Automatically detect if we are on localhost or Vercel production
const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://khetse-backend.onrender.com' 
  : 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We keep it off by default so it doesn't drain battery
});