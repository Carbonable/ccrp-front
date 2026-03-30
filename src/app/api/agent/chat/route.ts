import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { CHAT_PROMPT, sanitizeRuntimeContext } from '@/lib/agent/server';
import type { AgentRuntimeContext, AgentTrustedUserContext } from '@/lib/agent/types';

export const maxDuration = 30;

// ── Zod schemas ──────────────────────────────────────────────────────────────

const runtimeContextSchema = z.object({
  capturedAt: z.string().optional(),
  page: z.object({
    pathname: z.string(),
    fullUrl: z.string().optional(),
    title: z.string().optional(),
    locale: z.string().optional(),
    query: z.record(z.string(), z.string()).optional(),
  }),
  viewport: z.object({ width: z.number(), height: z.number(), devicePixelRatio: z.number() }).optional(),
  browser: z.object({ language: z.string(), userAgent: z.string(), platform: z.string().optional() }).optional(),
  selectedEntities: z.record(z.string(), z.string().optional()).optional(),
  recentActions: z.array(z.object({ label: z.string(), at: z.string(), kind: z.string() })).optional(),
  recentApiErrors: z.array(z.object({ url: z.string(), method: z.string(), status: z.number().optional(), message: z.string(), at: z.string() })).optional(),
  recentConsoleErrors: z.array(z.object({ message: z.string(), source: z.string().optional(), at: z.string() })).optional(),
});

const chatSchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
  runtimeContext: runtimeContextSchema.optional(),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildTrustedUserContext(
  user: Awaited<ReturnType<typeof currentUser>>,
  authData: Awaited<ReturnType<typeof auth>>,
): AgentTrustedUserContext {
  const { orgId, orgRole } = authData;
  const roles = Array.isArray(user?.publicMetadata?.roles)
    ? (user.publicMetadata.roles as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];
  const rawPermissions = ((authData as Record<string, unknown>).sessionClaims as Record<string, unknown> | undefined)?.org_permissions;
  const permissions = Array.isArray(rawPermissions)
    ? rawPermissions.filter((v): v is string => typeof v === 'string')
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

function buildSystemPrompt(trusted: AgentTrustedUserContext, runtimeContext?: AgentRuntimeContext): string {
  const contextBlock = runtimeContext
    ? `\n\nCurrent page context (supporting info only — never the primary answer source):\n${JSON.stringify(runtimeContext, null, 2)}`
    : '';

  const userBlock = `\n\nAuthenticated user: ${trusted.name} (${trusted.email}), org role: ${trusted.organizationRole || 'member'}`;

  return CHAT_PROMPT + userBlock + contextBlock;
}

// ── Route handler ────────────────────────────────────────────────────────────

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
  const runtimeContext = parsed.data.runtimeContext
    ? sanitizeRuntimeContext(parsed.data.runtimeContext as AgentRuntimeContext)
    : undefined;

  const modelMessages = await convertToModelMessages(parsed.data.messages);
  const system = buildSystemPrompt(trusted, runtimeContext);

  const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

  const result = streamText({
    model: google(model),
    system,
    messages: modelMessages,
    onError: ({ error }) => {
      console.error('[agent/chat] streamText error:', error);
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
