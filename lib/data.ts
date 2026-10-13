import { notFound, redirect } from "next/navigation";
import { backend, ApiError } from "@/lib/backend";
import { pickList, pickOne, toAccount, toTransaction } from "@/lib/mappers";
import type { Account, Transaction } from "@/types";
import { log } from "node:console";

// Runs a backend call. Expired/invalid token -> back to login.
// A 404 on a list endpoint is treated as "empty" (backend may say "none found").
async function guard<T>(fn: () => Promise<T>, onNotFound?: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 401) redirect("/login?expired=1");
      if (e.status === 404 && onNotFound !== undefined) return onNotFound;
    }
    throw e;
  }
}

export async function getAccounts(): Promise<Account[]> {
  const raw = await guard<unknown>(() => backend("/chelypay/account/get"), []);
  console.log(pickList(raw, ["account"]).map(toAccount));
  return pickList(raw, ["account"]).map(toAccount);
}

export async function getAccount(id: string): Promise<Account> {
  let raw: unknown;
  try {
    raw = await guard(() =>
      backend(`/chelypay/account/get/${encodeURIComponent(id)}`),
    );
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400))
      notFound();
    throw e;
  }
  // The backend may send { account: {...} } or { account: [{...}] }
  const r = pickList(raw, ["account"])[0] ?? pickOne(raw, ["account"]);
  const account = r ? toAccount(r) : null;
  if (!account || !account.id) notFound();
  return account;
}

export async function getTransactions(): Promise<Transaction[]> {
  const raw = await guard<unknown>(
    () => backend("/chelypay/transaction/view-transactions"),
    [],
  );
  return pickList(raw, ["transactions"])
    .map(toTransaction)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTransaction(id: string): Promise<Transaction> {
  let raw: unknown;
  try {
    raw = await guard(() =>
      backend(`/chelypay/transaction/transaction/${encodeURIComponent(id)}`),
    );
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400))
      notFound();
    throw e;
  }
  const r =
    pickList(raw, ["transactions"])[0] ?? pickOne(raw, ["transactions"]);
  const tx = r ? toTransaction(r) : null;
  if (!tx || !tx.id) notFound();
  return tx;
}
