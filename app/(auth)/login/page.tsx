import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Sign in" };

type Params = Promise<{ expired?: string; registered?: string }>;

// searchParams is runtime data, so it is read inside <Suspense>. The page shell
// (the form) prerenders instantly; the banners appear once the params resolve.
async function LoginWithParams({ searchParams }: { searchParams: Params }) {
  const { expired, registered } = await searchParams;
  return <LoginForm expired={!!expired} registered={!!registered} />;
}

export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginWithParams searchParams={searchParams} />
    </Suspense>
  );
}
