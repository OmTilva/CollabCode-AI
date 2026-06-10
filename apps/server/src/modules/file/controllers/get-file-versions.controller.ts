import { Response } from "express";
import { getFileVersionsService } from "../services/get-file-versions.service.ts.js";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";

export const getFileVersionsController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const fileId = req.params.fileId as string;

    const versions = await getFileVersionsService(fileId);

    return res.status(200).json({
      success: true,

      versions,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to fetch versions",
    });
  }
};
