import type { Metadata } from "next";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { TransactionRow } from "@/components/transaction-row";
import { getAccounts, getTransactions } from "@/lib/data";
import { directionOf } from "@/lib/format";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Activity" };

export default async function TransactionsPage() {
  const [session, accounts, transactions] = await Promise.all([
    getSession(),
    getAccounts(),
    getTransactions(),
  ]);
  const myIds = new Set([session?.id ?? "", ...accounts.map((a) => a.id)]);

  return (
    <>
      <PageHeader title="Activity" description="Everything you have sent and received, newest first." />
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          body="When you send or receive money it will appear here."
          action={<LinkButton href="/dashboard/send">Send money</LinkButton>}
        />
      ) : (
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} direction={directionOf(tx, myIds)} />
          ))}
        </div>
      )}
    </>
  );
}
