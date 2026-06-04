import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware.js";
import { acceptInviteService } from "../services/accept-invite.service.js";

export const acceptInviteController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const token = req.params.token;

    const member = await acceptInviteService({
      token,
      userId: req.user!.userId,
      userEmail: req.user!.email,
    });

    return res.status(200).json({
      success: true,

      message: "Invitation accepted",

      member,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to accept invitation",
    });
  }
};
