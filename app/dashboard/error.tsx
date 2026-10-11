"use client";

import { Button } from "@/components/ui";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl bg-danger-bg p-8">
      <h1 className="font-display text-2xl font-semibold text-danger">We couldn&apos;t load this page</h1>
      <p className="mt-2 text-danger">{error.message || "Something went wrong."}</p>
      <Button onClick={reset} className="mt-5">Try again</Button>
    </div>
  );
}
