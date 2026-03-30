# CCRP Postgres 17 Upgrade Runbook

## Scope

CCRP lives on the **philoe** Dokploy server (`13.36.6.166`).
This runbook is intentionally separate from the frontend dependency migration.

## Goal

Move CCRP to **Postgres 17** with a rollback path and no in-place destructive upgrade.

## Principles

- Do **not** upgrade the existing production volume in place.
- Create a **new Postgres 17 instance**.
- Validate restore + app boot before cutover.
- Keep old DB untouched until production traffic is stable.

## Pre-flight

1. Verify target server before touching Docker/Dokploy:
   - `ssh carbonalabs`
   - `hostname`
   - `curl -4 ifconfig.me`
2. Identify the current CCRP database service/app in Dokploy.
3. Record:
   - current Postgres image/version
   - database name
   - user
   - mounted volume/path
   - current `DATABASE_URL`
4. Confirm disk headroom for a second database instance + dump.

## Safe Upgrade Plan

### 1) Backup current production DB

Use a logical dump from the current DB:

```bash
pg_dump --format=custom --no-owner --no-privileges \
  --dbname "$CURRENT_DATABASE_URL" \
  --file ccrp-pre-pg17.dump
```

Also capture a plain schema dump for diff/debug:

```bash
pg_dump --schema-only --no-owner --no-privileges \
  --dbname "$CURRENT_DATABASE_URL" \
  --file ccrp-schema-pre-pg17.sql
```

### 2) Create a fresh Postgres 17 service

In Dokploy, provision a **new** Postgres service/container using `postgres:17`.
Do not reuse the old volume.

Prepare:
- new DB host/container name
- new volume
- same app credentials pattern or a freshly generated password
- restricted network exposure (internal only)

### 3) Restore into Postgres 17

```bash
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname "$NEW_DATABASE_URL" \
  ccrp-pre-pg17.dump
```

### 4) Smoke test on the new DB

Run on the restored PG17 instance:

```sql
SELECT version();
SELECT now();
```

Validate critical tables and row counts.
Check app-critical queries and migrations if present.

### 5) App verification against PG17

Point a staging/preview CCRP instance to the new `DATABASE_URL`.
Verify:
- auth flows
- dashboard queries
- business-unit allocation flows
- assistant/report endpoints if they persist anything
- no SQL/runtime errors in logs

### 6) Production cutover

1. Freeze deploys during cutover window.
2. Re-run a final incremental logical dump if needed.
3. Restore latest dump to PG17.
4. Update CCRP production `DATABASE_URL` to the PG17 instance.
5. Redeploy/restart app.
6. Run smoke tests immediately.

### 7) Rollback

If anything fails:
- restore the old `DATABASE_URL`
- redeploy/restart app
- keep PG17 instance for investigation

Do not delete the old DB until production has been stable long enough.

## Validation Checklist

- [ ] Backup created and readable
- [ ] Fresh PG17 instance created
- [ ] Restore completed without fatal errors
- [ ] Row counts checked on key tables
- [ ] CCRP boots against PG17
- [ ] Allocation flows work
- [ ] No auth/session regressions
- [ ] Production cutover tested
- [ ] Rollback path confirmed

## Notes

- If extensions are used, verify extension compatibility before restore.
- If Dokploy exposes managed Postgres upgrade tooling later, still prefer restore-into-new-instance over in-place major upgrade.
- Keep this as a separate maintenance window from frontend stack changes.
