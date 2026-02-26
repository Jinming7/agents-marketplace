import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apps Marketplace",
  description: "REQ-0001 iteration 1"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
