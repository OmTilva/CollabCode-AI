import { z } from "zod";

export const renameFileSchema = z.object({
  name: z.string().min(1).max(100),

  extension: z.string().max(20).optional(),
});
