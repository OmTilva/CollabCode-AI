import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types.js";
import { onlineUsers } from "../presence.store.js";

export const registerProjectHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
) => {
  socket.on("join-project", (projectId: string) => {
    socket.join(projectId);

    onlineUsers.delete(socket.id);
    
    onlineUsers.set(socket.id, {
      userId: socket.userId,

      email: socket.email,

      socketId: socket.id,

      projectId,
    });

    const projectUsers = Array.from(onlineUsers.values())
      .filter((user) => user.projectId === projectId)
      .map((user) => ({
        userId: user.userId,

        email: user.email,
      }));

    io.to(projectId).emit("online-users", projectUsers);

    console.log(`${socket.email} joined ${projectId}`);
  });

  socket.on("leave-project", (projectId: string) => {
    socket.leave(projectId);

    onlineUsers.delete(socket.id);

    const projectUsers = Array.from(onlineUsers.values())
      .filter((user) => user.projectId === projectId)
      .map((user) => ({
        userId: user.userId,
        email: user.email,
      }));

    io.to(projectId).emit("online-users", projectUsers);

    console.log(`${socket.email} left ${projectId}`);
  });
};
