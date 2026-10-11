import type { Metadata } from "next";
import { Suspense } from "react";
import { SendForm } from "@/components/send-form";
import { ListSkeleton } from "@/components/skeleton";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { getAccounts } from "@/lib/data";
import { sumMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Send money" };

async function SendContent() {
  const accounts = await getAccounts();
  if (accounts.length === 0) {
    return (
      <EmptyState
        title="You need an account first"
        body="Open an account before you send money."
        action={
          <LinkButton href="/dashboard/accounts">Create an account</LinkButton>
        }
      />
    );
  }
  return <SendForm totalBalance={sumMoney(accounts.map((a) => a.balance))} />;
}

export default function SendPage() {
  return (
    <>
      <PageHeader
        title="Send money"
        description="Transfer to any ChelyPay account number."
      />
      <div className="max-w-xl">
        <Suspense fallback={<ListSkeleton rows={2} />}>
          <SendContent />
        </Suspense>
      </div>
    </>
  );
}
