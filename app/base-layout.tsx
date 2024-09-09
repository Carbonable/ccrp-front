import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";

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
      <body className={`${inter.className} bg-neutral-800 text-neutral-100 min-h-screen`}>
        <main>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </main>
      </body>
    </html>
  );
}