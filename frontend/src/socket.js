import { io } from "socket.io-client";

// Use Vite env var if provided, otherwise fall back to API URL or localhost
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
