import { showToastable } from "react-native-toastable";
import { io, Socket } from "socket.io-client";
import data from "../assets/data.json";

let socket: Socket | null = null;

export const getSocket = (username: string | null): Socket => {
  if (!socket) {
    socket = io(data.url, { 
      query: { username },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      // Socket connected
    });

    socket.on("disconnect", (reason) => {
      // Socket disconnected
    });

    socket.on("connect_error", (error) => {
      showToastable({
        message: "Failed to connect to server. Please check your connection.",
        status: "danger",
        duration: 4000,
      });
    });

    socket.on("reconnect", (attemptNumber) => {
      showToastable({
        message: "Reconnected to server",
        status: "success",
        duration: 2000,
      });
    });

    socket.on("notification", (data) => {
      // Don't show leave notifications as toasts - they should be handled in components
      if (data.message && data.message.includes("left the room")) {
        return; // Skip showing toast for leave messages
      }
      
      showToastable({
        message: data.message,
        status: "info",
        duration: 3000,
      });
    });
  }
  return socket;
};
