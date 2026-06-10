import { Request, Response } from "express";
import { getTeamBySlugService } from "../services/get-team-by-slug.service.js";

export const getTeamBySlugController = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const team = await getTeamBySlugService(slug);

    if (!team) {
      return res.status(404).json({
        success: false,

        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch {
    return res.status(500).json({
      success: false,

      message: "Failed to fetch team",
    });
  }
};
