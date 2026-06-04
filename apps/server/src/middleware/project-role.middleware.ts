import { Response, NextFunction } from "express";
import { ProjectRequest } from "./project-access.middleware.js";

export const requireProjectRole = (...allowedRoles: string[]) => {
  return (req: ProjectRequest, res: Response, next: NextFunction) => {
    if (!req.projectMember) {
      return res.status(403).json({
        success: false,
        message: "Project membership required",
      });
    }

    if (!allowedRoles.includes(req.projectMember.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

export const requireProjectOwner = requireProjectRole("OWNER");

export const requireProjectEditor = requireProjectRole("OWNER", "EDITOR");

export const requireProjectViewer = requireProjectRole(
  "OWNER",
  "EDITOR",
  "VIEWER",
);
