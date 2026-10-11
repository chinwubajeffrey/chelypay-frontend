import Link from "next/link";
import { LinkButton, Logo } from "@/components/ui";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-6 md:px-10">
      <header className="flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-surface">Sign in</Link>
          <LinkButton href="/register">Create account</LinkButton>
        </nav>
      </header>

      <main className="grid flex-1 items-center gap-14 py-16 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Your money, in one clear view.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Open accounts, send money to any account number, and see every transfer you have made or received.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/register" className="px-6 py-3 text-base">Open an account</LinkButton>
            <LinkButton href="/login" variant="secondary" className="px-6 py-3 text-base">Sign in</LinkButton>
          </div>
        </div>

        <div className="settle relative" aria-hidden="true">
          <div className="rounded-[28px] bg-pine p-8 text-[#f2f7f4] shadow-2xl shadow-black/20 md:p-10">
            <p className="text-sm text-[#f2f7f4]/70">Total balance</p>
            <p className="font-display mt-2 text-5xl font-semibold tabular-nums">₦ 482,350.00</p>
            <div className="mt-10 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm">
              <span>Main savings</span>
              <span className="rounded-full bg-marigold px-3 py-1 font-semibold text-[#14201c]">•••• 4821</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
