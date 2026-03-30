import { SignUp } from '@clerk/nextjs';

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SignUp
        forceRedirectUrl={`/${locale}/dashboard`}
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-neutral-900 border border-neutral-700',
          },
        }}
      />
    </div>
  );
}
