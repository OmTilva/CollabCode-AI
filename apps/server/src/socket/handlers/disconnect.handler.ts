import { Server } from "socket.io";

import { AuthenticatedSocket } from "../types.js";

import {
  getProjectUsers,
  getSocketProject,
  removeSocketProject,
  removeUserFromProject,
} from "@/redis/presence.service.js";

export const registerDisconnectHandler = (
  io: Server,
  socket: AuthenticatedSocket,
) => {
  socket.on("disconnect", async () => {
    try {
      const projectId = await getSocketProject(socket.id);

      if (!projectId) {
        return;
      }

      await removeUserFromProject(projectId, {
        userId: socket.userId,
        email: socket.email,
      });

      await removeSocketProject(socket.id);

      const projectUsers = await getProjectUsers(projectId);

      io.to(projectId).emit("online-users", projectUsers);

      console.log(`${socket.email} disconnected`);
    } catch (error) {
      console.error(error);
    }
  });
};
