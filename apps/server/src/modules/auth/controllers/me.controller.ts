import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware.js";
import { prisma } from "@/lib/prisma.js";

export const meController = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },

      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
