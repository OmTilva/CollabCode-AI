import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { getProjectTreeService } from "../services/get-project-tree.service.js";

export const getProjectTreeController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;

    const tree = await getProjectTreeService(teamSlug, projectSlug);

    return res.status(200).json({
      success: true,
      tree,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch tree",
    });
  }
};
