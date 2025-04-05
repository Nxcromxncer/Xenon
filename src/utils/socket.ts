import  io  from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection management
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Room management
export const joinRoom = (roomId: string) => {
  socket.emit("join_room", roomId);
};

export const leaveRoom = (roomId: string) => {
  socket.emit("leave_room", roomId);
};