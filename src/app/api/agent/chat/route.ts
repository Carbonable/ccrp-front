import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createUIMessageStream, createUIMessageStreamResponse, UI_MESSAGE_STREAM_HEADERS } from 'ai';
import { z } from 'zod';
import {
  enrichChatResponse,
  callGeminiJson,
  CHAT_PROMPT,
  sanitizeRuntimeContext,
} from '@/lib/agent/server';
import type { AgentChatAction, AgentChatResponse, AgentTrustedUserContext } from '@/lib/agent/types';

export const maxDuration = 30;

// ---------------------------------------------------------------------------
// Intent / helpers — kept local to avoid polluting server.ts
// ---------------------------------------------------------------------------

type UserIntent = 'bug' | 'feature' | 'question' | 'general';

function inferUserIntent(message: string): UserIntent {
  const v = message.toLowerCase();
  if (/(feature|request|improve|improvement|enhancement|would like|i want|please add|missing|j'aimerais|je voudrais|ça serait bien|ajouter|améliorer)/.test(v)) return 'feature';
  if (/(bug|error|erreur|broken|fails?|failure|crash|issue|incident|ne marche pas|bloqu|500|400|404)/.test(v)) return 'bug';
  if (/(how|comment|pourquoi|why|where|can you|peux-tu|help|aide)/.test(v)) return 'question';
  return 'general';
}

function isAgentInternalError(url: string) {
  return url.includes('/api/agent/');
}

function buildSuggestedActions(message: string, shouldReport: boolean, intent: UserIntent): AgentChatAction[] {
  if (intent === 'feature') return [
    { type: 'open_report', label: 'Open feature request', kind: 'feature', prefill: message },
    { type: 'new_conversation', label: 'Start new conversation' },
  ];
  if (intent === 'question' || (!shouldReport && intent === 'general')) return [
    { type: 'new_conversation', label: 'Start new conversation' },
  ];
  if (!shouldReport) return [
    { type: 'open_report', label: 'Open feature request', kind: 'feature', prefill: message },
    { type: 'new_conversation', label: 'Start new conversation' },
  ];
  return [
    { type: 'open_report', label: 'Open bug report', kind: 'bug', prefill: message },
    { type: 'open_report', label: 'Open feature request', kind: 'feature', prefill: message },
    { type: 'new_conversation', label: 'Start new conversation' },
  ];
}

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(4000),
    id: z.string().optional(),
    createdAt: z.string().optional(),
  })),
  runtimeContext: z.object({
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
  }),
});

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

function buildTrustedUserContext(
  user: Awaited<ReturnType<typeof currentUser>>,
  authData: Awaited<ReturnType<typeof auth>>,
): AgentTrustedUserContext {
  const { orgId, orgRole } = authData;
  const roles = Array.isArray(user?.publicMetadata?.roles)
    ? (user.publicMetadata.roles as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];
  const rawPerms = ((authData as { sessionClaims?: { org_permissions?: unknown; o?: { per?: unknown } } })
    .sessionClaims?.org_permissions ??
    (authData as { sessionClaims?: { org_permissions?: unknown; o?: { per?: unknown } } }).sessionClaims?.o?.per) as unknown;
  const permissions = Array.isArray(rawPerms) ? rawPerms.filter((v): v is string => typeof v === 'string') : [];

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

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });

  const trusted = buildTrustedUserContext(user, await auth());
  const runtimeContext = sanitizeRuntimeContext(parsed.data.runtimeContext);
  const latestUserMessage = [...parsed.data.messages].reverse().find((m) => m.role === 'user');
  const latestMessageText = latestUserMessage?.content || '';
  const intent = inferUserIntent(latestMessageText);
  const relevantApiErrors = runtimeContext.recentApiErrors.filter((e) => !isAgentInternalError(e.url));
  const relevantConsoleErrors = runtimeContext.recentConsoleErrors;

  // Call Gemini
  let raw: AgentChatResponse | null = null;
  try {
    raw = await callGeminiJson<AgentChatResponse>(CHAT_PROMPT, {
      trustedUserContext: trusted,
      runtimeContext,
      messages: parsed.data.messages.slice(-10),
    });
  } catch {
    raw = null;
  }

  if (!raw) {
    const shouldReport = intent === 'feature' ? true : intent === 'bug' ? relevantApiErrors.length > 0 || relevantConsoleErrors.length > 0 : false;
    raw = {
      answer: intent === 'feature'
        ? 'Understood — this sounds like a product improvement request. I can open a feature request prefilled with the current page context.'
        : shouldReport
          ? 'This looks like a real product issue. I can open a report prefilled with the current context so the team can investigate faster.'
          : "I'll treat the page context as supporting information. Let me answer your request first.",
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

  // Stream the response using AI SDK UIMessage stream
  const textId = 'text-0';

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: 'start' });
      writer.write({ type: 'text-start', id: textId });
      writer.write({ type: 'text-delta', id: textId, delta: enriched.answer });
      writer.write({ type: 'text-end', id: textId });
      // Send structured metadata as a data part
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

  return new Response(stream, { headers: UI_MESSAGE_STREAM_HEADERS });
}
