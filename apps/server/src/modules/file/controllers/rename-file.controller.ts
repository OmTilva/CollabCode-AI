import { Response } from "express";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";
import { renameFileSchema } from "../validators/rename-file.validator.js";
import { renameFileService } from "../services/rename-file.service.js";

export const renameFileController = async (req: ProjectRequest, res: Response) => {
  try {
    const fileId = req.params.fileId as string;

    const body = renameFileSchema.parse(req.body);

    const file = await renameFileService({
      fileId,

      name: body.name,

      extension: body.extension,

      userId: req.user!.userId,
    });

    return res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Failed to rename file",
    });
  }
};
