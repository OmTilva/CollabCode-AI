import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(3).max(50),

  description: z.string().max(300).optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
