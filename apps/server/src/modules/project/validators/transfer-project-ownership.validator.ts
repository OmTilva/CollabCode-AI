import { z } from "zod";

export const transferProjectOwnershipSchema = z.object({
  newOwnerId: z.string().cuid(),
});
