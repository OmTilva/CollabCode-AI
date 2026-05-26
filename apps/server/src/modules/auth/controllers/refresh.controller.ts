import { Request, Response } from "express";
import { refreshService } from "../services/refresh.service.js";

export const refreshController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshService(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,

      message: error instanceof Error ? error.message : "Refresh failed",
    });
  }
};
