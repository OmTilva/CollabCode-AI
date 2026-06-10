import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware.js";
import { requireProjectAccess } from "@/middleware/project-access.middleware.js";
import { getProjectActivityController } from "../controllers/get-project-activity.controller.js";
export const router = Router();

router.get(
  "/team/:teamSlug/project/:projectSlug/activity",
  authenticate,
  requireProjectAccess,
  getProjectActivityController,
);

export default router;
