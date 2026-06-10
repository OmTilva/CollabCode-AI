import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1).max(100),

  parentId: z.string().cuid().nullable().optional(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
