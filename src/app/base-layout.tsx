import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Carbonable CCPM',
  description: 'Your carbon assets portfolio manager by Carbonable',
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-neutral-950">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
