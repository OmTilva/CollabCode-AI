import { z } from "zod";

export const updateProjectMemberSchema = z.object({
  role: z.enum(["EDITOR", "VIEWER"]),
});
