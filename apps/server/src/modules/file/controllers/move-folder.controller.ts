import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { moveFolderSchema } from "../validators/move-folder.validator.js";
import { moveFolderService } from "../services/move-folder.service.js";

export const moveFolderController = async (req: ProjectRequest, res: Response) => {
  try {
    const folderId = req.params.folderId as string;

    const body = moveFolderSchema.parse(req.body);

    const folder = await moveFolderService({
      folderId,

      parentId: body.parentId,
      userId: req.user!.userId,
    });

    return res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Failed to move folder",
    });
  }
};
