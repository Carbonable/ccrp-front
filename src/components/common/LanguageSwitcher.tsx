'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`cursor-pointer px-2 py-1 text-xs font-medium rounded transition-colors ${
            locale === l
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
