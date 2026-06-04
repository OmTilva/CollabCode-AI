import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { removeProjectMemberService } from "../services/remove-project-member.service.js";

export const removeProjectMemberController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const { memberId } = req.params;

    await removeProjectMemberService(memberId, req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Member removed",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed",
    });
  }
};
