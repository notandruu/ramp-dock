import type { Metadata } from "next";
import { WidgetGallery } from "@/components/agent-kit/gallery";

export const metadata: Metadata = {
  title: "Agent widgets",
  robots: { index: false },
};

export default function Widgets() {
  return (
    <main className="flex min-h-screen justify-center bg-[#fdfdfd] px-4 py-16">
      <WidgetGallery />
    </main>
  );
}
