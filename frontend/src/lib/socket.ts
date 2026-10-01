import type { Socket } from "socket.io-client";
import { GATEWAY_URL } from "./api";

let socket: Socket | null = null;

/** Conecta (apenas no navegador) ao Gateway via socket.io. */
export async function getSocket(): Promise<Socket> {
  if (socket) return socket;
  const { io } = await import("socket.io-client");
  socket = io(GATEWAY_URL, { transports: ["websocket", "polling"], reconnection: true });
  return socket;
}
