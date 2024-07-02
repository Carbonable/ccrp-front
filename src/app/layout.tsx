import BaseLayout from "./base-layout";
import dynamic from 'next/dynamic'

const AuthProviderClient = dynamic(() => import('@/components/authentication/AuthProviderClient'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <AuthProviderClient>
        {children}
      </AuthProviderClient>
    </BaseLayout>
  );
}