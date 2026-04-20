import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizPlayer } from "@/components/games/quiz/QuizPlayer";
import { QuizContent } from "@/components/games/quiz/types";
import type { Activity } from "@/types/database";

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  const activity = data as Activity | null;
  if (!activity) return notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">{activity.title}</h1>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        {activity.type === "quiz" ? (
          (() => {
            const parsed = QuizContent.safeParse(activity.content);
            if (!parsed.success) {
              return (
                <p className="text-destructive">
                  This activity has invalid content. Please contact your teacher.
                </p>
              );
            }
            return <QuizPlayer activityId={activity.id} content={parsed.data} />;
          })()
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-xl font-semibold">Coming soon</p>
            <p className="mt-2 text-muted-foreground">
              This activity type is not available yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("activities")
    .select("title")
    .eq("slug", slug)
    .single();
  const row = data as { title: string } | null;
  return { title: row?.title ?? "Activity" };
}
