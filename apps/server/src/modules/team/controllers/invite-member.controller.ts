import { Response } from "express";
import { prisma } from "@/lib/prisma.js";
import { TeamRequest } from "@/middleware/team-access.middleware.js";
import { createInviteSchema } from "../validators/invite.validator.js";
import { createInviteService } from "../services/create-invite.service.js";

export const inviteMemberController = async (
  req: TeamRequest,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;

    const validatedData = createInviteSchema.parse(req.body);

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

    const invite = await createInviteService({
      teamId: team.id,

      email: validatedData.email,

      role: validatedData.role,

      invitedById: req.user!.userId,
    });

    return res.status(201).json({
      success: true,

      message: "Invitation sent successfully",

      invite,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Failed to send invite",
    });
  }
};
