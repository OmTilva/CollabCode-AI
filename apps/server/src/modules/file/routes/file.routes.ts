import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware.js";
import { requireProjectAccess } from "@/middleware/project-access.middleware.js";
import { requireProjectEditor } from "@/middleware/project-role.middleware.js";
import { createFolderController } from "../controllers/create-folder.controller.js";
import { createFileController } from "../controllers/create-file.controller.js";
import { getProjectTreeController } from "../controllers/get-project-tree.controller.js";
import { getFileController } from "../controllers/get-file.controller.js";
import { updateFileContentController } from "../controllers/update-file-content.controller.js";
import { getFileVersionsController } from "../controllers/get-file-versions.controller.js";
import { getFileVersionController } from "../controllers/get-file-version.controller.js";
import { restoreFileVersionController } from "../controllers/restore-file-version.controller.js";
import { renameFileController } from "../controllers/rename-file.controller.js";
import { renameFolderController } from "../controllers/rename-folder.controller.js";
import { deleteFileController } from "../controllers/delete-file.controller.js";
import { deleteFolderController } from "../controllers/delete-folder.controller.js";
import { moveFileController } from "../controllers/move-file.controller.js";
import { moveFolderController } from "../controllers/move-folder.controller.js";

const router = Router();

//Folder Routes

router.post(
  "/team/:teamSlug/project/:projectSlug/folders",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  createFolderController,
);

router.post(
  "/team/:teamSlug/project/:projectSlug/files",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  createFileController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug/tree",
  authenticate,
  requireProjectAccess,
  getProjectTreeController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug/files/:fileId",
  authenticate,
  requireProjectAccess,
  getFileController,
);

router.patch(
  "/team/:teamSlug/project/:projectSlug/files/:fileId/content",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  updateFileContentController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug/files/:fileId/versions",
  authenticate,
  requireProjectAccess,
  getFileVersionsController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug/files/:fileId/versions/:versionId",
  authenticate,
  requireProjectAccess,
  getFileVersionController,
);

router.post(
  "/team/:teamSlug/project/:projectSlug/files/:fileId/restore/:versionId",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  restoreFileVersionController,
);

router.patch(
  "/team/:teamSlug/project/:projectSlug/files/:fileId",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  renameFileController,
);

router.patch(
  "/team/:teamSlug/project/:projectSlug/folders/:folderId",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  renameFolderController,
);

router.delete(
  "/team/:teamSlug/project/:projectSlug/files/:fileId",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  deleteFileController,
);

router.delete(
  "/team/:teamSlug/project/:projectSlug/folders/:folderId",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  deleteFolderController,
);

router.patch(
  "/team/:teamSlug/project/:projectSlug/files/:fileId/move",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  moveFileController,
);

router.patch(
  "/team/:teamSlug/project/:projectSlug/folders/:folderId/move",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  moveFolderController,
);

export default router;
