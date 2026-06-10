import { z } from "zod";

export const updateFileContentSchema = z.object({
  content: z.string(),
});
