import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio manager",
  description: "Your carbon assets portfolio manager by Carbonable",
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-800 text-neutral-100`}>
        <main className="p-4 md:p-12 z-0 max-w-screen-2xl mx-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}