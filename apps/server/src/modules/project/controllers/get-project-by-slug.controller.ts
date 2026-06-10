import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { getProjectBySlugService } from "../services/get-project-by-slug.service.js";

export const getProjectBySlugController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;

    const project = await getProjectBySlugService(teamSlug, projectSlug);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};
