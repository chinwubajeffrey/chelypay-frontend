import Link from "next/link";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-4 px-6">
      <h1 className="font-display text-4xl font-semibold">That page doesn&apos;t exist</h1>
      <p className="text-muted">The link may be old, or the item may have been deleted.</p>
      <Link href="/dashboard" className={buttonClass("primary")}>Go to your dashboard</Link>
    </main>
  );
}
