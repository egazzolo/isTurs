import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuizContent } from "@/components/games/quiz/types";
import { z } from "zod";
import type { Json } from "@/types/database";

const UpdateBody = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.unknown().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = UpdateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { data: existingData } = await supabase
    .from("activities")
    .select("type")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const existing = existingData as { type: string } | null;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (parsed.data.content && existing.type === "quiz") {
    const quizParsed = QuizContent.safeParse(parsed.data.content);
    if (!quizParsed.success) {
      return NextResponse.json({ error: "Invalid quiz content" }, { status: 400 });
    }
  }

  // Build a type-safe update payload
  const updatePayload: { title?: string; content?: Json; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.title) updatePayload.title = parsed.data.title;
  if (parsed.data.content !== undefined) updatePayload.content = parsed.data.content as Json;

  const { data: activityData, error } = await supabase
    .from("activities")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(activityData);
}
