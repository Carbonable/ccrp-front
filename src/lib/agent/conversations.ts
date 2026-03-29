import type { AgentChatMessage } from '@/lib/agent/types';

const STORAGE_KEY = 'ccpm-agent-chat-v1';

export function loadAgentMessages(): AgentChatMessage[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AgentChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAgentMessages(messages: AgentChatMessage[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  } catch {
    // Ignore storage quota issues.
  }
}

export function clearAgentMessages() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function createChatMessage(
  role: AgentChatMessage['role'],
  content: string,
): AgentChatMessage {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}
