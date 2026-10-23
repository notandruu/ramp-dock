import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramp Dock: buy, approve and pay for things by text",
  description:
    "Ramp's Procure to Pay in a text thread. Ask for what you need, approve it, check what arrived and handle renewals without opening the dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
