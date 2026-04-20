"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function BillingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  if (searchParams.get("success") === "1") {
    toast.success("Subscription activated! Welcome to Pro.");
  }
  if (searchParams.get("canceled") === "1") {
    toast.info("Checkout canceled.");
  }

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              <Badge variant="secondary">Current</Badge>
            </div>
            <CardDescription>Get started at no cost.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Up to 5 activities</p>
            <p>✓ All 4 game types (when available)</p>
            <p>✓ Anonymous student plays</p>
            <p>✓ Basic results analytics</p>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pro</CardTitle>
              <Badge>$9 / mo</Badge>
            </div>
            <CardDescription>For power users and schools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Unlimited activities</p>
            <p>✓ Everything in Free</p>
            <p>✓ Priority support</p>
            <Button className="mt-4 w-full" onClick={handleUpgrade} disabled={loading}>
              {loading ? "Redirecting…" : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
