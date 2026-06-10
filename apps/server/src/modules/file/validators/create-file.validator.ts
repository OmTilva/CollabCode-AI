import { z } from "zod";

export const createFileSchema = z.object({
  name: z.string().min(1).max(100),

  extension: z.string().max(20).optional(),

  folderId: z.string().cuid().nullable().optional(),
});

export type CreateFileInput = z.infer<typeof createFileSchema>;
