import { showToastable } from "react-native-toastable";
import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (username: string | null): Socket => {
  if (!socket) {
    socket = io("http://127.0.0.1:5000", { query: { username } });

    socket.on("connect", () => {
      console.log("User connected!");
    });

    socket.on("notification", (data) => {
      showToastable({
        message: data.message,
        status: "info",
      });
    });
  }
  return socket;
};
