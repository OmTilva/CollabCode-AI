import { Response, NextFunction } from "express";
import { TeamRequest } from "./team-access.middleware.js";

export const requireTeamRole = (...allowedRoles: string[]) => {
  return (req: TeamRequest, res: Response, next: NextFunction) => {
    if (!req.teamMember) {
      return res.status(403).json({
        success: false,
        message: "Team membership required",
      });
    }

    if (!allowedRoles.includes(req.teamMember.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

export const requireTeamOwner = requireTeamRole("OWNER");

export const requireTeamAdmin = requireTeamRole("OWNER", "ADMIN");

export const requireTeamMember = requireTeamRole("OWNER", "ADMIN", "MEMBER");
