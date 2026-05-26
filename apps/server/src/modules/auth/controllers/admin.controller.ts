import { Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware.js";

export const adminController = (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,

    message: "Welcome Admin",

    user: req.user,
  });
};
