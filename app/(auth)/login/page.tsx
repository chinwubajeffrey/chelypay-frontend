import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; registered?: string }>;
}) {
  const { expired, registered } = await searchParams;
  return <LoginForm expired={!!expired} registered={!!registered} />;
}
