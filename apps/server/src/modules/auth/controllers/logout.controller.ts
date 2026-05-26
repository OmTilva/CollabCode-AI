import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware.js";
import { prisma } from "@/lib/prisma.js";

export const logoutController = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: {
          refreshToken,
        },
      });
    }

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
