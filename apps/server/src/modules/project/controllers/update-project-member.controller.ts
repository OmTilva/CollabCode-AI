import { Response } from "express";
import { updateProjectMemberSchema } from "../validators/update-project-member.validator.js";
import { updateProjectMemberService } from "../services/update-project-member.service.js";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";

export const updateProjectMemberController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const memberId = req.params.memberId as string;

    const body = updateProjectMemberSchema.parse(req.body);
    const member = await updateProjectMemberService(memberId, body.role);

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed",
    });
  }
};
