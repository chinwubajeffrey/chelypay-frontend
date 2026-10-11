import { Suspense } from "react";
import { BottomNav, LogoutButton, SideNav } from "@/components/nav";
import { Logo } from "@/components/ui";
import { getSession } from "@/lib/session";

// Reading the cookie is runtime data, so it lives in its own component inside
// <Suspense>. Access control itself is handled by proxy.ts before this renders.
async function UserName() {
  const session = await getSession();
  return <>{session?.username}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface p-6 md:flex">
        <Logo />
        <SideNav />
        <div className="mt-auto border-t border-line pt-4">
          <p className="min-h-5 truncate px-3 text-sm font-semibold">
            <Suspense fallback={null}>
              <UserName />
            </Suspense>
          </p>
          <LogoutButton className="mt-1 w-full" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
          <Logo />
          <LogoutButton />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-28 md:px-10 md:py-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
