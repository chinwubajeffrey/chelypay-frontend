import type { Account, Transaction } from "@/types";

// ASSUMPTION: only login/register responses are documented. These helpers
// accept the common shapes (bare array, { data: [...] }, { accounts: [...] },
// populated or plain ObjectId refs). If a real response differs, adjust here.

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const str = (v: unknown): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : "";

const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

const refId = (v: unknown): string => (isObj(v) ? str(v._id ?? v.id) : str(v));
const refLabel = (v: unknown): string =>
  isObj(v) ? str(v.accountName ?? v.username ?? v.accountNumber) : "";

export function pickList(raw: unknown, keys: string[]): Raw[] {
  if (Array.isArray(raw)) return raw.filter(isObj);
  if (isObj(raw)) {
    for (const k of [...keys, "data"]) {
      const v = raw[k];
      if (Array.isArray(v)) return v.filter(isObj);
      if (isObj(v)) {
        const inner = pickList(v, keys);
        if (inner.length) return inner;
      }
    }
  }
  return [];
}

export function pickOne(raw: unknown, keys: string[]): Raw | null {
  if (!isObj(raw)) return null;
  for (const k of [...keys, "data"]) {
    if (isObj(raw[k])) return raw[k] as Raw;
  }
  return raw;
}

export function toAccount(r: Raw): Account {
  return {
    id: str(r._id ?? r.id),
    accountName: str(r.accountName) || "Account",
    accountNumber: str(r.accountNumber),
    balance: num(r.accountAmount ?? r.balance),
    createdAt: str(r.createdAt),
  };
}

export function toTransaction(r: Raw): Transaction {
  return {
    id: str(r._id ?? r.id),
    senderId: refId(r.sender),
    receiverId: refId(r.receiver),
    senderLabel: refLabel(r.sender),
    receiverLabel: refLabel(r.receiver),
    amount: num(r.amount),
    description: str(r.description),
    createdAt: str(r.createdAt),
  };
}

// The AI endpoint's response shape is undocumented, so dig out the first
// readable string and fall back to raw JSON rather than showing nothing.
export function extractReply(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (isObj(raw)) {
    for (const k of ["reply", "response", "answer", "message", "result", "content", "text", "data"]) {
      const v = raw[k];
      if (typeof v === "string" && v.trim()) return v;
      if (isObj(v)) return extractReply(v);
    }
  }
  return JSON.stringify(raw);
}
