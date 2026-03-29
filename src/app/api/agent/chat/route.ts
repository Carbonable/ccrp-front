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

type UserIntent = 'bug' | 'feature' | 'question' | 'general';

function inferUserIntent(message: string): UserIntent {
  const value = message.toLowerCase();

  if (
    /(feature|request|improve|improvement|enhancement|would like|i want|please add|missing|j'aimerais|je voudrais|ça serait bien|ce serait bien|ajouter|améliorer|développer|developper|develop|devleopp)/.test(
      value,
    )
  ) {
    return 'feature';
  }

  if (/(bug|error|erreur|broken|fails?|failure|crash|issue|incident|ne marche pas|bloqu|500|400|404)/.test(value)) {
    return 'bug';
  }

  if (/(how|comment|pourquoi|why|where|can you|peux-tu|help|aide)/.test(value)) {
    return 'question';
  }

  return 'general';
}

function isAgentInternalError(url: string) {
  return url.includes('/api/agent/');
}

function buildSuggestedActions(message: string, shouldReport: boolean, intent: UserIntent): AgentChatAction[] {
  if (intent === 'feature') {
    return [
      { type: 'open_report', label: 'Open feature request', kind: 'feature', prefill: message },
      { type: 'new_conversation', label: 'Start new conversation' },
    ];
  }

  if (intent === 'question' || (!shouldReport && intent === 'general')) {
    return [{ type: 'new_conversation', label: 'Start new conversation' }];
  }

  if (!shouldReport) {
    return [
      { type: 'open_report', label: 'Open feature request', kind: 'feature', prefill: message },
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
  const latestMessageText = latestUserMessage?.content || '';
  const intent = inferUserIntent(latestMessageText);
  const relevantApiErrors = runtimeContext.recentApiErrors.filter((error) => !isAgentInternalError(error.url));
  const relevantConsoleErrors = runtimeContext.recentConsoleErrors;

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
        message: latestMessageText,
        runtimeContext,
        screenshot: null,
        reportKind: intent === 'feature' ? 'feature' : intent === 'question' ? 'contact' : 'bug',
      },
      trusted,
    );

    const shouldReport = intent === 'feature'
      ? true
      : intent === 'bug'
        ? relevantApiErrors.length > 0 || relevantConsoleErrors.length > 0
        : false;

    response = {
      answer: intent === 'feature'
        ? `Understood — this sounds like a product improvement request, not a bug report. I can help you open a feature request prefilled with the current page context so the team can review it.`
        : shouldReport
          ? `This sounds related to a real product issue. I can help you open a report prefilled with the current context so the team can investigate faster.`
          : `I’ll treat the page context as supporting information only. Based on your message, I’d first answer the request itself and only escalate to a report if it is clearly needed.`,
      reportRecommended: shouldReport,
      actions: buildSuggestedActions(latestMessageText, shouldReport, intent),
    };
  } else {
    const shouldReport = intent === 'feature' ? true : Boolean(response.reportRecommended);
    response.reportRecommended = shouldReport;
    response.actions = response.actions && response.actions.length > 0
      ? response.actions
      : buildSuggestedActions(latestMessageText, shouldReport, intent);
  }

  return NextResponse.json(response);
}
