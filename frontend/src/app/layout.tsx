import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/provider";
import { BackgroundGradient } from "@/components/BackgroundGradient";

export const metadata: Metadata = {
  title: "ONES Marketplace",
  description: "ONES Marketplace User Portal"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <BackgroundGradient />
        <div className="relative z-10">
          <StoreProvider>{children}</StoreProvider>
        </div>
      </body>
    </html>
  );
}
