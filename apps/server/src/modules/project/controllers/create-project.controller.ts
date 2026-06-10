import { Response } from "express";
import { prisma } from "@/lib/prisma.js";
import { TeamRequest } from "@/middleware/team-access.middleware.js";
import { createProjectSchema } from "../validators/create-project.validator.js";
import { createProjectService } from "../services/create-project.service.js";

export const createProjectController = async (
  req: TeamRequest,
  res: Response,
) => {
  try {
    const slug = req.params.teamSlug as string;
    
    const validatedData = createProjectSchema.parse(req.body);

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

    const project = await createProjectService({
      teamId: team.id,

      name: validatedData.name,

      description: validatedData.description,

      visibility: validatedData.visibility,

      createdById: req.user!.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create project",
    });
  }
};
