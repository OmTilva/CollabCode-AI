import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { AuthenticatedSocket } from "./types.js";
import { socketAuthMiddleware } from "./middleware/auth.middleware.js";
import { registerProjectHandlers } from "./handlers/project.handler.js";
import { registerDisconnectHandler } from "./handlers/disconnect.handler.js";
import { createRedisAdapter } from "@/redis/redis.adapter.js";

export let io: Server;

export const initializeSocket = async (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,

      credentials: true,
    },
  });
  const adapter = await createRedisAdapter();
  io.adapter(adapter);

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const authSocket = socket as AuthenticatedSocket;

    console.log("Socket connected:", authSocket.email);

    registerProjectHandlers(io, authSocket);
    registerDisconnectHandler(io, authSocket);
  });

  return io;
};
