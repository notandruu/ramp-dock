import type { Metadata } from "next";
import { WidgetGallery } from "@/components/agent-kit/gallery";

export const metadata: Metadata = {
  title: "Agent widgets",
  robots: { index: false },
};

export default function Widgets() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fdfdfd] px-4 py-10">
      <WidgetGallery />
    </main>
  );
}
