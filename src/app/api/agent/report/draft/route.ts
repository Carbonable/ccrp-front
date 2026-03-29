import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  buildFallbackDraft,
  callGeminiJson,
  DRAFT_PROMPT,
  sanitizeRuntimeContext,
  sanitizeScreenshot,
} from '@/lib/agent/server';
import type { AgentDraftRequest, AgentTicketDraft, AgentTrustedUserContext } from '@/lib/agent/types';

const draftRequestSchema = z.object({
  message: z.string().max(4000).default(''),
  runtimeContext: z.object({
    capturedAt: z.string(),
    page: z.object({
      pathname: z.string(),
      fullUrl: z.string(),
      title: z.string(),
      locale: z.string().optional(),
      query: z.record(z.string(), z.string()),
    }),
    viewport: z.object({
      width: z.number(),
      height: z.number(),
      devicePixelRatio: z.number(),
    }),
    browser: z.object({
      language: z.string(),
      userAgent: z.string(),
      platform: z.string().optional(),
    }),
    selectedEntities: z.record(z.string(), z.string().optional()),
    recentActions: z.array(
      z.object({
        label: z.string(),
        at: z.string(),
        kind: z.enum(['navigation', 'click', 'api', 'console', 'system']),
      }),
    ),
    recentApiErrors: z.array(
      z.object({
        url: z.string(),
        method: z.string(),
        status: z.number().optional(),
        message: z.string(),
        at: z.string(),
      }),
    ),
    recentConsoleErrors: z.array(
      z.object({
        message: z.string(),
        source: z.string().optional(),
        at: z.string(),
      }),
    ),
  }),
  screenshot: z
    .object({
      dataUrl: z.string(),
      width: z.number(),
      height: z.number(),
      mimeType: z.string(),
      capturedAt: z.string(),
    })
    .nullable()
    .optional(),
});

function buildTrustedUserContext(
  user: Awaited<ReturnType<typeof currentUser>>,
  authData: Awaited<ReturnType<typeof auth>>,
): AgentTrustedUserContext {
  const { orgId, orgRole } = authData;
  const roles = Array.isArray(user?.publicMetadata?.roles)
    ? user?.publicMetadata?.roles.filter((value): value is string => typeof value === 'string')
    : [];
  const rawPermissions = ((authData as { sessionClaims?: { org_permissions?: unknown; o?: { per?: unknown } } })
    .sessionClaims?.org_permissions ??
    (authData as { sessionClaims?: { org_permissions?: unknown; o?: { per?: unknown } } }).sessionClaims?.o?.per) as unknown;
  const permissions = Array.isArray(rawPermissions)
    ? rawPermissions.filter((value): value is string => typeof value === 'string')
    : [];

  return {
    userId: user?.id || 'anonymous',
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Unknown user',
    email: user?.primaryEmailAddress?.emailAddress || 'unknown@unknown.local',
    organizationId: orgId,
    organizationRole: orgRole,
    roles,
    permissions,
  };
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = draftRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trusted = buildTrustedUserContext(user, await auth());
  const payload: AgentDraftRequest = {
    message: parsed.data.message,
    runtimeContext: sanitizeRuntimeContext(parsed.data.runtimeContext),
    screenshot: sanitizeScreenshot(parsed.data.screenshot),
  };

  let draft: AgentTicketDraft | null = null;

  try {
    draft = await callGeminiJson<AgentTicketDraft>(DRAFT_PROMPT, {
      request: payload,
      trustedUserContext: trusted,
      defaultStatus: process.env.BAATON_DEFAULT_STATUS || 'backlog',
    });
  } catch {
    draft = null;
  }

  if (!draft) {
    draft = buildFallbackDraft(payload, trusted);
  }

  return NextResponse.json({ draft, trusted });
}
