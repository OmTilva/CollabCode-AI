import { Response } from "express";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";
import { moveFileSchema } from "../validators/move-file.validator.js";
import { moveFileService } from "../services/move-file.service.js";

export const moveFileController = async (req: ProjectRequest, res: Response) => {
  try {
    const fileId = req.params.fileId as string;

    const body = moveFileSchema.parse(req.body);

    const file = await moveFileService({
      fileId,

      folderId: body.folderId,
      userId: req.user!.userId,
    });

    return res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Failed to move file",
    });
  }
};
