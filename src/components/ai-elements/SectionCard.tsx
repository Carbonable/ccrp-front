import { classNames } from '@/utils/utils';

export default function SectionCard({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={classNames(
        'rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 text-neutral-200 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
