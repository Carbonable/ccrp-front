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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
