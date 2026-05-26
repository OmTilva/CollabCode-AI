import { Request, Response } from "express";

import { signupSchema } from "../validators/auth.validator.js";

import { signupService } from "../services/signup.service.js";

export const signupController = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const user = await signupService(validatedData);

    return res.status(201).json({
      success: true,
      message: "User created successfully",

      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    });
  }
};
