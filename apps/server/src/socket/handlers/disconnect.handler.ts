import { Server } from "socket.io";

import { AuthenticatedSocket } from "../types.js";

import { onlineUsers } from "../presence.store.js";

export const registerDisconnectHandler = (
  io: Server,
  socket: AuthenticatedSocket,
) => {
  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);

    if (!user) {
      return;
    }

    onlineUsers.delete(socket.id);

    const projectUsers = Array.from(onlineUsers.values())
      .filter((u) => u.projectId === user.projectId)
      .map((u) => ({
        userId: u.userId,

        email: u.email,
      }));

    io.to(user.projectId).emit("online-users", projectUsers);

    console.log(`${socket.email} disconnected`);
  });
};
