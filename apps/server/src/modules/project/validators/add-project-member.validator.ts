import { z } from "zod";

export const addProjectMemberSchema = z.object({
  userId: z.string().cuid(),

  role: z.enum(["EDITOR", "VIEWER"]),
});

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
