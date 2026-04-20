import { z } from "zod";

export const SpinWheelContent = z.object({
  segments: z.array(z.object({ id: z.string(), label: z.string().min(1) })).min(2).max(16),
});

export type SpinWheelContentType = z.infer<typeof SpinWheelContent>;
