import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { restoreFileVersionService } from "../services/restore-file-version.service.js";

export const restoreFileVersionController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const fileId = req.params.fileId as string;
    const versionId = req.params.versionId as string;

    const file = await restoreFileVersionService({
      fileId,
      versionId,
      userId: req.user!.userId,
    });

    return res.status(200).json({
      success: true,

      message: "Version restored successfully",

      file,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to restore version",
    });
  }
};
