"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Field } from "@/components/ui";
import { callApi } from "@/lib/client";
import { money, parseAmount } from "@/lib/format";

type Step = "form" | "review" | "done";

export function SendForm({ totalBalance }: { totalBalance: number }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = parseAmount(amount);

  function review(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!/^\d{10}$/.test(number)) next.number = "Enter the 10-digit account number.";
    if (parsed === null) next.amount = "Enter an amount like 2500 or 2500.50.";
    else if (parsed > totalBalance) next.amount = `You only have ${money(totalBalance)} available.`;
    setErrors(next);
    if (Object.keys(next).length) return;
    setFormError("");
    setStep("review");
  }

  async function confirm() {
    if (loading || parsed === null) return; // blocks double submits
    setLoading(true);
    setFormError("");
    try {
      const res = await callApi<{ message?: string }>("/api/backend/transaction/send", {
        body: { accountNumber: number, amount: parsed, description: note.trim() },
      });
      setResult(res.message ?? "Your transfer was sent.");
      setStep("done");
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "The transfer failed.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setNumber("");
    setAmount("");
    setNote("");
    setResult("");
    setStep("form");
  }

  if (step === "done") {
    return (
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <Alert kind="success">{result}</Alert>
        <p className="text-lg">
          You sent <strong className="tabular-nums">{money(parsed ?? 0)}</strong> to account{" "}
          <strong className="tabular-nums">{number}</strong>.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/transactions" className="inline-flex rounded-xl bg-action px-4 py-2.5 text-sm font-semibold text-action-ink">
            See activity
          </Link>
          <Button variant="secondary" onClick={reset}>Send another</Button>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-display text-xl font-semibold">Check the details</h2>
        <dl className="divide-y divide-line rounded-xl border border-line">
          <div className="flex justify-between px-4 py-3"><dt className="text-muted">Amount</dt><dd className="font-semibold tabular-nums">{money(parsed ?? 0)}</dd></div>
          <div className="flex justify-between px-4 py-3"><dt className="text-muted">To account</dt><dd className="font-semibold tabular-nums">{number}</dd></div>
          <div className="flex justify-between gap-6 px-4 py-3"><dt className="text-muted">Note</dt><dd className="text-right">{note.trim() || "None"}</dd></div>
        </dl>
        <p className="text-sm text-muted">Transfers can&apos;t be undone once they are sent.</p>
        <div className="flex gap-3">
          <Button onClick={confirm} disabled={loading}>{loading ? "Sending…" : `Send ${money(parsed ?? 0)}`}</Button>
          <Button variant="secondary" onClick={() => setStep("form")} disabled={loading}>Edit</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={review} noValidate className="space-y-5 rounded-2xl border border-line bg-surface p-6">
      {formError && <Alert>{formError}</Alert>}
      <Field label="Recipient account number" inputMode="numeric" maxLength={10} placeholder="10 digits" value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} error={errors.number} />
      <Field label="Amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} error={errors.amount} hint={`Available: ${money(totalBalance)}`} />
      <Field label="Note (optional)" placeholder="What is this for?" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button type="submit">Review transfer</Button>
    </form>
  );
}
