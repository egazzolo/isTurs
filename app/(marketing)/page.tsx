import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">isTurs</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Create interactive learning activities and share them with your students in seconds.
      </p>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/signup">Get started free</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Free plan: up to 5 activities. Pro plan: unlimited.
      </p>
    </main>
  );
}
