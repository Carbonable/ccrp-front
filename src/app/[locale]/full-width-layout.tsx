import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function FullWidthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100`}>
      <main>{children}</main>
    </div>
  );
}
