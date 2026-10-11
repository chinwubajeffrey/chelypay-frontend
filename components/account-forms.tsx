"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Field } from "@/components/ui";
import { callApi } from "@/lib/client";
import { money, parseAmount } from "@/lib/format";

// Dev-only switch (see .env.local) so you can fund test accounts.
const DEMO_FUNDING = process.env.NEXT_PUBLIC_DEMO_FUNDING === "true";

export function CreateAccountForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [opening, setOpening] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Give the account a name.";
    if (!/^\d{10}$/.test(number)) next.number = "Account numbers are 10 digits.";
    let accountAmount = 0;
    if (DEMO_FUNDING && opening) {
      const parsed = parseAmount(opening);
      if (parsed === null) next.opening = "Enter an amount like 5000 or 5000.50.";
      else accountAmount = parsed;
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setFormError("");
    setDone(false);
    try {
      await callApi("/api/backend/account/create", {
        body: { accountName: name.trim(), accountNumber: number, accountAmount },
      });
      setName("");
      setNumber("");
      setOpening("");
      setDone(true);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-xl font-semibold">Open a new account</h2>
      {formError && <Alert>{formError}</Alert>}
      {done && <Alert kind="success">Account created.</Alert>}
      <Field label="Account name" placeholder="Main savings" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Field label="Account number" inputMode="numeric" maxLength={10} placeholder="10 digits" value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} error={errors.number} />
      {DEMO_FUNDING && (
        <Field label="Opening balance (test only)" inputMode="decimal" placeholder="0" value={opening} onChange={(e) => setOpening(e.target.value)} error={errors.opening} hint="Visible in development only." />
      )}
      <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
    </form>
  );
}

export function DeleteAccountButton({ id, name, balance }: { id: string; name: string; balance: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setLoading(true);
    setError("");
    try {
      await callApi(`/api/backend/account/delete/${id}`, { method: "DELETE" });
      router.replace("/dashboard/accounts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the account.");
      setLoading(false);
    }
  }

  if (!confirming) {
    return <Button variant="secondary" onClick={() => setConfirming(true)}>Delete account</Button>;
  }
  return (
    <div role="alertdialog" aria-label={`Delete ${name}`} className="space-y-3 rounded-2xl bg-danger-bg p-4">
      <p className="text-sm text-danger">
        Delete &ldquo;{name}&rdquo;?
        {balance > 0 && ` It still holds ${money(balance)}.`} This can&apos;t be undone.
      </p>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button variant="danger" onClick={remove} disabled={loading}>{loading ? "Deleting…" : "Yes, delete it"}</Button>
        <Button variant="secondary" onClick={() => setConfirming(false)} disabled={loading}>Keep account</Button>
      </div>
    </div>
  );
}
