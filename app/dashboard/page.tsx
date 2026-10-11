import type { Metadata } from "next";
import { AccountCard } from "@/components/account-card";
import { EmptyState, LinkButton } from "@/components/ui";
import { TransactionRow } from "@/components/transaction-row";
import { getAccounts, getTransactions } from "@/lib/data";
import { directionOf, money, sumMoney } from "@/lib/format";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeleton";

export const metadata: Metadata = { title: "Overview" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const [session, accounts, transactions] = await Promise.all([
    getSession(),
    getAccounts(),
    getTransactions(),
  ]);
  const total = sumMoney(accounts.map((a) => a.balance));
  const myIds = new Set([session?.id ?? "", ...accounts.map((a) => a.id)]);
  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="rounded-[28px] bg-pine p-7 text-[#f2f7f4] md:p-10">
        <p className="text-sm text-[#f2f7f4]/70">
          Hi {session?.username}, your total balance is
        </p>
        <p className="font-display mt-2 text-5xl font-semibold tabular-nums md:text-6xl">
          {money(total)}
        </p>
        <p className="mt-2 text-sm text-[#f2f7f4]/70">
          Across {accounts.length}{" "}
          {accounts.length === 1 ? "account" : "accounts"}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/dashboard/send" variant="marigold">
            Send money
          </LinkButton>
          <LinkButton href="/dashboard/accounts" variant="onDark">
            New account
          </LinkButton>
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 text-xl font-semibold">
          Your accounts
        </h2>
        {accounts.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            body="Create your first account to start sending and receiving money."
            action={
              <LinkButton href="/dashboard/accounts">
                Create an account
              </LinkButton>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((a) => (
              <AccountCard key={a.id} account={a} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">
            Recent activity
          </h2>
          <Link
            href="/dashboard/transactions"
            className="text-sm font-semibold underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            body="Transfers you send or receive will show up here."
          />
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {recent.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                direction={directionOf(tx, myIds)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
