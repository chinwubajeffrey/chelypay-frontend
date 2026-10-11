import type { Metadata } from "next";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { SendForm } from "@/components/send-form";
import { getAccounts } from "@/lib/data";
import { sumMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Send money" };

export default async function SendPage() {
  const accounts = await getAccounts();
  const total = sumMoney(accounts.map((a) => a.balance));

  return (
    <>
      <PageHeader title="Send money" description="Transfer to any ChelyPay account number." />
      <div className="max-w-xl">
        {accounts.length === 0 ? (
          <EmptyState
            title="You need an account first"
            body="Open an account before you send money."
            action={<LinkButton href="/dashboard/accounts">Create an account</LinkButton>}
          />
        ) : (
          <SendForm totalBalance={total} />
        )}
      </div>
    </>
  );
}
