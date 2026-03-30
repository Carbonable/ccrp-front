# CCRP Front Stack Upgrade Audit — 2026-03-30

## Status

A buildable upgrade branch was produced on `chore/stack-upgrade-audit-20260330`.

## Current branch result

### Upgraded successfully on this branch
- Next.js `16.2.1`
- React `19.2.4`
- React DOM `19.2.4`
- `next-intl` `4.8.3`
- `@clerk/nextjs` `7.0.7`
- `@clerk/themes` `2.4.57`
- `next-sanity` `12.2.1`
- `@apollo/client` `4.1.0`
- `@nextui-org/react` `2.6.11`
- `framer-motion` `12.23.24`
- TypeScript React typings `19.x`
- `eslint-config-next` `16`

### Intentionally NOT upgraded fully in this branch
- Tailwind CSS remains on `3.4.17`
- Postgres remains unchanged in infrastructure (audit only)

## Why Tailwind 4 was not landed

Tailwind 4 was attempted and evaluated, but the current UI layer is still tied to the NextUI plugin/theme chain.

### Confirmed blocker
The current `@nextui-org/theme` integration is not cleanly compatible with a straightforward Tailwind 4 migration in this repo. The migration triggered plugin/style breakage and would require a dedicated UI system migration rather than a safe one-pass dependency bump.

### Practical implication
A real Tailwind 4 migration should be treated as:
1. UI library migration/revalidation (`@nextui-org/*` → newer compatible path, likely HeroUI or equivalent)
2. Tailwind config + CSS migration
3. Visual regression pass across the full app

So this branch lands the highest safe application stack without pretending Tailwind 4 is low-risk.

## Code changes made in this branch

### Next 16 / App Router compatibility
- Migrated App Router `params` handling to Next 16 expectations:
  - server components now `await params`
  - client components now use `use(params)` where appropriate
- Updated localized layout to async server layout using `getMessages()` from `next-intl/server`
- Replaced deprecated `middleware.ts` with `proxy.ts`
- Added `turbopack.root` in `next.config.mjs` to silence incorrect workspace root inference

### next-intl v4 compatibility
- Replaced deprecated navigation helper usage with `createNavigation`
- Simplified `routing.ts`

### Clerk v7 compatibility
- Reworked `client-layout` auth gating to use `useAuth()` instead of removed `SignedIn` / `SignedOut` wrappers

### Apollo Client v4 compatibility
- Moved React hook imports to `@apollo/client/react`
- Added transitional `useQuery<any>(...)` typing in multiple locations to keep the app buildable under stricter Apollo 4 inference
- Removed obsolete `ApolloError` usage and replaced it with generic `Error` typing where needed

### Styling/tooling
- Tailwind kept on `3.4.17`
- PostCSS restored to Tailwind 3-compatible config
- Normalized custom color token naming for safer future migration (`opacity-light`, `opacity-dark`)

## Remaining cleanup after this branch

These are not blockers for merging the branch, but should be cleaned after verification:
- Replace transitional `useQuery<any>` typings with explicit generated GraphQL types
- Audit Clerk sign-in/sign-up redirects in all auth edge cases
- Re-test project pages, dashboard reporting pages, and localized routes manually
- Remove unused deps if any remained after lockfile churn

## Recommended rollout plan

### Phase 1 — mergeable app stack upgrade
- Merge this branch only after manual QA on:
  - auth flows
  - dashboard
  - reporting
  - project pages
  - assistant/report flow
- Deploy as a normal frontend release

### Phase 2 — Tailwind 4 / UI layer migration
Treat as a separate ticket/project:
1. choose UI path (stay on NextUI only if confirmed compatible, otherwise migrate to HeroUI or replacement)
2. migrate Tailwind config/CSS
3. run screenshot regression pass
4. only then ship Tailwind 4

## Postgres audit (no infra change executed)

### Current state
- Current Dokploy Postgres image: `postgres:15`
- Service: `ccrp-db-daw3cv`
- Dokploy Postgres service ID: `Nr2_0x9xDbEZERN6WOh3p`

### Recommended Postgres target
- Target: Postgres `17`

### Safe upgrade plan
1. **Freeze window**
   - pick maintenance window
   - stop writes from CCRP app/jobs if any
2. **Logical backup**
   - `pg_dumpall` or per-db `pg_dump` backup
   - verify restore on disposable Postgres 17 instance
3. **Schema/app compatibility check**
   - validate extensions used
   - run app against restored PG17 clone
4. **Cutover strategy**
   - preferred: create new PG17 instance, restore backup, swap `DATABASE_URL`
   - avoid in-place major upgrade on the only prod instance unless absolutely necessary
5. **Rollback**
   - keep old PG15 instance untouched until app is validated on PG17
   - rollback = restore old `DATABASE_URL`

### Why not execute now
Postgres major upgrade is infra-risky and should not be chained blindly with a frontend dependency migration.

## Bottom line

### Safe to do now
- Next 16
- React 19
- next-intl 4
- Clerk 7
- Apollo 4
- next-sanity 12

### Separate project required
- Tailwind 4
- Postgres 17
