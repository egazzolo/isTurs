import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import type { Activity, Profile } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: activitiesData } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: profileData } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();

  const activities = (activitiesData ?? []) as Activity[];
  const profile = profileData as Pick<Profile, "plan"> | null;
  const isAtLimit = profile?.plan === "free" && activities.length >= 5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Activities</h1>
          {profile?.plan === "free" && (
            <p className="text-sm text-muted-foreground">
              {activities.length} / 5 free activities used
            </p>
          )}
        </div>
        <Button asChild disabled={isAtLimit}>
          <Link href="/activities/new">
            <Plus className="h-4 w-4" />
            New activity
          </Link>
        </Button>
      </div>

      {isAtLimit && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You&apos;ve reached the free plan limit of 5 activities.{" "}
          <Link href="/billing" className="font-medium underline">
            Upgrade to Pro
          </Link>{" "}
          for unlimited activities.
        </div>
      )}

      {activities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No activities yet.</p>
          <Button asChild className="mt-4">
            <Link href="/activities/new">Create your first activity</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
