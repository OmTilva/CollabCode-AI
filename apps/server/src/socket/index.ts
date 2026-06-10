import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { AuthenticatedSocket } from "./types.js";
import { socketAuthMiddleware } from "./middleware/auth.middleware.js";
import { registerProjectHandlers } from "./handlers/project.handler.js";
import { registerDisconnectHandler } from "./handlers/disconnect.handler.js";

export let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,

      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const authSocket = socket as AuthenticatedSocket;

    console.log("Socket connected:", authSocket.email);

    registerProjectHandlers(io, authSocket);
    registerDisconnectHandler(io, authSocket);
  });

  return io;
};
