import { Response } from "express";
import { ProjectRequest } from "@/middleware/project-access.middleware.js";
import { deleteFolderService } from "../services/delete-folder.service.js";

export const deleteFolderController = async (
  req: ProjectRequest,
  res: Response,
) => {
  try {
    const folderId = req.params.folderId as string;

    await deleteFolderService({ folderId, userId: req.user!.userId });

    return res.status(200).json({
      success: true,

      message: "Folder deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message:
        error instanceof Error ? error.message : "Failed to delete folder",
    });
  }
};
