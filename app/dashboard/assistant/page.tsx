import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistant-chat";
import { Alert, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Assistant" };

export default function AssistantPage() {
  return (
    <>
      <PageHeader title="Assistant" description="Ask about your money in plain language." />
      <div className="mb-5 max-w-2xl">
        <Alert>
          The assistant can send money when your message includes an account number and an amount.
          Check what you type before you press Send.
        </Alert>
      </div>
      <div className="max-w-2xl">
        <AssistantChat />
      </div>
    </>
  );
}
