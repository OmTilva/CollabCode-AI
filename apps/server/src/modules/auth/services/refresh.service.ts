import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const refreshService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      sessionId: string;
    };

    const session = await prisma.session.findUnique({
      where: {
        id: decoded.sessionId,
      },

      include: {
        user: true,
      },
    });

    if (!session) {
      throw new Error("Invalid session");
    }

    if (session.refreshToken !== refreshToken) {
      throw new Error("Refresh token reuse detected");
    }

    if (session.expiresAt < new Date()) {
      throw new Error("Session expired");
    }

    const newAccessToken = generateAccessToken(
      session.user.id,
      session.user.role,
    );

    const newRefreshToken = generateRefreshToken(session.id);

    await prisma.session.update({
      where: {
        id: session.id,
      },

      data: {
        refreshToken: newRefreshToken,
      },
    });

    return {
      accessToken: newAccessToken,

      refreshToken: newRefreshToken,
    };
  } catch {
    throw new Error("Invalid refresh token");   
  }
};
