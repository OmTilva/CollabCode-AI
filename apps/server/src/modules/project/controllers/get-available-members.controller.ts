import { Response } from "express";

import { ProjectRequest } from "@/middleware/project-access.middleware.js";

import { getAvailableMembersService } from "../services/get-available-members.service.js";

export const getAvailableMembersController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;

    const members = await getAvailableMembersService(teamSlug, projectSlug);

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch available members",
    });
  }
};
