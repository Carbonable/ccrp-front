import { Inter } from 'next/font/google';
import { NextUIProvider } from '@nextui-org/react';

const inter = Inter({ subsets: ['latin'] });

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100`}>
      <main>
        <NextUIProvider>{children}</NextUIProvider>
      </main>
    </div>
  );
}
