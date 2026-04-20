import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ResultBody = z.object({
  activityId: z.string().uuid(),
  score: z.number().int().nonnegative().optional(),
  maxScore: z.number().int().positive().optional(),
  completionTimeSeconds: z.number().int().nonnegative().optional(),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ResultBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid result data" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("results").insert({
    activity_id: parsed.data.activityId,
    score: parsed.data.score ?? null,
    max_score: parsed.data.maxScore ?? null,
    completion_time_seconds: parsed.data.completionTimeSeconds ?? null,
    payload: (parsed.data.payload ?? {}) as Record<string, unknown>,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
