import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware.js";
import { createTeamSchema } from "../validators/team.validator.js";
import { createTeamService } from "../services/create-team.service.js";

export const createTeamController = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createTeamSchema.parse(req.body);

    const team = await createTeamService(validatedData, req.user!.userId);

    return res.status(201).json({
      success: true,

      message: "Team created successfully",

      team,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Failed to create team",
    });
  }
};
