"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Overview", icon: "home" },
  { href: "/dashboard/accounts", label: "Accounts", icon: "accounts" },
  { href: "/dashboard/send", label: "Send", icon: "send" },
  { href: "/dashboard/transactions", label: "Activity", icon: "list" },
  { href: "/dashboard/assistant", label: "Assistant", icon: "sparkle" },
];

const isActive = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname === href : pathname.startsWith(href);

// usePathname() is runtime data, so each nav reads it inside <Suspense>.
// The fallback is the same nav with no active item, so nothing jumps around.
export function SideNav() {
  return (
    <Suspense fallback={<SideNavView pathname="" />}>
      <SideNavLive />
    </Suspense>
  );
}

function SideNavLive() {
  return <SideNavView pathname={usePathname()} />;
}

function SideNavView({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Main" className="mt-10 space-y-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-pine text-white"
                : "text-muted hover:bg-paper hover:text-ink"
            }`}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={<BottomNavView pathname="" />}>
      <BottomNavLive />
    </Suspense>
  );
}

function BottomNavLive() {
  return <BottomNavView pathname={usePathname()} />;
}

function BottomNavView({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-surface px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
              active ? "text-ink" : "text-muted"
            }`}
          >
            <span
              className={`rounded-full px-4 py-1 ${active ? "bg-marigold text-[#14201c]" : ""}`}
            >
              <Icon name={item.icon} className="size-5" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-ink ${className}`}
    >
      <Icon name="logout" className="size-4" />
      Sign out
    </button>
  );
}
