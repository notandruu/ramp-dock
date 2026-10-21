import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramp Dock: every delivery, checked before it's paid",
  description:
    "A Procure to Pay SMS agent concept for Ramp. Field crews text a photo of the delivery ticket, and Ramp checks it against the PO and the invoice before anything is paid.",
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
