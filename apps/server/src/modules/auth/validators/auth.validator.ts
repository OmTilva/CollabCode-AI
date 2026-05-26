import { z } from "zod";

export const signupSchema = z.object({
  email: z.email(),

  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),

  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.email(),

  password: z.string().min(8).max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type SignupInput = z.infer<typeof signupSchema>;
