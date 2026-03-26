# i18n Refactoring Task — CCRP Front

## What's Already Done
- `next-intl` installed in package.json
- Translation files: `messages/en.json` and `messages/fr.json` (complete)
- i18n config: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
- `next.config.mjs` updated with `createNextIntlPlugin`

## What You Need To Do

### Step 1: Restructure App Directory for `[locale]` routing

Move ALL routes under `src/app/[locale]/`:
- `src/app/[locale]/layout.tsx` — root layout with `NextIntlClientProvider`
- `src/app/[locale]/page.tsx` (homepage)
- `src/app/[locale]/dashboard/...`
- `src/app/[locale]/portfolio/...`
- `src/app/[locale]/projects/...`
- `src/app/[locale]/admin/...`
- `src/app/[locale]/baseline/...`
- `src/app/[locale]/calculator/...`
- `src/app/[locale]/settings/...`
- `src/app/[locale]/sign-in/...`
- `src/app/[locale]/sign-up/...`
- `src/app/[locale]/not-found.tsx`

Keep `src/app/api/` at the root (API routes don't get localized).
Keep `src/app/layout.tsx` as a minimal root layout (just html/body tags).
Move `src/app/ApolloWrapper.tsx`, `src/app/client-layout.tsx`, `src/app/base-layout.tsx`, `src/app/full-width-layout.tsx` into `src/app/[locale]/`.

### Step 2: Update Middleware

Replace `src/middleware.ts` with a combined Clerk + next-intl middleware:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale',
  '/api/sanity(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Run intl middleware first to handle locale
  const intlResponse = intlMiddleware(request);
  
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  
  return intlResponse;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### Step 3: Update ALL Components to Use `useTranslations`

For every `.tsx` component that has hardcoded English strings:

1. Add `import { useTranslations } from 'next-intl';`
2. Add `const t = useTranslations('namespace');` at the top of the component
3. Replace every hardcoded string with `t('key')` or `t('key', { param: value })` for interpolated strings

#### Namespace mapping:
- Menu/sidebar components → `useTranslations('menu')`
- Dashboard components → `useTranslations('dashboard')` + `useTranslations('tables')`
- Portfolio components → `useTranslations('portfolio')`
- Project components → `useTranslations('project')` + `useTranslations('projectInfo')` + `useTranslations('projectMetrics')`
- Table components → `useTranslations('tables')`
- Allocation components → `useTranslations('allocation')`
- Impact components → `useTranslations('impact')`
- Chart components → `useTranslations('charts')`
- Notification components → `useTranslations('notifications')`
- Admin components → `useTranslations('admin')`
- Baseline page → `useTranslations('baseline')`
- Common/shared → `useTranslations('common')`
- BU Allocation → `useTranslations('buAllocation')`

#### Key files to update (ALL of these):
- `src/components/menu/Menu.tsx` — menu labels (but labels come from `links.ts`)
- `src/components/menu/links.ts` — CANNOT use hooks here (not a component). Instead, make link labels translation keys and resolve them in Menu.tsx
- `src/components/menu/Header.tsx`
- `src/components/menu/Logout.tsx`
- `src/components/common/Title.tsx` — title prop is already passed in, parents need to pass translated strings
- `src/components/common/BannerKPI.tsx` — title prop passed from parents
- `src/components/common/ErrorReload.tsx`
- `src/components/common/ExportButton.tsx`
- `src/components/KPI.tsx`
- `src/components/dashboard/Navigation.tsx` — tab titles
- `src/components/dashboard/net-zero/GlobalData.tsx`
- `src/components/common/global-data/GlobalData.tsx` — KPI titles
- `src/components/dashboard/net-zero/ProjectDecarbonationTable.tsx`
- `src/components/dashboard/net-zero/ProjectDecarbonationTableCumulative.tsx`
- `src/components/dashboard/net-zero/OrdersAnnualTable.tsx`
- `src/components/dashboard/net-zero/FinancialAnalysisTable.tsx`
- `src/components/common/net-zero/ProjectDecarbonationTableComponent.tsx` — all table headers + export headers
- `src/components/portfolio/overview/Banner.tsx` — KPI titles
- `src/components/portfolio/overview/ProjectsList.tsx`
- `src/components/portfolio/Navigation.tsx`
- `src/components/project/Navigation.tsx` — tab titles
- `src/components/project/ProjectInfo.tsx` — KPI titles
- `src/components/project/ProjectsMetricsComponenent.tsx` — KPI titles
- `src/components/project/ProjectHeader.tsx`
- `src/components/project/ProjectsColors.tsx`
- `src/components/project/ProjectsCountries.tsx`
- `src/components/project/ProjectsStandards.tsx`
- `src/components/project/ProjectsTypes.tsx`
- `src/components/project/carbon-management/` — all files
- `src/components/project/overview/TabsWrapper.tsx`
- `src/components/project/overview/SectionWrapper.tsx`
- `src/components/common/impact/ImpactComponent.tsx`
- `src/components/allocation/` — all files
- `src/components/dashboard/business-unit-allocation/` — all files
- `src/components/portfolio/project-allocation/` — all files
- `src/components/reporting/ProjectsImpact.tsx`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/notifications/NotificationDropdown.tsx`
- `src/components/tracking/` — all files
- `src/components/admin/` — all files
- `src/app/[locale]/baseline/page.tsx` — big page with tons of strings
- `src/app/[locale]/calculator/page.tsx`
- `src/app/[locale]/not-found.tsx`
- `src/app/[locale]/dashboard/page.tsx`
- `src/app/[locale]/projects/[slug]/page.tsx`
- `src/app/[locale]/projects/[slug]/ProjectPageClient.tsx`
- `src/app/[locale]/projects/[slug]/dmrv/page.tsx`
- `src/app/[locale]/admin/page.tsx`
- `src/app/[locale]/settings/notifications/page.tsx`

### Step 4: Language Switcher Component

Create `src/components/common/LanguageSwitcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
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
```

Add this to `Header.tsx` (mobile) and `Menu.tsx` (desktop sidebar, near the bottom before logout).

### Step 5: Update All Internal Links

Replace all `next/link` imports in components with the i18n-aware link:
```tsx
// Before
import Link from 'next/link';
// After
import { Link } from '@/i18n/navigation';
```

Replace all `usePathname` from `next/navigation` with:
```tsx
import { usePathname } from '@/i18n/navigation';
```

Replace all `useRouter` from `next/navigation` with:
```tsx
import { useRouter } from '@/i18n/navigation';
```

**EXCEPTION**: Keep `next/navigation` in server components and in `client-layout.tsx` where needed for non-locale-aware routing checks.

### Step 6: Export Headers in Tables

The `exportColumns` arrays in table components have `header` strings that also need translation. These are used by ExportButton for Excel export. Update them to use translated strings from `useTranslations`.

### Important Notes

1. ALL client components ('use client') can use `useTranslations()` directly
2. For the `links.ts` file (not a component), store keys instead of labels, then resolve in Menu.tsx using `t(link.labelKey)`
3. The `Title` component receives `title` as a prop — the PARENT component must pass the translated string
4. Similarly, `KPI`, `GlobalKPI`, `BannerKPI` receive `title` as prop — parents must translate
5. Don't forget the Clerk redirect URLs — they need locale prefix now: `/dashboard` → `/${locale}/dashboard`
6. The `html lang="en"` in layouts should become `html lang={locale}`
7. The root `src/app/layout.tsx` should be minimal — just `<html><body>{children}</body></html>`
8. The `src/app/[locale]/layout.tsx` should have the ClerkProvider, NextIntlClientProvider, and the full app shell

### Testing Checklist
- [ ] `npm run build` passes
- [ ] Default locale (en) works on all pages
- [ ] French locale (fr) works on all pages  
- [ ] Language switcher toggles between en/fr
- [ ] All table headers are translated
- [ ] All menu items are translated
- [ ] All KPI titles are translated
- [ ] Navigation tabs are translated
- [ ] Baseline page (multi-step form) is fully translated
- [ ] 404 page is translated
