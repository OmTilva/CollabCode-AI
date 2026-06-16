import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types.js";
import {
  setSocketProject,
  removeSocketProject,
} from "@/redis/presence.service.js";
import {
  addUserToProject,
  getProjectUsers,
  removeUserFromProject,
} from "@/redis/presence.service.js";

export const registerProjectHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
) => {
  socket.on("join-project", async (projectId: string) => {
    try {
      socket.join(projectId);

      await addUserToProject(projectId, {
        userId: socket.userId,
        email: socket.email,
      });

      await setSocketProject(socket.id, projectId);

      const projectUsers = await getProjectUsers(projectId);

      io.to(projectId).emit("online-users", projectUsers);

      console.log(`${socket.email} joined ${projectId}`);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("leave-project", async (projectId: string) => {
    try {
      socket.leave(projectId);

      await removeUserFromProject(projectId, {
        userId: socket.userId,
        email: socket.email,
      });

      await removeSocketProject(socket.id);

      const projectUsers = await getProjectUsers(projectId);

      io.to(projectId).emit("online-users", projectUsers);

      console.log(`${socket.email} left ${projectId}`);
    } catch (error) {
      console.error(error);
    }
  });
};
