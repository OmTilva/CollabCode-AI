import { z } from "zod";

export const moveFileSchema = z.object({
  folderId: z.string().cuid().nullable(),
});
