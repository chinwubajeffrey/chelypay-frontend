import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountCard } from "@/components/account-card";
import { CreateAccountForm } from "@/components/account-forms";
import { ListSkeleton } from "@/components/skeleton";
import { EmptyState, PageHeader } from "@/components/ui";
import { getAccounts } from "@/lib/data";
import { log } from "node:console";

export const metadata: Metadata = { title: "Accounts" };

async function AccountList() {
  const accounts = await getAccounts();
  console.log(accounts);
  if (accounts.length === 0) {
    return (
      <EmptyState
        title="No accounts yet"
        body="Use the form to open your first account."
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {accounts.map((a) => (
        <AccountCard key={a.id} account={a} />
      ))}
    </div>
  );
}

export default function AccountsPage() {
  return (
    <>
      <PageHeader
        title="Accounts"
        description="Every account you hold, and a place to open a new one."
      />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Suspense fallback={<ListSkeleton rows={2} />}>
          <AccountList />
        </Suspense>
        <CreateAccountForm />
      </div>
    </>
  );
}
