import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { counterparty } from "@/components/transaction-row";
import { getAccounts, getTransaction } from "@/lib/data";
import { directionOf, formatDate, money, shortId } from "@/lib/format";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Transaction" };

export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, accounts, tx] = await Promise.all([getSession(), getAccounts(), getTransaction(id)]);
  const myIds = new Set([session?.id ?? "", ...accounts.map((a) => a.id)]);
  const direction = directionOf(tx, myIds);
  const received = direction === "received";

  const rows: [string, string][] = [
    ["Status", "Completed"],
    [
      direction === "received" ? "From" : direction === "sent" ? "To" : "Between",
      counterparty(tx, direction),
    ],
    ["Note", tx.description || "None"],
    ["Date", formatDate(tx.createdAt) || "Unknown"],
    ["Reference", shortId(tx.id)],
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <Link href="/dashboard/transactions" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
        <Icon name="back" className="size-4" /> All activity
      </Link>
      <section className="rounded-[28px] border border-line bg-surface p-7 md:p-10">
        <p className="text-sm text-muted">
          {direction === "sent" ? "You sent" : direction === "received" ? "You received" : "Transfer"}
        </p>
        <p className={`font-display mt-2 text-5xl font-semibold tabular-nums ${received ? "text-ok" : ""}`}>
          {money(tx.amount)}
        </p>
      </section>
      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6 px-5 py-4">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
