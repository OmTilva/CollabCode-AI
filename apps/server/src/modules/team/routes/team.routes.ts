import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware.js";
import { createTeamController } from "../controllers/create-team.controller.js";
import { getMyTeamsController } from "../controllers/get-my-teams.controller.js";
import { requireTeamAccess } from "@/middleware/team-access.middleware.js";
import { getTeamBySlugController } from "../controllers/get-team-by-slug.controller.js";
import { inviteMemberController } from "../controllers/invite-member.controller.js";
import { requireTeamAdmin } from "@/middleware/team-role.middleware.js";
import { acceptInviteController } from "../controllers/accept-invite.controller.js";

const router = Router();

router.post("/create", authenticate, createTeamController);
router.get("/my-teams", authenticate, getMyTeamsController);
router.get("/:slug", authenticate, requireTeamAccess, getTeamBySlugController);

router.post(
  "/:slug/invite",
  authenticate,
  requireTeamAccess,
  requireTeamAdmin,
  inviteMemberController,
);
router.post("/invite/accept/:token", authenticate, acceptInviteController);

export default router;
