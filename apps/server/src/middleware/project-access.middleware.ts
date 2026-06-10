import { Response, NextFunction } from "express";
import { prisma } from "@/lib/prisma.js";
import { AuthRequest } from "./auth.middleware.js";

export interface ProjectRequest extends AuthRequest {
  projectMember?: {
    id: string;
    role: string;
    projectId: string;
    userId: string;
  };
}

export const requireProjectAccess = async (
  req: ProjectRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;

    const userId = req.user!.userId;

    const membership = await prisma.projectMember.findFirst({
      where: {
        userId,

        project: {
          slug: projectSlug,

          team: {
            slug: teamSlug,
          },
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Project access denied",
      });
    }

    req.projectMember = {
      id: membership.id,
      role: membership.role,
      projectId: membership.projectId,
      userId: membership.userId,
    };

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to verify project access",
    });
  }
};
