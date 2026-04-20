import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TemplatePicker } from "@/components/dashboard/TemplatePicker";
import { Button } from "@/components/ui/button";

export default function NewActivityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Choose a template</h1>
      </div>
      <TemplatePicker />
    </div>
  );
}
