"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function Nav() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-bold text-lg">
          isTurs
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Activities
          </Link>
          <Link href="/billing" className="text-sm text-muted-foreground hover:text-foreground">
            Billing
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
