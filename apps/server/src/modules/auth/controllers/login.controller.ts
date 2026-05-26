import { Request, Response } from "express";

import { loginSchema } from "../validators/auth.validator.js";

import { loginService } from "../services/login.service.js";

export const loginController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { user, accessToken, refreshToken } =
      await loginService(validatedData);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,

      message: "Login successful",

      user: {
        id: user.id,
        email: user.email,
        username: user.username,

        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};
