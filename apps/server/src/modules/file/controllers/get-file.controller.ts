import { Response } from "express";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";
import { getFileService } from "../services/get-file.service.js";

export const getFileController = async (req: ProjectRequest, res: Response) => {
  try {
    const fileId = req.params.fileId as string;

    const file = await getFileService(fileId);

    return res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "File not found",
    });
  }
};
