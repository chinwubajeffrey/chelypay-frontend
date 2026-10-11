import { CURRENCY, LOCALE } from "@/lib/config";
import type { Direction, Transaction } from "@/types";

export const money = (n: number) =>
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY }).format(n);

// Sum in minor units so 0.1 + 0.2 style float errors never reach the screen.
export const sumMoney = (values: number[]) =>
  values.reduce((total, v) => total + Math.round(v * 100), 0) / 100;

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export const maskAccount = (n: string) => (n.length > 4 ? `•••• ${n.slice(-4)}` : n);
export const shortId = (id: string) => id.slice(-6);

// Accepts "100", "100.5", "100.50". Positive, max two decimals.
export function parseAmount(input: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(input.trim())) return null;
  const n = Number(input);
  return n > 0 ? n : null;
}

// myIds = the user's id plus their account ids; the backend may reference either.
export function directionOf(tx: Transaction, myIds: Set<string>): Direction {
  if (myIds.has(tx.senderId)) return "sent";
  if (myIds.has(tx.receiverId)) return "received";
  return "other";
}
