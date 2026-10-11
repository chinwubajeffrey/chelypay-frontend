import Link from "next/link";
import { Logo } from "@/components/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-pine p-12 text-[#f2f7f4] lg:flex">
        <Link href="/" className="text-white"><Logo /></Link>
        <p className="font-display max-w-md text-4xl font-semibold leading-tight">
          Every transfer, every balance, one clear screen.
        </p>
        <p className="max-w-sm text-sm text-[#f2f7f4]/70">
          Open accounts, send money and check your history without leaving the page.
        </p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden"><Logo /></Link>
          {children}
        </div>
      </main>
    </div>
  );
}
