import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { createFileSchema } from "../validators/create-file.validator.js";
import { createFileService } from "../services/create-file.service.js";

export const createFileController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const teamSlug = req.params.teamSlug as string;
    const projectSlug = req.params.projectSlug as string;

    const body = createFileSchema.parse(req.body);

    const file = await createFileService({
      teamSlug,
      projectSlug,

      name: body.name,

      extension: body.extension,

      folderId: body.folderId,

      userId: req.user!.userId,
    });

    return res.status(201).json({
      success: true,
      file,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create file",
    });
  }
};
