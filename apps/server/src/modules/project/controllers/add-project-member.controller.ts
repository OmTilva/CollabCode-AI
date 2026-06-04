import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { addProjectMemberSchema } from "../validators/add-project-member.validator.js";
import { addProjectMemberService } from "../services/add-project-member.service.js";

export const addProjectMemberController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const { teamSlug, projectSlug } = req.params;

    const body = addProjectMemberSchema.parse(req.body);

    const member = await addProjectMemberService({
      teamSlug,
      projectSlug,

      userId: body.userId,

      role: body.role,

      addedById: req.user!.userId,
    });

    return res.status(201).json({
      success: true,
      member,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to add member",
    });
  }
};
