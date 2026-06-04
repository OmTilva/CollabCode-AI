import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email(),

  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
