'use client';

import { classNames } from '@/utils/utils';

export interface NavigationTabItem {
  key: string;
  label: React.ReactNode;
}

export default function NavigationTabs({
  items,
  activeKey,
}: {
  items: NavigationTabItem[];
  activeKey: string;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full gap-2 rounded-2xl border border-neutral-800 bg-opacity-light-5 p-2">
        {items.map((item) => {
          const active = item.key === activeKey;

          return (
            <div
              key={item.key}
              className={classNames(
                'rounded-xl border px-1 py-1 text-sm transition',
                active
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white',
              )}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
