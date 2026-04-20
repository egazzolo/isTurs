import { z } from "zod";

export const WhackAMoleContent = z.object({
  items: z.array(z.object({ id: z.string(), text: z.string().min(1), correct: z.boolean() })).min(2),
  durationSec: z.number().int().positive().max(120).default(60),
});

export type WhackAMoleContentType = z.infer<typeof WhackAMoleContent>;
