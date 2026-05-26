import { Router } from "express";

import { signupController } from "../controllers/signup.controller.js";
import { loginController } from "../controllers/login.controller.js";
import { verifyEmailController } from "../controllers/verify-email.controller.js";

import { authenticate } from "@/middleware/auth.middleware.js";
import { authorize } from "@/middleware/role.middleware.js";

import { refreshController } from "../controllers/refresh.controller.js";
import { logoutController } from "../controllers/logout.controller.js";

import { adminController } from "../controllers/admin.controller.js";
import { meController } from "../controllers/me.controller.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/verify-email", verifyEmailController);

router.get("/me", authenticate, meController);
router.get(
  "/admin",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  adminController,
);

router.post("/refresh", refreshController);
router.post("/logout", authenticate, logoutController);

export default router;
