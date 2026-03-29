export type AgentTab = 'ask' | 'report';

export type AgentReportKind = 'bug' | 'feature' | 'contact';

export interface AgentActionLog {
  label: string;
  at: string;
  kind: 'navigation' | 'click' | 'api' | 'console' | 'system';
}

export interface AgentApiError {
  url: string;
  method: string;
  status?: number;
  message: string;
  at: string;
}

export interface AgentConsoleError {
  message: string;
  source?: string;
  at: string;
}

export interface AgentSelectedEntities {
  projectId?: string;
  projectSlug?: string;
  projectName?: string;
  businessUnitId?: string;
  businessUnitName?: string;
  companyId?: string;
  companyName?: string;
  allocationId?: string;
  [key: string]: string | undefined;
}

export interface AgentRuntimeContext {
  capturedAt: string;
  page: {
    pathname: string;
    fullUrl: string;
    title: string;
    locale?: string;
    query: Record<string, string>;
  };
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  browser: {
    language: string;
    userAgent: string;
    platform?: string;
  };
  selectedEntities: AgentSelectedEntities;
  recentActions: AgentActionLog[];
  recentApiErrors: AgentApiError[];
  recentConsoleErrors: AgentConsoleError[];
}

export interface AgentScreenshotPayload {
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  capturedAt: string;
}

export interface AgentTrustedUserContext {
  userId: string;
  name: string;
  email: string;
  organizationId?: string | null;
  organizationRole?: string | null;
  roles: string[];
  permissions: string[];
}

export interface AgentChatAction {
  type: 'open_report' | 'new_conversation';
  label?: string;
  kind?: AgentReportKind;
  prefill?: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  actions?: AgentChatAction[];
}

export interface AgentConversationThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AgentChatMessage[];
}

export interface AgentChatResponse {
  answer: string;
  reportRecommended?: boolean;
  actions?: AgentChatAction[];
}

export interface AgentTicketDraft {
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issueType: 'bug' | 'feature' | 'improvement' | 'question';
  tags: string[];
  descriptionMarkdown: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  observedBehavior: string;
  baatonPayloadPreview: {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    issue_type: 'bug' | 'feature' | 'improvement' | 'question';
    status: string;
    tags: string[];
  };
}

export interface AgentDraftRequest {
  message: string;
  runtimeContext: AgentRuntimeContext;
  screenshot?: AgentScreenshotPayload | null;
  reportKind?: AgentReportKind;
}

export interface AgentSubmitResponse {
  issueId?: string;
  displayId?: string;
  url?: string;
  message?: string;
}
