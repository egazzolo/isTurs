import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpinWheelEditorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/activities/new">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Spin the Wheel</h1>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
        <p className="text-xl font-semibold">Coming soon</p>
        <p className="mt-2 text-muted-foreground">Spin the Wheel activities are under development.</p>
      </div>
    </div>
  );
}
