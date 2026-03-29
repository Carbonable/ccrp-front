import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildFallbackDraft, callGeminiJson, CHAT_PROMPT, sanitizeRuntimeContext } from '@/lib/agent/server';
import type { AgentChatAction, AgentChatResponse, AgentTrustedUserContext } from '@/lib/agent/types';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(4000),
      createdAt: z.string(),
    }),
  ),
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

function buildSuggestedActions(message: string, shouldReport: boolean): AgentChatAction[] {
  if (!shouldReport) {
    return [
      { type: 'new_conversation', label: 'Start new conversation' },
    ];
  }

  return [
    { type: 'open_report', label: 'Open bug report', kind: 'bug', prefill: message },
    { type: 'open_report', label: 'Open feature request', kind: 'feature', prefill: message },
    { type: 'new_conversation', label: 'Start new conversation' },
  ];
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trusted = buildTrustedUserContext(user, await auth());
  const runtimeContext = sanitizeRuntimeContext(parsed.data.runtimeContext);
  const latestUserMessage = [...parsed.data.messages].reverse().find((message) => message.role === 'user');

  let response: AgentChatResponse | null = null;

  try {
    response = await callGeminiJson<AgentChatResponse>(CHAT_PROMPT, {
      trustedUserContext: trusted,
      runtimeContext,
      messages: parsed.data.messages.slice(-10),
    });
  } catch {
    response = null;
  }

  if (!response) {
    const fallbackDraft = buildFallbackDraft(
      {
        message: latestUserMessage?.content || '',
        runtimeContext,
        screenshot: null,
      },
      trusted,
    );

    const shouldReport = runtimeContext.recentApiErrors.length > 0 || runtimeContext.recentConsoleErrors.length > 0;

    response = {
      answer: shouldReport
        ? `I can already see recent API failures on this page. The fastest next step is to open a report prefilled with the current context. I would title it “${fallbackDraft.title}” with severity ${fallbackDraft.severity}.`
        : `You are on ${runtimeContext.page.pathname}. Based on the recent actions and your current role (${trusted.roles.join(', ') || trusted.organizationRole || 'unknown'}), I’d validate the last step you clicked before escalating this into a report.`,
      reportRecommended: shouldReport,
      actions: buildSuggestedActions(latestUserMessage?.content || '', shouldReport),
    };
  } else {
    response.actions = response.actions && response.actions.length > 0
      ? response.actions
      : buildSuggestedActions(latestUserMessage?.content || '', Boolean(response.reportRecommended));
  }

  return NextResponse.json(response);
}
