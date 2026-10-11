import type { Metadata } from "next";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/skeleton";
import { TransactionRow } from "@/components/transaction-row";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { getAccounts, getTransactions } from "@/lib/data";
import { directionOf } from "@/lib/format";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Activity" };

async function TransactionList() {
  const [session, accounts, transactions] = await Promise.all([
    getSession(),
    getAccounts(),
    getTransactions(),
  ]);
  const myIds = new Set([session?.id ?? "", ...accounts.map((a) => a.id)]);

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        body="When you send or receive money it will appear here."
        action={<LinkButton href="/dashboard/send">Send money</LinkButton>}
      />
    );
  }
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {transactions.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          direction={directionOf(tx, myIds)}
        />
      ))}
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Activity"
        description="Everything you have sent and received, newest first."
      />
      <Suspense fallback={<ListSkeleton />}>
        <TransactionList />
      </Suspense>
    </>
  );
}
