import { Response, NextFunction } from "express";
import { prisma } from "@/lib/prisma.js";
import { AuthRequest } from "./auth.middleware.js";

export interface TeamRequest extends AuthRequest {
  teamMember?: {
    id: string;

    role: string;

    teamId: string;
  };
}

export const requireTeamAccess = async (
  req: TeamRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug as string;

    const userId = req.user?.userId;

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId,

        team: {
          slug,
        },
      },

      include: {
        team: true,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,

        message: "Access denied",
      });
    }

    req.teamMember = {
      id: membership.id,

      role: membership.role,

      teamId: membership.teamId,
    };

    next();
  } catch {
    return res.status(500).json({
      success: false,

      message: "Failed to validate team access",
    });
  }
};
