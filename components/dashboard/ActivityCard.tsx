"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BarChart2, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/types/database";

type Activity = Database["public"]["Tables"]["activities"]["Row"];

const TYPE_LABELS: Record<Activity["type"], string> = {
  quiz: "Quiz",
  match_up: "Match Up",
  whack_a_mole: "Whack-a-mole",
  spin_wheel: "Spin the Wheel",
};

export function ActivityCard({ activity }: { activity: Activity }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${activity.title}"? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("activities").delete().eq("id", activity.id);
    if (error) {
      toast.error("Failed to delete activity.");
    } else {
      toast.success("Activity deleted.");
      router.refresh();
    }
  }

  const playUrl = `${process.env.NEXT_PUBLIC_APP_URL}/play/${activity.slug}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{activity.title}</CardTitle>
          <Badge variant="secondary">{TYPE_LABELS[activity.type]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        Created {new Date(activity.created_at).toLocaleDateString()}
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/activities/${activity.id}/edit`}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/activities/${activity.id}/results`}>
            <BarChart2 className="h-3.5 w-3.5" />
            Results
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={playUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Play
          </a>
        </Button>
        <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
