import type { Metadata } from "next";
import { AgentDemo } from "@/components/agent-demo";

export const metadata: Metadata = {
  title: "Ramp agent demo",
  robots: { index: false },
};

export default function Demo() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f9f9] py-6">
      <AgentDemo />
    </main>
  );
}
