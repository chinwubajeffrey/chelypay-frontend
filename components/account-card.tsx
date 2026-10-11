import Link from "next/link";
import { maskAccount, money } from "@/lib/format";
import type { Account } from "@/types";

export function AccountCard({ account }: { account: Account }) {
  return (
    <Link
      href={`/dashboard/accounts/${account.id}`}
      className="block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-[var(--focus)]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="truncate font-medium">{account.accountName}</span>
        <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium tabular-nums text-muted">
          {maskAccount(account.accountNumber)}
        </span>
      </span>
      <span className="font-display mt-6 block text-2xl font-semibold tabular-nums">
        {money(account.balance)}
      </span>
    </Link>
  );
}
