import Link from "next/link";
import { Icon } from "@/components/icons";
import { formatDate, money, shortId } from "@/lib/format";
import type { Direction, Transaction } from "@/types";

export function counterparty(tx: Transaction, direction: Direction) {
  if (direction === "sent") return tx.receiverLabel || `Account …${shortId(tx.receiverId)}`;
  if (direction === "received") return tx.senderLabel || `Account …${shortId(tx.senderId)}`;
  return `${tx.senderLabel || shortId(tx.senderId)} to ${tx.receiverLabel || shortId(tx.receiverId)}`;
}

export function TransactionRow({ tx, direction }: { tx: Transaction; direction: Direction }) {
  const received = direction === "received";
  const title =
    direction === "sent" ? "Sent to" : direction === "received" ? "Received from" : "Transfer";
  return (
    <Link
      href={`/dashboard/transactions/${tx.id}`}
      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper"
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full ${
          received ? "bg-ok-bg text-ok" : "bg-paper text-muted"
        }`}
      >
        <Icon name={received ? "down" : "up"} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">
          {title} {direction !== "other" && counterparty(tx, direction)}
        </span>
        <span className="block truncate text-sm text-muted">{tx.description || "No description"}</span>
      </span>
      <span className="text-right">
        <span className={`block font-semibold tabular-nums ${received ? "text-ok" : ""}`}>
          {received ? "+" : direction === "sent" ? "−" : ""}
          {money(tx.amount)}
        </span>
        <span className="block text-xs text-muted">{formatDate(tx.createdAt)}</span>
      </span>
    </Link>
  );
}
