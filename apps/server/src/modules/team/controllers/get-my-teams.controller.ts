import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware.js";
import { getMyTeamsService } from "../services/get-my-teams.service.js";

export const getMyTeamsController = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await getMyTeamsService(req.user!.userId);

    return res.status(200).json({
      success: true,
      teams,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};
