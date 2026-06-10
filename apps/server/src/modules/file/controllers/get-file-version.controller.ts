import { Response } from "express";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";
import { getFileVersionService } from "../services/get-file-version.service.js";

export const getFileVersionController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const fileId = req.params.fileId as string;
    const versionId = req.params.versionId as string;

    const version = await getFileVersionService(fileId, versionId);

    return res.status(200).json({
      success: true,

      version,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,

      message: error instanceof Error ? error.message : "Version not found",
    });
  }
};
