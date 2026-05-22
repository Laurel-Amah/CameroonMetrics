import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CameroonMetrics",
  description:
    "Cameroon business news for owners, entrepreneurs, and young professionals—explained clearly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans text-[15px] tracking-[0.012em] text-ink selection:bg-brand/15 selection:text-ink sm:text-base sm:tracking-normal">
        <SiteHeader />
        <main className="min-h-[calc(100vh-4.5rem)] flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
