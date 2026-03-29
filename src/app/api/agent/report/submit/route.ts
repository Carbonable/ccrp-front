import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBaatonIssue, sanitizeRuntimeContext, sanitizeScreenshot } from '@/lib/agent/server';
import type { AgentScreenshotPayload, AgentTicketDraft, AgentTrustedUserContext } from '@/lib/agent/types';

const submitSchema = z.object({
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
  draft: z.object({
    title: z.string().min(3).max(200),
    summary: z.string().min(3).max(4000),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    issueType: z.enum(['bug', 'feature', 'improvement', 'question']),
    tags: z.array(z.string()).max(20),
    descriptionMarkdown: z.string().min(10).max(40000),
    reproductionSteps: z.array(z.string()).max(10),
    expectedBehavior: z.string().max(4000),
    observedBehavior: z.string().max(4000),
    baatonPayloadPreview: z.object({
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
      issue_type: z.enum(['bug', 'feature', 'improvement', 'question']),
      status: z.string(),
      tags: z.array(z.string()),
    }),
  }),
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
  const parsed = submitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trusted = buildTrustedUserContext(user, await auth());
  const draft = parsed.data.draft as AgentTicketDraft;
  const screenshot = sanitizeScreenshot(parsed.data.screenshot) as AgentScreenshotPayload | null;

  try {
    const issue = await createBaatonIssue({
      draft,
      runtimeContext: sanitizeRuntimeContext(parsed.data.runtimeContext),
      trusted,
      message: parsed.data.message,
      screenshot,
    });

    return NextResponse.json({
      issueId: issue?.id,
      displayId: issue?.display_id,
      url: issue?.url || issue?.html_url,
      message: 'Ticket created',
      issue,
    });
  } catch (error) {
    console.error('CCPM agent report submit failed', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : 'Unable to create the issue right now. Please retry in a moment.',
      },
      { status: 500 },
    );
  }
}
