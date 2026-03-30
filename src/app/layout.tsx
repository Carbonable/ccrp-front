import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: 'Carbonable CCPM',
  description: 'Carbon Credit Retirement Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark bg-neutral-950", "font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
