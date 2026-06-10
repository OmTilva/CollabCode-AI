import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { createFolderSchema } from "../validators/create-folder.validator.js";
import { createFolderService } from "../services/create-folder.service.js";

export const createFolderController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;
    const body = createFolderSchema.parse(req.body);

    const folder = await createFolderService({
      teamSlug,
      projectSlug,

      name: body.name,

      parentId: body.parentId,
      userId: req.user!.userId,
    });

    return res.status(201).json({
      success: true,
      folder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create folder",
    });
  }
};
