import { Response } from "express";
import { prisma } from "@/lib/prisma.js";
import { TeamRequest } from "@/middleware/team-access.middleware.js";
import { getTeamProjectsService } from "../services/get-team-projects.service.js";

export const getTeamProjectsController = async (
  req: TeamRequest,
  res: Response,
) => {
  try {
    const { slug } = req.params;

    const team = await prisma.team.findUnique({
      where: {
        slug,
      },
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const projects = await getTeamProjectsService(team.id);

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};
