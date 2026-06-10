import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";

import { prisma } from "@/lib/prisma.js";
import { getProjectActivityService } from "../services/get-project-activity.service.js";

export const getProjectActivityController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;
    
    const project = await prisma.project.findFirst({
      where: {
        slug: projectSlug,
        team: {
          slug: teamSlug,
        },
      },

      select: {
        id: true,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const activities = await getProjectActivityService(project.id);

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to fetch activity",
    });
  }
};
