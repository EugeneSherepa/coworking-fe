import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Spark – Coworking Spaces in Kyiv",
  description: "Book a desk, private office or meeting room at Spark coworking spaces across Kyiv.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
