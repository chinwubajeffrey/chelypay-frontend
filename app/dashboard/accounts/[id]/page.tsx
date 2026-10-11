import type { Metadata } from "next";
import Link from "next/link";
import { DeleteAccountButton } from "@/components/account-forms";
import { Icon } from "@/components/icons";
import { LinkButton } from "@/components/ui";
import { getAccount } from "@/lib/data";
import { formatDate, money } from "@/lib/format";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeleton";

export const metadata: Metadata = { title: "Account" };

type Params = Promise<{ id: string }>;

export default function AccountPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AccountContent params={params} />
    </Suspense>
  );
}

async function AccountContent({ params }: { params: Params }) {
  const { id } = await params;
  const account = await getAccount(id);

  return (
    <div className="max-w-2xl space-y-8">
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
      >
        <Icon name="back" className="size-4" /> All accounts
      </Link>

      <section className="rounded-[28px] bg-pine p-7 text-[#f2f7f4] md:p-10">
        <p className="text-sm text-[#f2f7f4]/70">{account.accountName}</p>
        <p className="font-display mt-2 text-5xl font-semibold tabular-nums">
          {money(account.balance)}
        </p>
        <p className="mt-6 inline-block rounded-full bg-marigold px-3.5 py-1.5 text-sm font-semibold tabular-nums text-[#14201c]">
          {account.accountNumber}
        </p>
      </section>

      <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
        <div className="flex justify-between px-5 py-4">
          <dt className="text-muted">Account name</dt>
          <dd className="font-medium">{account.accountName}</dd>
        </div>
        <div className="flex justify-between px-5 py-4">
          <dt className="text-muted">Account number</dt>
          <dd className="font-medium tabular-nums">{account.accountNumber}</dd>
        </div>
        {account.createdAt && (
          <div className="flex justify-between px-5 py-4">
            <dt className="text-muted">Opened</dt>
            <dd className="font-medium">{formatDate(account.createdAt)}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap items-start gap-3">
        <LinkButton href="/dashboard/send">Send money</LinkButton>
        <LinkButton href="/dashboard/transactions" variant="secondary">
          See activity
        </LinkButton>
      </div>
      <DeleteAccountButton
        id={account.id}
        name={account.accountName}
        balance={account.balance}
      />
    </div>
  );
}
