import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramp Dock: buy, approve and pay for things by text",
  description:
    "Ramp already works by text for receipts. Ramp Dock brings the same texts to buying and paying bills: ask, approve, check what arrived and handle renewals.",
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
