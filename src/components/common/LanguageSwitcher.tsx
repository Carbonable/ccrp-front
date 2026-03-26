'use client';

import { useLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;

    // Get current path and strip any locale prefix
    const currentPath = window.location.pathname;
    let stripped = currentPath;
    for (const loc of routing.locales) {
      if (stripped.startsWith(`/${loc}/`)) {
        stripped = stripped.slice(loc.length + 1);
        break;
      }
      if (stripped === `/${loc}`) {
        stripped = '/';
        break;
      }
    }

    // Navigate directly — simple and can't double-prefix
    window.location.href = `/${newLocale}${stripped}`;
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={l === locale}
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
