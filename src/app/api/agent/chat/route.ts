import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { streamText, convertToModelMessages, tool, stepCountIs, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { CHAT_PROMPT, sanitizeRuntimeContext, resolveBaatonProjectId } from '@/lib/agent/server';
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
    tools: {
      // Server-side tool: creates a ticket on Baaton when the user reports a bug or requests a feature.
      // The model decides when to call this based on the conversation.
      create_ticket: tool({
        description:
          'Create a bug report or feature request ticket on the project tracker. ' +
          'Use this when the user reports a bug, a broken feature, or explicitly asks for a ticket/report. ' +
          'Do NOT use this for general questions or help requests.',
        inputSchema: z.object({
          title: z.string().describe('Short, descriptive ticket title'),
          description: z.string().describe('Detailed description in markdown with reproduction steps if applicable'),
          type: z.enum(['bug', 'feature']).describe('Whether this is a bug report or feature request'),
          severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity level'),
          tags: z.array(z.string()).describe('Relevant tags like page name, component, etc.'),
        }),
        execute: async ({ title, description, type, severity, tags }) => {
          try {
            const apiKey = process.env.BAATON_CARBO_KEY || process.env.BAATON_API_KEY;
            const baseUrl = process.env.BAATON_BASE_URL || 'https://api.baaton.dev/api/v1';

            if (!apiKey) {
              return 'Ticket system is not configured on this environment (missing BAATON_API_KEY).';
            }

            const priority = severity === 'critical' ? 'urgent' : severity === 'high' ? 'high' : severity === 'medium' ? 'medium' : 'low';

            // Build description with context
            const contextSection = runtimeContext
              ? `\n\n---\n**Page:** ${runtimeContext.page.pathname}\n**User:** ${trusted.name} (${trusted.email})\n**Captured:** ${runtimeContext.capturedAt || new Date().toISOString()}`
              : '';

            const fullDescription = description + contextSection;

            const projectId = await resolveBaatonProjectId(baseUrl, apiKey);

            const response = await fetch(`${baseUrl}/issues`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                project_id: projectId,
                title,
                description: fullDescription,
                type,
                priority,
                status: 'backlog',
                tags: [...tags, 'agent-reported', 'ccpm'],
              }),
            });

            const text = await response.text();
            if (!response.ok) {
              console.error('[agent/chat] Baaton error:', text);
              return `Failed to create ticket (HTTP ${response.status}): ${text.slice(0, 200)}`;
            }

            const parsed = JSON.parse(text);
            const ticketId = parsed?.data?.id || parsed?.data?.slug || parsed?.id || 'created';
            return `✅ Ticket created: ${ticketId} — "${title}" (${type}, ${priority})`;
          } catch (error) {
            console.error('[agent/chat] create_ticket failed:', error);
            return `Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        },
      }),
    },
    stopWhen: stepCountIs(3),
    onError: ({ error }) => {
      console.error('[agent/chat] streamText error:', error);
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
