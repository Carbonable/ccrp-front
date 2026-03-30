import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage, UI_MESSAGE_STREAM_HEADERS } from 'ai';
import { z } from 'zod';
import {
  enrichChatResponse,
  callGeminiJson,
  CHAT_PROMPT,
  sanitizeRuntimeContext,
} from '@/lib/agent/server';
import type { AgentChatAction, AgentChatResponse, AgentRuntimeContext, AgentTrustedUserContext } from '@/lib/agent/types';

export const maxDuration = 30;

type UserIntent = 'bug' | 'feature' | 'question' | 'general';

function inferUserIntent(message: string): UserIntent {
  const value = message.toLowerCase();
  if (/(feature|request|improve|improvement|enhancement|would like|i want|please add|missing|j'aimerais|je voudrais|ça serait bien|ajouter|améliorer)/.test(value)) return 'feature';
  if (/(bug|error|erreur|broken|fails?|failure|crash|issue|incident|ne marche pas|bloqu|500|400|404)/.test(value)) return 'bug';
  if (/(how|comment|pourquoi|why|where|can you|peux-tu|help|aide)/.test(value)) return 'question';
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

const runtimeContextSchema = z.object({
  capturedAt: z.string(),
  page: z.object({
    pathname: z.string(),
    fullUrl: z.string(),
    title: z.string(),
    locale: z.string().optional(),
    query: z.record(z.string(), z.string()),
  }),
  viewport: z.object({ width: z.number(), height: z.number(), devicePixelRatio: z.number() }),
  browser: z.object({ language: z.string(), userAgent: z.string(), platform: z.string().optional() }),
  selectedEntities: z.record(z.string(), z.string().optional()),
  recentActions: z.array(z.object({ label: z.string(), at: z.string(), kind: z.enum(['navigation', 'click', 'api', 'console', 'system']) })),
  recentApiErrors: z.array(z.object({ url: z.string(), method: z.string(), status: z.number().optional(), message: z.string(), at: z.string() })),
  recentConsoleErrors: z.array(z.object({ message: z.string(), source: z.string().optional(), at: z.string() })),
});

const chatSchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
  runtimeContext: runtimeContextSchema,
});

function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim();
}

function toLegacyMessages(messages: UIMessage[]) {
  return messages
    .map((message) => ({
      id: message.id,
      role: message.role,
      content: getTextFromMessage(message),
      createdAt: new Date().toISOString(),
    }))
    .filter((message) => message.content.length > 0);
}

function buildTrustedUserContext(
  user: Awaited<ReturnType<typeof currentUser>>,
  authData: Awaited<ReturnType<typeof auth>>,
): AgentTrustedUserContext {
  const { orgId, orgRole } = authData;
  const roles = Array.isArray(user?.publicMetadata?.roles)
    ? (user.publicMetadata.roles as unknown[]).filter((value): value is string => typeof value === 'string')
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
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }

  const trusted = buildTrustedUserContext(user, await auth());
  const runtimeContext = sanitizeRuntimeContext(parsed.data.runtimeContext as AgentRuntimeContext);
  const messages = toLegacyMessages(parsed.data.messages);
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  const latestMessageText = latestUserMessage?.content || '';
  const intent = inferUserIntent(latestMessageText);
  const relevantApiErrors = runtimeContext.recentApiErrors.filter((error) => !isAgentInternalError(error.url));
  const relevantConsoleErrors = runtimeContext.recentConsoleErrors;

  let raw: AgentChatResponse | null = null;
  let geminiFailed = false;

  try {
    raw = await callGeminiJson<AgentChatResponse>(CHAT_PROMPT, {
      trustedUserContext: trusted,
      runtimeContext,
      messages: messages.slice(-10),
    });
  } catch (error) {
    geminiFailed = true;
    console.error('[agent/chat] Gemini request failed', error);
    raw = null;
  }

  if (!raw) {
    const shouldReport = intent === 'feature'
      ? true
      : intent === 'bug'
        ? relevantApiErrors.length > 0 || relevantConsoleErrors.length > 0
        : false;

    raw = {
      answer: geminiFailed
        ? "I couldn't reach the AI backend right now, so I'm showing a safe fallback instead of a real page analysis. Try again in a moment."
        : intent === 'feature'
          ? 'Understood — this sounds like a product improvement request. I can open a feature request prefilled with the current page context.'
          : shouldReport
            ? 'This looks like a real product issue. I can open a report prefilled with the current context so the team can investigate faster.'
            : 'I have limited structured context for this page. I can still help, but I may need richer page signals to explain the charts precisely.',
      reasoning: geminiFailed
        ? 'Gemini did not return a valid response. Falling back to offline product-help mode.'
        : undefined,
      reportRecommended: shouldReport,
      actions: buildSuggestedActions(latestMessageText, shouldReport, intent),
    };
  }

  const shouldReport = intent === 'feature' ? true : Boolean(raw.reportRecommended);
  const enriched = enrichChatResponse({
    response: {
      ...raw,
      actions: raw.actions?.length ? raw.actions : buildSuggestedActions(latestMessageText, shouldReport, intent),
    },
    message: latestMessageText,
    intent,
    shouldReport,
    runtimeContext,
  });

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const textId = `text-${Date.now()}`;
      writer.write({ type: 'start' });
      writer.write({ type: 'text-start', id: textId });
      writer.write({ type: 'text-delta', id: textId, delta: enriched.answer });
      writer.write({ type: 'text-end', id: textId });
      writer.write({
        type: 'data-agent_meta',
        data: {
          reasoning: enriched.reasoning ?? null,
          sources: enriched.sources ?? [],
          tasks: enriched.tasks ?? [],
          suggestions: enriched.suggestions ?? [],
          actions: enriched.actions ?? [],
          reportRecommended: enriched.reportRecommended ?? false,
        },
      });
      writer.write({ type: 'finish' });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    headers: UI_MESSAGE_STREAM_HEADERS,
  });
}
