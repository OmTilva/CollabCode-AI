import { Response } from "express";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";
import { renameFolderSchema } from "../validators/rename-folder.validator.js";
import { renameFolderService } from "../services/rename-folder.service.js";

export const renameFolderController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const folderId = req.params.folderId as string;

    const body = renameFolderSchema.parse(req.body);

    const folder = await renameFolderService({
      folderId,
      name: body.name,
      userId: req.user!.userId,
    });

    return res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to rename folder",
    });
  }
};
