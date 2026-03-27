import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="en" className="bg-neutral-950">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
