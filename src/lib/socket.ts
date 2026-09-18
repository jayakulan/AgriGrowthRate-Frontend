import { io } from 'socket.io-client';

const getSocketURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001';
    }
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://localhost:5001';
};

export const socket = io(getSocketURL(), {
  autoConnect: false,
  withCredentials: true,
});
