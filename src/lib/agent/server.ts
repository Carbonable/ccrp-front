import type {
  AgentChatResponse,
  AgentChatSource,
  AgentChatSuggestion,
  AgentChatTask,
  AgentDraftRequest,
  AgentReportKind,
  AgentScreenshotPayload,
  AgentTicketDraft,
  AgentTrustedUserContext,
  AgentRuntimeContext,
} from '@/lib/agent/types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function sanitizeList(values: string[], maxItems: number, maxLength: number) {
  return values
    .filter(Boolean)
    .slice(0, maxItems)
    .map((value) => truncate(value, maxLength));
}

export function sanitizeRuntimeContext(input: AgentRuntimeContext): AgentRuntimeContext {
  return {
    capturedAt: input.capturedAt,
    page: {
      pathname: truncate(input.page.pathname || '/', 300),
      fullUrl: truncate(input.page.fullUrl || '/', 500),
      title: truncate(input.page.title || '', 200),
      locale: input.page.locale ? truncate(input.page.locale, 24) : undefined,
      query: Object.fromEntries(
        Object.entries(input.page.query || {})
          .slice(0, 20)
          .map(([key, value]) => [truncate(key, 60), truncate(String(value), 200)]),
      ),
    },
    viewport: {
      width: Number(input.viewport?.width || 0),
      height: Number(input.viewport?.height || 0),
      devicePixelRatio: Number(input.viewport?.devicePixelRatio || 1),
    },
    browser: {
      language: truncate(input.browser?.language || 'unknown', 40),
      userAgent: truncate(input.browser?.userAgent || 'unknown', 300),
      platform: input.browser?.platform ? truncate(input.browser.platform, 80) : undefined,
    },
    selectedEntities: Object.fromEntries(
      Object.entries(input.selectedEntities || {})
        .slice(0, 20)
        .map(([key, value]) => [truncate(key, 60), value ? truncate(String(value), 160) : value]),
    ),
    recentActions: (input.recentActions || []).slice(-8).map((item) => ({
      ...item,
      label: truncate(item.label || '', 180),
    })),
    recentApiErrors: (input.recentApiErrors || []).slice(-5).map((item) => ({
      ...item,
      url: truncate(item.url || '', 300),
      method: truncate(item.method || 'GET', 12),
      message: truncate(item.message || '', 220),
    })),
    recentConsoleErrors: (input.recentConsoleErrors || []).slice(-5).map((item) => ({
      ...item,
      message: truncate(item.message || '', 220),
      source: item.source ? truncate(item.source, 220) : undefined,
    })),
  };
}

export function sanitizeScreenshot(
  screenshot?: AgentScreenshotPayload | null,
): AgentScreenshotPayload | null {
  if (!screenshot?.dataUrl) return null;

  return {
    dataUrl: screenshot.dataUrl,
    width: Number(screenshot.width || 0),
    height: Number(screenshot.height || 0),
    mimeType: truncate(screenshot.mimeType || 'image/jpeg', 80),
    capturedAt: screenshot.capturedAt || new Date().toISOString(),
  };
}

function issueTypeFromKind(kind: AgentReportKind): AgentTicketDraft['issueType'] {
  switch (kind) {
    case 'feature': return 'feature';
    case 'contact': return 'question';
    default: return 'bug';
  }
}

function severityFromContext(request: AgentDraftRequest): AgentTicketDraft['severity'] {
  const apiErrors = request.runtimeContext.recentApiErrors.length;
  const consoleErrors = request.runtimeContext.recentConsoleErrors.length;
  if (apiErrors >= 2 || consoleErrors >= 2) return 'high';
  if (apiErrors === 1 || consoleErrors === 1) return 'medium';
  return 'low';
}

function titleFromMessage(request: AgentDraftRequest) {
  const source = request.message.trim() || request.runtimeContext.page.title || request.runtimeContext.page.pathname;
  const clean = source.replace(/\s+/g, ' ').trim();
  return truncate(clean || 'CCPM issue report', 90);
}

function uniqueTags(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildFallbackDraft(
  request: AgentDraftRequest,
  trusted: AgentTrustedUserContext,
): AgentTicketDraft {
  const kind: AgentReportKind = request.reportKind ?? 'bug';
  const severity = kind === 'feature' || kind === 'contact' ? 'low' : severityFromContext(request);
  const priority = mapSeverityToPriority(severity);
  const issueType = issueTypeFromKind(kind);
  const tags = uniqueTags([
    'ccpm',
    'agent-reported',
    'car-15',
    kind,
    request.runtimeContext.page.pathname.split('/').filter(Boolean)[1] || 'unknown-page',
    request.runtimeContext.selectedEntities.projectSlug || '',
  ]);

  const observedBehavior =
    request.message.trim() ||
    request.runtimeContext.recentApiErrors[0]?.message ||
    'The user opened the agent from the current page to report an issue.';

  const expectedBehavior =
    request.runtimeContext.recentApiErrors.length > 0
      ? 'The action should complete without API errors.'
      : 'The current CCPM workflow should complete successfully.';

  const reproductionSteps = uniqueTags([
    `Open ${request.runtimeContext.page.pathname}`,
    ...request.runtimeContext.recentActions.slice(-3).map((action) => action.label),
  ]).slice(0, 5);

  const descriptionMarkdown = buildTicketDescription({
    draft: {
      summary: truncate(observedBehavior, 220),
      severity,
      tags,
      reproductionSteps,
      expectedBehavior,
      observedBehavior,
    },
    runtimeContext: request.runtimeContext,
    trusted,
    message: request.message,
    screenshot: request.screenshot,
  });

  return {
    title: titleFromMessage(request),
    summary: truncate(observedBehavior, 220),
    severity,
    issueType,
    tags,
    descriptionMarkdown,
    reproductionSteps,
    expectedBehavior,
    observedBehavior,
    baatonPayloadPreview: {
      priority,
      issue_type: issueType,
      status: process.env.BAATON_DEFAULT_STATUS || 'backlog',
      tags,
    },
  };
}

function extractJsonObject(text: string) {
  const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenceMatch?.[1] || text;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    throw new Error('Model did not return JSON.');
  }
  return JSON.parse(candidate.slice(first, last + 1));
}

export async function callGeminiJson<T>(prompt: string, payload: unknown): Promise<T | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${DEFAULT_GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `${prompt}\n\nPayload:\n${JSON.stringify(payload, null, 2)}` }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini error (${response.status})`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  return extractJsonObject(text) as T;
}

export function buildTicketDescription({
  draft,
  runtimeContext,
  trusted,
  message,
  screenshot,
}: {
  draft: Pick<
    AgentTicketDraft,
    'summary' | 'observedBehavior' | 'expectedBehavior' | 'reproductionSteps' | 'severity' | 'tags'
  >;
  runtimeContext: AgentRuntimeContext;
  trusted: AgentTrustedUserContext;
  message: string;
  screenshot?: AgentScreenshotPayload | null;
}) {
  const queryEntries = Object.entries(runtimeContext.page.query || {});
  const entityEntries = Object.entries(runtimeContext.selectedEntities || {}).filter(([, value]) => Boolean(value));

  return [
    '## Summary',
    draft.summary,
    '',
    '## Reported by user',
    message.trim() || 'No free-form message provided. The issue was opened from the CCPM agent sidebar.',
    '',
    '## Observed behavior',
    draft.observedBehavior,
    '',
    '## Expected behavior',
    draft.expectedBehavior,
    '',
    '## Suggested reproduction steps',
    ...(draft.reproductionSteps.length > 0 ? draft.reproductionSteps.map((step, index) => `${index + 1}. ${step}`) : ['1. Open the current CCPM page.']),
    '',
    '## Runtime context',
    `- Path: ${runtimeContext.page.pathname}`,
    `- URL: ${runtimeContext.page.fullUrl}`,
    `- Title: ${runtimeContext.page.title || 'n/a'}`,
    `- Viewport: ${runtimeContext.viewport.width}x${runtimeContext.viewport.height} @ ${runtimeContext.viewport.devicePixelRatio}x`,
    `- Locale: ${runtimeContext.page.locale || 'n/a'}`,
    '',
    '## Reporter context (trusted server-side)',
    `- User: ${trusted.name || 'Unknown'} <${trusted.email || 'unknown'}>`,
    `- User ID: ${trusted.userId}`,
    `- Organization ID: ${trusted.organizationId || 'n/a'}`,
    `- Organization role: ${trusted.organizationRole || 'n/a'}`,
    `- Roles / permissions: ${uniqueTags([...trusted.roles, ...trusted.permissions]).join(', ') || 'n/a'}`,
    '',
    '## Selected entities',
    ...(entityEntries.length > 0
      ? entityEntries.map(([key, value]) => `- ${key}: ${value}`)
      : ['- None detected from path/query/components.']),
    '',
    '## Query params',
    ...(queryEntries.length > 0 ? queryEntries.map(([key, value]) => `- ${key}: ${value}`) : ['- None']),
    '',
    '## Recent user actions',
    ...(runtimeContext.recentActions.length > 0
      ? runtimeContext.recentActions.map((action) => `- ${action.label} (${action.at})`)
      : ['- None captured']),
    '',
    '## Recent API failures',
    ...(runtimeContext.recentApiErrors.length > 0
      ? runtimeContext.recentApiErrors.map(
          (error) => `- [${error.method}] ${error.url} → ${error.status ?? 'ERR'} ${error.message}`,
        )
      : ['- None captured']),
    '',
    '## Recent console errors',
    ...(runtimeContext.recentConsoleErrors.length > 0
      ? runtimeContext.recentConsoleErrors.map((error) => `- ${error.message}`)
      : ['- None captured']),
    '',
    '## Evidence',
    screenshot
      ? `- Screenshot captured at ${screenshot.capturedAt} (${screenshot.width}x${screenshot.height}, ${screenshot.mimeType})`
      : '- No screenshot attached',
    `- Suggested severity: ${draft.severity}`,
    `- Tags: ${draft.tags.join(', ')}`,
  ].join('\n');
}

export function mapSeverityToPriority(
  severity: AgentTicketDraft['severity'],
): AgentTicketDraft['baatonPayloadPreview']['priority'] {
  switch (severity) {
    case 'critical':
      return 'urgent';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
}

async function resolveBaatonProjectId(baseUrl: string, apiKey: string) {
  if (process.env.BAATON_PROJECT_ID) {
    return process.env.BAATON_PROJECT_ID;
  }

  const response = await fetch(`${baseUrl}/projects`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': 'CCPM-Agent/1.0',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to resolve BAATON project automatically. Set BAATON_PROJECT_ID on the server.');
  }

  const payload = (await response.json()) as {
    data?: Array<{ id?: string; slug?: string; name?: string; prefix?: string }>;
  };

  const preferredSlug = process.env.BAATON_PROJECT_SLUG || 'carbonable-ccrp';
  const preferredName = process.env.BAATON_PROJECT_NAME || 'Carbonable - CCRP';

  const match = (payload.data || []).find(
    (project) =>
      project.slug === preferredSlug ||
      project.name === preferredName ||
      project.prefix === 'CAR',
  );

  if (!match?.id) {
    throw new Error('Unable to resolve the Carbonable CCRP Baaton project. Set BAATON_PROJECT_ID on the server.');
  }

  return match.id;
}

export async function createBaatonIssue({
  draft,
  runtimeContext,
  trusted,
  message,
  screenshot,
}: {
  draft: AgentTicketDraft;
  runtimeContext: AgentRuntimeContext;
  trusted: AgentTrustedUserContext;
  message: string;
  screenshot?: AgentScreenshotPayload | null;
}) {
  const apiKey = process.env.BAATON_CARBO_KEY || process.env.BAATON_API_KEY;
  const baseUrl = process.env.BAATON_BASE_URL || 'https://api.baaton.dev/api/v1';

  if (!apiKey) {
    throw new Error('BAATON_CARBO_KEY or BAATON_API_KEY is missing on the server.');
  }

  const projectId = await resolveBaatonProjectId(baseUrl, apiKey);

  const description = draft.descriptionMarkdown.trim()
    ? draft.descriptionMarkdown
    : buildTicketDescription({
        draft,
        runtimeContext,
        trusted,
        message,
        screenshot,
      });

  const response = await fetch(`${baseUrl}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project_id: projectId,
      title: draft.title,
      description,
      type: draft.issueType,
      priority: draft.baatonPayloadPreview.priority || mapSeverityToPriority(draft.severity),
      status: draft.baatonPayloadPreview.status || process.env.BAATON_DEFAULT_STATUS || 'backlog',
      tags: uniqueTags(draft.baatonPayloadPreview.tags.length > 0 ? draft.baatonPayloadPreview.tags : draft.tags),
    }),
  });

  const rawText = await response.text();
  let parsed: any = null;
  try {
    parsed = rawText ? JSON.parse(rawText) : null;
  } catch {
    parsed = { raw: rawText };
  }

  if (!response.ok) {
    throw new Error(parsed?.error || rawText || `Baaton error (${response.status})`);
  }

  return parsed?.data || parsed;
}

export function getDraftPrompt(kind: AgentReportKind): string {
  switch (kind) {
    case 'feature':
      return `You are the CCPM Agent feature-request assistant.
Return strict JSON only with this exact shape:
{
  "title": string,
  "summary": string,
  "severity": "low",
  "issueType": "feature",
  "tags": string[],
  "observedBehavior": string,
  "expectedBehavior": string,
  "reproductionSteps": string[],
  "descriptionMarkdown": string,
  "baatonPayloadPreview": {
    "priority": "low",
    "issue_type": "feature",
    "status": string,
    "tags": string[]
  }
}
Best practices:
- Title: concise description of the desired feature.
- Summary: one-line user story ("As a [role], I want to...").
- observedBehavior: current situation that motivated the request.
- expectedBehavior: the desired outcome in detail.
- reproductionSteps: steps to reproduce the current state or context.
- Tags: include ccpm, agent-reported, feature, and a page/domain hint.
- Do not invent data not present in the payload.`;

    case 'contact':
      return `You are the CCPM Agent support assistant.
Return strict JSON only with this exact shape:
{
  "title": string,
  "summary": string,
  "severity": "low",
  "issueType": "question",
  "tags": string[],
  "observedBehavior": string,
  "expectedBehavior": string,
  "reproductionSteps": string[],
  "descriptionMarkdown": string,
  "baatonPayloadPreview": {
    "priority": "low",
    "issue_type": "question",
    "status": string,
    "tags": string[]
  }
}
Best practices:
- Title: short, clear description of the question or request.
- Summary: what the user needs help with.
- observedBehavior: what the user experienced or is trying to do.
- expectedBehavior: what they need or hope to achieve.
- reproductionSteps: context steps that led to the question.
- Tags: include ccpm, agent-reported, support, and a page hint.
- Do not invent data not present in the payload.`;

    default:
      return DRAFT_PROMPT;
  }
}

export const DRAFT_PROMPT = `You are the CCPM Agent bug triage assistant.
Return strict JSON only with this exact shape:
{
  "title": string,
  "summary": string,
  "severity": "low" | "medium" | "high" | "critical",
  "issueType": "bug" | "feature" | "improvement" | "question",
  "tags": string[],
  "observedBehavior": string,
  "expectedBehavior": string,
  "reproductionSteps": string[],
  "descriptionMarkdown": string,
  "baatonPayloadPreview": {
    "priority": "low" | "medium" | "high" | "urgent",
    "issue_type": "bug" | "feature" | "improvement" | "question",
    "status": string,
    "tags": string[]
  }
}
Best practices to follow:
- Prefer concise, actionable titles.
- Use the user message, screenshot metadata, page, permissions and recent failures.
- Keep description useful for engineers: summary, observed vs expected, steps, runtime context, suspected area.
- Do not invent data not present in the payload.
- If there are recent API or console errors, reflect them.
- Default to issueType=bug unless the payload clearly asks for feature/question.
- Tags should include ccpm, agent-reported, car-15 and a page/feature hint.`;

function createChatSources(runtimeContext: AgentRuntimeContext): AgentChatSource[] {
  const entityEntries = Object.entries(runtimeContext.selectedEntities || {}).filter(([, value]) => Boolean(value));
  const lastAction = [...runtimeContext.recentActions].reverse().find((entry) => entry.kind === 'click' || entry.kind === 'navigation');
  const lastApiError = [...runtimeContext.recentApiErrors].reverse()[0];
  const lastConsoleError = [...runtimeContext.recentConsoleErrors].reverse()[0];

  return [
    {
      type: 'page' as const,
      title: runtimeContext.page.title || runtimeContext.page.pathname || 'Current page',
      href: runtimeContext.page.fullUrl,
      description: runtimeContext.page.pathname,
      meta: `Viewport ${runtimeContext.viewport.width}×${runtimeContext.viewport.height}`,
    },
    ...entityEntries.slice(0, 3).map(([key, value]) => ({
      type: 'entity' as const,
      title: `${key}: ${value}`,
      description: 'Detected from current route / query context',
      meta: 'Selected entity',
    })),
    ...(lastAction
      ? [{
          type: 'action' as const,
          title: lastAction.label,
          description: 'Most recent meaningful user action',
          meta: new Date(lastAction.at).toLocaleString(),
        }]
      : []),
    ...(lastApiError
      ? [{
          type: 'api' as const,
          title: `${lastApiError.method} ${lastApiError.url}`,
          description: lastApiError.message,
          meta: `Latest API error${lastApiError.status ? ` · ${lastApiError.status}` : ''}`,
        }]
      : []),
    ...(lastConsoleError
      ? [{
          type: 'console' as const,
          title: lastConsoleError.message,
          description: lastConsoleError.source,
          meta: 'Latest console error',
        }]
      : []),
  ].slice(0, 5);
}

function createChatReasoning({
  message,
  intent,
  shouldReport,
  runtimeContext,
}: {
  message: string;
  intent: 'bug' | 'feature' | 'question' | 'general';
  shouldReport: boolean;
  runtimeContext: AgentRuntimeContext;
}) {
  const entityLabels = Object.entries(runtimeContext.selectedEntities || {})
    .filter(([, value]) => Boolean(value))
    .slice(0, 3)
    .map(([key, value]) => `- ${key}: ${value}`);
  const latestAction = [...runtimeContext.recentActions].reverse().find((entry) => entry.kind === 'click' || entry.kind === 'navigation');
  const latestApiError = [...runtimeContext.recentApiErrors].reverse()[0];

  return [
    `- User intent detected: **${intent}**`,
    `- Current page: **${runtimeContext.page.title || runtimeContext.page.pathname || 'Unknown page'}**`,
    ...(message.trim() ? [`- Latest user message: ${truncate(message.trim(), 180)}`] : []),
    ...(entityLabels.length > 0 ? ['- Context entities considered:', ...entityLabels] : []),
    ...(latestAction ? [`- Last meaningful action: ${latestAction.label}`] : []),
    ...(latestApiError ? [`- Latest API signal: ${latestApiError.method} ${latestApiError.url} → ${latestApiError.status ?? 'ERR'}`] : []),
    shouldReport
      ? '- Recommended path: keep helping, but offer a prefilled report because the request looks actionable for the product team.'
      : '- Recommended path: answer in-product first, keep report as a fallback only if the user confirms it is a product issue.',
  ].join('\n');
}

function createChatTasks({
  shouldReport,
  intent,
  runtimeContext,
}: {
  shouldReport: boolean;
  intent: 'bug' | 'feature' | 'question' | 'general';
  runtimeContext: AgentRuntimeContext;
}): AgentChatTask[] {
  const tasks: AgentChatTask[] = [
    {
      title: 'Context scan',
      status: 'completed',
      items: [
        { text: `Page captured: ${runtimeContext.page.pathname || '/'}`, state: 'completed' },
        {
          text: runtimeContext.recentApiErrors.length > 0
            ? `${runtimeContext.recentApiErrors.length} recent API error(s) found`
            : 'No recent API errors captured',
          state: 'completed',
        },
        {
          text: Object.keys(runtimeContext.selectedEntities || {}).length > 0
            ? 'Selected entities detected from route/query context'
            : 'No strong entity context detected from route/query',
          state: 'completed',
        },
      ],
    },
  ];

  tasks.push(
    shouldReport
      ? {
          title: intent === 'feature' ? 'Recommended next move: feature request' : 'Recommended next move: report with context',
          status: 'in_progress',
          items: [
            { text: 'Review the suggested answer and confirm it matches the issue', state: 'completed' },
            { text: 'Open a prefilled report with page context attached', state: 'in_progress' },
            { text: 'Add a screenshot only if the issue is visual or layout-related', state: 'pending' },
          ],
        }
      : {
          title: 'Recommended next move: continue in-product help',
          status: 'in_progress',
          items: [
            { text: 'Use the answer to unblock the current workflow first', state: 'completed' },
            { text: 'Ask one follow-up if a metric, filter, or expected behavior is still unclear', state: 'in_progress' },
            { text: 'Escalate to a report only if the problem reproduces consistently', state: 'pending' },
          ],
        },
  );

  return tasks;
}

function createChatSuggestions({
  intent,
  runtimeContext,
}: {
  intent: 'bug' | 'feature' | 'question' | 'general';
  runtimeContext: AgentRuntimeContext;
}): AgentChatSuggestion[] {
  const pathname = runtimeContext.page.pathname || '/';
  const suggestions: AgentChatSuggestion[] = [];

  if (pathname.includes('/dashboard')) {
    suggestions.push(
      { label: 'Explain this dashboard', prompt: 'Explain the current dashboard and what each main block means.' },
      { label: 'Check the selected chart', prompt: 'Explain what the selected chart is showing and what to verify first.' },
    );
  }

  if (pathname.includes('/assistant')) {
    suggestions.push({ label: 'Summarize this conversation', prompt: 'Summarize this conversation into a short action plan.' });
  }

  if (intent === 'feature') {
    suggestions.push({ label: 'Draft the feature clearly', prompt: 'Rewrite this as a concise feature request with user value and expected outcome.' });
  } else {
    suggestions.push({ label: 'Open a report', prompt: 'Open a prefilled report with the current page context.' });
  }

  suggestions.push({ label: 'What should I do next?', prompt: 'What is the fastest next action I should take from this screen?' });

  return suggestions.slice(0, 4);
}

export function enrichChatResponse({
  response,
  message,
  intent,
  shouldReport,
  runtimeContext,
}: {
  response: AgentChatResponse;
  message: string;
  intent: 'bug' | 'feature' | 'question' | 'general';
  shouldReport: boolean;
  runtimeContext: AgentRuntimeContext;
}): AgentChatResponse {
  return {
    ...response,
    reportRecommended: shouldReport,
    reasoning: response.reasoning || createChatReasoning({ message, intent, shouldReport, runtimeContext }),
    sources: response.sources && response.sources.length > 0 ? response.sources : createChatSources(runtimeContext),
    tasks: response.tasks && response.tasks.length > 0 ? response.tasks : createChatTasks({ shouldReport, intent, runtimeContext }),
    suggestions: response.suggestions && response.suggestions.length > 0
      ? response.suggestions
      : createChatSuggestions({ intent, runtimeContext }),
  };
}

export const CHAT_PROMPT = `You are CCPM Agent, embedded in the CCPM product.

Critical behavior rules:
- The user's explicit request always has priority over incidental runtime context.
- Treat page context, selected entities, recent actions, API failures and console errors as supporting evidence only when they are clearly related to what the user asked.
- Never answer primarily from runtime context if the user's question is broader or different.
- Never pretend to know page details that are not present in the payload.
- Do NOT turn the answer into bug triage just because unrelated errors exist in the context.
- Ignore internal assistant/reporting endpoints such as /api/agent/* unless the user is explicitly talking about the assistant or reporting flow itself.
- If the user is asking for an enhancement, missing metric, UX improvement or product change, treat it as a feature request, not a bug.
- If the user is asking a normal product question, answer the question first. Only recommend a report when it is clearly necessary.
- Be concise, concrete, and helpful.

Return strict JSON only:
{
  "answer": string,
  "reportRecommended": boolean
}`;
