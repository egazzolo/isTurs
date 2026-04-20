import { z } from "zod";

export const MatchUpPair = z.object({
  id: z.string(),
  left: z.string().min(1),
  right: z.string().min(1),
});

export const MatchUpContent = z.object({
  pairs: z.array(MatchUpPair).min(2).max(20),
});

export type MatchUpContentType = z.infer<typeof MatchUpContent>;
