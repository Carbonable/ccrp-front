import { classNames } from '@/utils/utils';

export default function MessageBubble({
  role,
  children,
  className,
}: Readonly<{
  role: 'user' | 'assistant';
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={classNames(
        'max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6',
        role === 'assistant'
          ? 'border border-neutral-800 bg-neutral-950 text-neutral-100'
          : 'ml-auto border border-primary/15 bg-primary/12 text-primary',
        className,
      )}
    >
      {children}
    </div>
  );
}
