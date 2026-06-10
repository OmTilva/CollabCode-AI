import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types.js";

interface JwtPayload {
  userId: string;

  role: string;

  email: string;
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Unauthorized"));
    }

    const accessToken = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!,
    ) as JwtPayload;

    const authSocket = socket as AuthenticatedSocket;

    authSocket.userId = decoded.userId;

    authSocket.email = decoded.email;

    authSocket.role = decoded.role;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
