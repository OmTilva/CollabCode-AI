import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { updateFileContentSchema } from "../validators/update-file-content.validator.js";
import { updateFileContentService } from "../services/update-file-content.service.js";

export const updateFileContentController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const fileId = req.params.fileId as string;

    const body = updateFileContentSchema.parse(req.body);

    const file = await updateFileContentService({
      fileId,

      content: body.content,

      userId: req.user!.userId,
    });

    return res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed",
    });
  }
};
