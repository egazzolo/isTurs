import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { QuizEditor } from "@/components/games/quiz/QuizEditor";
import { QuizContent } from "@/components/games/quiz/types";
import type { Database } from "@/types/database";

type Activity = Database["public"]["Tables"]["activities"]["Row"];

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const activity = data as Activity | null;
  if (!activity) return notFound();

  if (activity.type === "quiz") {
    const parsed = QuizContent.safeParse(activity.content);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Quiz</h1>
        </div>
        <QuizEditor
          activityId={id}
          initialTitle={activity.title}
          initialContent={parsed.success ? parsed.data : undefined}
        />
      </div>
    );
  }

  return (
    <div className="py-16 text-center text-muted-foreground">
      This activity type does not have an editor yet.
    </div>
  );
}
