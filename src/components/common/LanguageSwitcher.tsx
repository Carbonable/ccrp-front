'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;

    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={l === locale}
          className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors ${
            locale === l
              ? 'border border-green-500/30 bg-green-500/20 text-green-400'
              : 'border border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
