import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizEditor } from "@/components/games/quiz/QuizEditor";

export default function NewQuizPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/activities/new">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New Quiz</h1>
      </div>
      <QuizEditor />
    </div>
  );
}
