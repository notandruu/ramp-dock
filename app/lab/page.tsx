import type { Metadata } from "next";
import { AgentReplica } from "@/components/agent-replica";

export const metadata: Metadata = {
  title: "Text your agent: replica",
  robots: { index: false },
};

export default function Lab() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f9f9] py-6">
      <AgentReplica />
    </main>
  );
}
