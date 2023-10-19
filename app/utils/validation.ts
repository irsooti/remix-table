import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
});

export const issueLoaderSchema = z
  .object({
    idRepo: z.string(),
  })
  .merge(userSchema);
