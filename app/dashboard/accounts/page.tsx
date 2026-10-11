import type { Metadata } from "next";
import { AccountCard } from "@/components/account-card";
import { CreateAccountForm } from "@/components/account-forms";
import { EmptyState, PageHeader } from "@/components/ui";
import { getAccounts } from "@/lib/data";

export const metadata: Metadata = { title: "Accounts" };

export default async function AccountsPage() {
  const accounts = await getAccounts();
  return (
    <>
      <PageHeader title="Accounts" description="Every account you hold, and a place to open a new one." />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          {accounts.length === 0 ? (
            <EmptyState title="No accounts yet" body="Use the form to open your first account." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {accounts.map((a) => <AccountCard key={a.id} account={a} />)}
            </div>
          )}
        </div>
        <CreateAccountForm />
      </div>
    </>
  );
}
