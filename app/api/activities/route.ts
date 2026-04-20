import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { QuizContent } from "@/components/games/quiz/types";
import { z } from "zod";
import type { Activity, Profile } from "@/types/database";

const CreateBody = z.object({
  type: z.enum(["quiz", "match_up", "whack_a_mole", "spin_wheel"]),
  title: z.string().min(1).max(200),
  content: z.unknown(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = CreateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type, title, content } = parsed.data;

  if (type === "quiz") {
    const quizParsed = QuizContent.safeParse(content);
    if (!quizParsed.success) {
      return NextResponse.json({ error: "Invalid quiz content" }, { status: 400 });
    }
  }

  // Freemium gate: free plan allows max 5 activities
  const { data: profileData } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const profile = profileData as Pick<Profile, "plan"> | null;

  if (profile?.plan !== "pro") {
    const { count } = await supabase
      .from("activities")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= 5) {
      return NextResponse.json(
        { error: "Free plan limit reached. Upgrade to Pro to create more." },
        { status: 403 }
      );
    }
  }

  const slug = nanoid(10);
  const { data: activityData, error } = await supabase
    .from("activities")
    .insert({ user_id: user.id, type, title, slug, content: content as Record<string, unknown> })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const activity = activityData as Activity;
  return NextResponse.json(activity, { status: 201 });
}
