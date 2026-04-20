import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/types/database";

type Result = Database["public"]["Tables"]["results"]["Row"];

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: activityData } = await supabase
    .from("activities")
    .select("id, title, type, slug")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const activity = activityData as { id: string; title: string; type: string; slug: string } | null;
  if (!activity) return notFound();

  const { data: resultsData } = await supabase
    .from("results")
    .select("*")
    .eq("activity_id", id)
    .order("played_at", { ascending: false });

  const results = (resultsData ?? []) as Result[];
  const playCount = results.length;
  const avgScore =
    playCount > 0
      ? (results.reduce((sum, r) => sum + (r.score ?? 0), 0) / playCount).toFixed(1)
      : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Results: {activity.title}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total plays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{playCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgScore}</p>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Played at</th>
                <th className="px-4 py-3 text-left font-medium">Score</th>
                <th className="px-4 py-3 text-left font-medium">Time (s)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.played_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {r.score !== null && r.max_score !== null
                      ? `${r.score} / ${r.max_score}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{r.completion_time_seconds ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground">No results yet. Share the activity link with students.</p>
      )}
    </div>
  );
}
