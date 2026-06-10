import { Response } from "express";
import { prisma } from "@/lib/prisma.js";
import { hashToken } from "../utils/token.js";
import { AuthRequest } from "@/middleware/auth.middleware.js";

export const verifyEmailController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      throw new Error("Invalid token");
    }

    const hashedToken = hashToken(token);

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,

        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      throw new Error("Invalid or expired token");
    }

    await prisma.user.update({
      where: {
        id: verificationToken.user.id,
      },

      data: {
        isEmailVerified: true,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return res.status(200).json({
      success: true,

      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Verification failed",
    });
  }
};
