import Link from "next/link";
import { BookOpen, MousePointerClick, RotateCcw, Swords } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TEMPLATES = [
  {
    type: "quiz",
    href: "/activities/new/quiz",
    icon: BookOpen,
    title: "Quiz",
    description: "Multiple-choice questions with a timer. Students pick the right answer.",
    available: true,
  },
  {
    type: "match_up",
    href: "/activities/new/match-up",
    icon: Swords,
    title: "Match Up",
    description: "Drag-and-drop matching pairs. Coming soon.",
    available: false,
  },
  {
    type: "whack_a_mole",
    href: "/activities/new/whack-a-mole",
    icon: MousePointerClick,
    title: "Whack-a-mole",
    description: "Tap the correct answers before they disappear. Coming soon.",
    available: false,
  },
  {
    type: "spin_wheel",
    href: "/activities/new/spin-wheel",
    icon: RotateCcw,
    title: "Spin the Wheel",
    description: "Random question selector. Coming soon.",
    available: false,
  },
];

export function TemplatePicker() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TEMPLATES.map(({ type, href, icon: Icon, title, description, available }) => (
        <Link key={type} href={href} className={!available ? "pointer-events-none" : ""} tabIndex={available ? 0 : -1}>
          <Card className={`h-full transition-shadow hover:shadow-md ${!available ? "opacity-60" : "cursor-pointer"}`}>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {!available && (
                <span className="text-xs font-medium text-muted-foreground">Coming soon</span>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
