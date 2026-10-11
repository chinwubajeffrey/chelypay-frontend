"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Field } from "@/components/ui";
import { callApi } from "@/lib/client";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = Record<string, string>;

export function LoginForm({ expired, registered }: { expired?: boolean; registered?: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.username.trim()) next.username = "Enter your username.";
    if (!EMAIL.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setFormError("");
    try {
      await callApi("/api/auth/login", { body: { ...values, username: values.username.trim() } });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-muted">Welcome back. Enter your details to continue.</p>
      </div>
      {expired && <Alert>Your session ended. Sign in again to keep going.</Alert>}
      {registered && <Alert kind="success">Account created. Sign in to get started.</Alert>}
      {formError && <Alert>{formError}</Alert>}
      <Field label="Username" autoComplete="username" value={values.username} onChange={set("username")} error={errors.username} />
      <Field label="Email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
      <Field label="Password" type="password" autoComplete="current-password" value={values.password} onChange={set("password")} error={errors.password} />
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in…" : "Sign in"}</Button>
      <p className="text-sm text-muted">
        New to ChelyPay? <Link href="/register" className="font-semibold text-ink underline underline-offset-4">Create an account</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({ username: "", email: "", password: "", age: "", dateOfBirth: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    const age = Number(values.age);
    if (values.username.trim().length < 3) next.username = "Use at least 3 characters.";
    if (!EMAIL.test(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 6) next.password = "Use at least 6 characters.";
    if (!Number.isInteger(age) || age < 1 || age > 120) next.age = "Enter your age as a whole number.";
    if (!values.dateOfBirth) next.dateOfBirth = "Pick your date of birth.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setFormError("");
    try {
      await callApi("/api/auth/register", {
        body: { ...values, username: values.username.trim(), age },
      });
      router.replace("/login?registered=1");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not create the account.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-muted">It takes about a minute.</p>
      </div>
      {formError && <Alert>{formError}</Alert>}
      <Field label="Username" autoComplete="username" value={values.username} onChange={set("username")} error={errors.username} />
      <Field label="Email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
      <Field label="Password" type="password" autoComplete="new-password" value={values.password} onChange={set("password")} error={errors.password} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Age" inputMode="numeric" value={values.age} onChange={set("age")} error={errors.age} />
        <Field label="Date of birth" type="date" value={values.dateOfBirth} onChange={set("dateOfBirth")} error={errors.dateOfBirth} />
      </div>
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating account…" : "Create account"}</Button>
      <p className="text-sm text-muted">
        Already have an account? <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Sign in</Link>
      </p>
    </form>
  );
}
