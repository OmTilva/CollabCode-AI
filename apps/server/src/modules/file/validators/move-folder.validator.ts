import { z } from "zod";

export const moveFolderSchema = z.object({
  parentId: z.string().cuid().nullable(),
});
