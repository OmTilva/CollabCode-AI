import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware.js";
import { requireTeamAccess } from "@/middleware/team-access.middleware.js";
import { requireTeamAdmin } from "@/middleware/team-role.middleware.js";
import { requireProjectAccess } from "@/middleware/project-access.middleware.js";
import { createProjectController } from "../controllers/create-project.controller.js";
import { getTeamProjectsController } from "../controllers/get-team-projects.controller.js";
import { getProjectBySlugController } from "../controllers/get-project-by-slug.controller.js";
import { getProjectMembersController } from "../controllers/get-project-members.controller.js";
import {
  requireProjectEditor,
  requireProjectOwner,
} from "@/middleware/project-role.middleware.js";
import { addProjectMemberController } from "../controllers/add-project-member.controller.js";
import { updateProjectMemberController } from "../controllers/update-project-member.controller.js";
import { removeProjectMemberController } from "../controllers/remove-project-member.controller.js";
import { getAvailableMembersController } from "../controllers/get-available-members.controller.js";
import { transferProjectOwnershipController } from "../controllers/transfer-project-ownership.controller.js";
const router = Router();

router.post(
  "/team/:slug/projects",
  authenticate,
  requireTeamAccess,
  requireTeamAdmin,
  createProjectController,
);

router.get(
  "/team/:slug/projects",
  authenticate,
  requireTeamAccess,
  getTeamProjectsController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug",
  authenticate,
  requireProjectAccess,
  getProjectBySlugController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug/members",
  authenticate,
  requireProjectAccess,
  getProjectMembersController,
);

router.post(
  "/team/:teamSlug/project/:projectSlug/members",
  authenticate,
  requireProjectAccess,
  requireProjectEditor,
  addProjectMemberController,
);

router.patch(
  "/team/:teamSlug/project/:projectSlug/members/:memberId",
  authenticate,
  requireProjectAccess,
  requireProjectOwner,

  updateProjectMemberController,
);

router.delete(
  "/team/:teamSlug/project/:projectSlug/members/:memberId",
  authenticate,
  requireProjectAccess,
  requireProjectOwner,
  removeProjectMemberController,
);

router.get(
  "/team/:teamSlug/project/:projectSlug/available-members",
  authenticate,
  requireProjectAccess,
  getAvailableMembersController,
);

router.post(
  "/team/:teamSlug/project/:projectSlug/transfer-ownership",

  authenticate,

  requireProjectAccess,

  requireProjectOwner,

  transferProjectOwnershipController,
);
export default router;
