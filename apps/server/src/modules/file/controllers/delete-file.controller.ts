import { Response } from "express";
import {ProjectRequest} from "@/middleware/project-access.middleware.js";
import { deleteFileService } from "../services/delete-file.service.js";

export const deleteFileController = async (req: ProjectRequest, res: Response) => {
  try {
    const fileId = req.params.fileId as string;

    await deleteFileService({ fileId, userId: req.user!.userId });

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Failed to delete file",
    });
  }
};
