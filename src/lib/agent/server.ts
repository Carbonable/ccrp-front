import type {
  AgentDraftRequest,
  AgentReportKind,
  AgentScreenshotPayload,
  AgentTicketDraft,
  AgentTrustedUserContext,
  AgentRuntimeContext,
} from '@/lib/agent/types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

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

export const CHAT_PROMPT = `You are CCPM Agent, embedded in the CCPM sidebar.
Answer briefly but with concrete reasoning. Use the page context, recent actions and recent errors.
If the user sounds blocked or is describing a defect, set reportRecommended=true.
Return strict JSON only:
{
  "answer": string,
  "reportRecommended": boolean
}`;
