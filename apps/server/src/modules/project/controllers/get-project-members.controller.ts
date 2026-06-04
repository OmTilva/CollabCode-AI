import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { getProjectMembersService } from "../services/get-project-members.service.js";

export const getProjectMembersController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const { teamSlug, projectSlug } = req.params;

    const project = await getProjectMembersService(teamSlug, projectSlug);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,

      members: project.memberships,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
};
