import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { transferProjectOwnershipSchema } from "../validators/transfer-project-ownership.validator.js";
import { transferProjectOwnershipService } from "../services/transfer-project-ownership.service.js";

export const transferProjectOwnershipController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;

    const body = transferProjectOwnershipSchema.parse(req.body);

    await transferProjectOwnershipService({
      teamSlug,
      projectSlug,

      currentOwnerId: req.user!.userId,
      newOwnerId: body.newOwnerId,
    });

    return res.status(200).json({
      success: true,
      message: "Ownership transferred successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Transfer failed",
    });
  }
};
