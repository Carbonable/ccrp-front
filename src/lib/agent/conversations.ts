import type {
  AgentChatAction,
  AgentChatMessage,
  AgentChatSource,
  AgentChatSuggestion,
  AgentChatTask,
  AgentConversationThread,
} from '@/lib/agent/types';

const STORAGE_KEY = 'ccpm-agent-conversations-v1';
const MAX_THREADS = 20;
const MAX_MESSAGES_PER_THREAD = 40;

interface AgentConversationState {
  activeThreadId: string | null;
  threads: AgentConversationThread[];
}

type AgentConversationStore = Record<string, AgentConversationState>;

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadStore(): AgentConversationStore {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AgentConversationStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveStore(store: AgentConversationStore) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore quota issues.
  }
}

function deriveThreadTitle(messages: AgentChatMessage[], fallbackTitle: string) {
  const firstUserMessage = messages.find((message) => message.role === 'user' && message.content.trim().length > 0);
  if (!firstUserMessage) return fallbackTitle;

  return firstUserMessage.content.trim().replace(/\s+/g, ' ').slice(0, 72);
}

export function getConversationScope(userId?: string | null) {
  return userId || 'anonymous';
}

export function createConversationThread(title: string): AgentConversationThread {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function loadConversationState(scope: string, fallbackTitle: string): AgentConversationState {
  const store = loadStore();
  const state = store[scope];

  if (!state || !Array.isArray(state.threads) || state.threads.length === 0) {
    const thread = createConversationThread(fallbackTitle);
    return { activeThreadId: thread.id, threads: [thread] };
  }

  const threads = state.threads
    .filter((thread) => thread && typeof thread.id === 'string')
    .map((thread) => ({
      ...thread,
      title: thread.title || fallbackTitle,
      messages: Array.isArray(thread.messages) ? thread.messages.slice(-MAX_MESSAGES_PER_THREAD) : [],
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_THREADS);

  const activeThreadId = threads.some((thread) => thread.id === state.activeThreadId)
    ? state.activeThreadId
    : threads[0]?.id || null;

  return { activeThreadId, threads };
}

export function saveConversationState(scope: string, state: AgentConversationState) {
  const store = loadStore();
  store[scope] = {
    activeThreadId: state.activeThreadId,
    threads: state.threads.slice(0, MAX_THREADS).map((thread) => ({
      ...thread,
      messages: thread.messages.slice(-MAX_MESSAGES_PER_THREAD),
    })),
  };
  saveStore(store);
}

export function deleteConversationThread(
  threads: AgentConversationThread[],
  threadId: string,
  fallbackTitle: string,
): AgentConversationState {
  const filtered = threads.filter((thread) => thread.id !== threadId);

  if (filtered.length === 0) {
    const thread = createConversationThread(fallbackTitle);
    return { activeThreadId: thread.id, threads: [thread] };
  }

  return {
    activeThreadId: filtered[0].id,
    threads: filtered,
  };
}

export function upsertThreadMessages(
  threads: AgentConversationThread[],
  threadId: string,
  messages: AgentChatMessage[],
  fallbackTitle: string,
): AgentConversationThread[] {
  const nextUpdatedAt = new Date().toISOString();
  const threadExists = threads.some((thread) => thread.id === threadId);

  const nextThreads = threadExists
    ? threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              title: deriveThreadTitle(messages, fallbackTitle),
              updatedAt: nextUpdatedAt,
              messages: messages.slice(-MAX_MESSAGES_PER_THREAD),
            }
          : thread,
      )
    : [
        {
          id: threadId,
          title: deriveThreadTitle(messages, fallbackTitle),
          createdAt: nextUpdatedAt,
          updatedAt: nextUpdatedAt,
          messages: messages.slice(-MAX_MESSAGES_PER_THREAD),
        },
        ...threads,
      ];

  return nextThreads
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_THREADS);
}

export function createChatMessage(
  role: AgentChatMessage['role'],
  content: string,
  actions?: AgentChatAction[],
  meta?: {
    reasoning?: string;
    sources?: AgentChatSource[];
    tasks?: AgentChatTask[];
    suggestions?: AgentChatSuggestion[];
  },
): AgentChatMessage {
  return {
    id: createId(),
    role,
    content,
    createdAt: new Date().toISOString(),
    actions,
    reasoning: meta?.reasoning,
    sources: meta?.sources,
    tasks: meta?.tasks,
    suggestions: meta?.suggestions,
  };
}
