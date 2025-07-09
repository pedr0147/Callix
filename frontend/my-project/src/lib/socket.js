import { io } from "socket.io-client";
import { getBaseURL } from "./baseUrl";

// Cria uma ligação WebSocket com o userId fornecido.
export function createSocket(userId) {
  return io(getBaseURL(), {
    query: { userId },
    transports: ["websocket"],
    secure: true
  });
}