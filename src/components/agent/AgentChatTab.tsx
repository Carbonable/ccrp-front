'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import {
  createChatMessage,
  createConversationThread,
  deleteConversationThread,
  getConversationScope,
  loadConversationState,
  saveConversationState,
  upsertThreadMessages,
} from '@/lib/agent/conversations';
import type { AgentChatAction, AgentChatResponse, AgentConversationThread, AgentRuntimeContext } from '@/lib/agent/types';
import { useAgent } from '@/components/agent/AgentProvider';
import SectionCard from '@/components/ai-elements/SectionCard';
import MessageBubble from '@/components/ai-elements/MessageBubble';
import PromptComposer from '@/components/ai-elements/PromptComposer';

function formatBrowser(runtime: AgentRuntimeContext) {
  const platform = runtime.browser.platform || 'Unknown device';
  const language = runtime.browser.language || 'unknown';
  return `${platform} · ${language}`;
}

function getLastMeaningfulAction(runtime: AgentRuntimeContext) {
  return [...runtime.recentActions].reverse().find((entry) => entry.kind === 'click' || entry.kind === 'navigation');
}

function getLastApiCall(runtime: AgentRuntimeContext) {
  return [...runtime.recentActions].reverse().find((entry) => entry.kind === 'api');
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ContextBrief() {
  const t = useTranslations('agent.chat');
  const { user } = useUser();
  const { buildRuntimeContext } = useAgent();
  const runtime = buildRuntimeContext();
  const lastAction = getLastMeaningfulAction(runtime);
  const lastApiCall = getLastApiCall(runtime);
  const lastApiError = [...runtime.recentApiErrors].reverse()[0];

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
      <SectionCard className="p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{t('context.user')}</div>
        <div className="mt-1">{user?.fullName || user?.primaryEmailAddress?.emailAddress || t('context.unknownUser')}</div>
      </SectionCard>
      <SectionCard className="p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{t('context.device')}</div>
        <div className="mt-1">{formatBrowser(runtime)}</div>
      </SectionCard>
      <SectionCard className="p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{t('context.lastAction')}</div>
        <div className="mt-1 line-clamp-2">{lastAction?.label || t('context.none')}</div>
      </SectionCard>
      <SectionCard className="p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{lastApiError ? t('context.lastApiError') : t('context.lastApiCall')}</div>
        <div className="mt-1 line-clamp-2">{lastApiError ? `${lastApiError.method} ${lastApiError.url}` : lastApiCall?.label || t('context.none')}</div>
      </SectionCard>
    </div>
  );
}

function ActionButtons({ actions, onAction }: { actions?: AgentChatAction[]; onAction: (action: AgentChatAction) => void }) {
  const t = useTranslations('agent.chat.actions');

  if (!actions || actions.length === 0) return null;

  const getLabel = (action: AgentChatAction) => {
    if (action.label) return action.label;
    if (action.type === 'new_conversation') return t('newConversation');
    if (action.kind === 'feature') return t('openFeature');
    if (action.kind === 'contact') return t('openContact');
    return t('openBug');
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <button
          key={`${action.type}-${action.kind || 'none'}-${index}`}
          type="button"
          onClick={() => onAction(action)}
          className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition hover:border-primary/60 hover:bg-primary/15"
        >
          {getLabel(action)}
        </button>
      ))}
    </div>
  );
}

function HistoryPanel({
  threads,
  activeThreadId,
  onSelect,
  onDelete,
}: {
  threads: AgentConversationThread[];
  activeThreadId: string | null;
  onSelect: (threadId: string) => void;
  onDelete: (threadId: string) => void;
}) {
  const t = useTranslations('agent.chat.history');

  if (threads.length === 0) {
    return (
      <SectionCard className="mb-4 border-dashed bg-neutral-950/50 text-sm text-neutral-400">
        {t('empty')}
      </SectionCard>
    );
  }

  return (
    <SectionCard className="mb-4 p-3">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        <ClockIcon className="h-4 w-4" />
        {t('title')}
      </div>
      <div className="space-y-2">
        {threads.map((thread) => {
          const active = thread.id === activeThreadId;
          const preview = thread.messages.at(-1)?.content || t('emptyThread');

          return (
            <div
              key={thread.id}
              className={`flex items-start gap-2 rounded-2xl border p-3 transition ${
                active ? 'border-primary/50 bg-primary/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
              }`}
            >
              <button type="button" onClick={() => onSelect(thread.id)} className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-medium text-neutral-100">{thread.title || t('untitled')}</div>
                <div className="mt-1 line-clamp-2 text-xs text-neutral-400">{preview}</div>
                <div className="mt-2 text-[11px] text-neutral-500">{formatTimeLabel(thread.updatedAt)}</div>
              </button>
              {threads.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onDelete(thread.id)}
                  className="rounded-lg border border-neutral-800 p-2 text-neutral-400 transition hover:border-red-500/40 hover:text-red-300"
                  aria-label={t('delete')}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

export default function AgentChatTab() {
  const t = useTranslations('agent.chat');
  const { user, isLoaded } = useUser();
  const { buildRuntimeContext, openReport } = useAgent();
  const [threads, setThreads] = useState<AgentConversationThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const fallbackThreadTitle = t('history.newConversationTitle');
  const scope = getConversationScope(user?.id || user?.primaryEmailAddress?.emailAddress || null);

  useEffect(() => {
    if (!isLoaded) return;

    const state = loadConversationState(scope, fallbackThreadTitle);
    setThreads(state.threads);
    setActiveThreadId(state.activeThreadId);
    setHydrated(true);
  }, [fallbackThreadTitle, isLoaded, scope]);

  useEffect(() => {
    if (!hydrated) return;
    saveConversationState(scope, { threads, activeThreadId });
  }, [activeThreadId, hydrated, scope, threads]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) || threads[0] || null,
    [activeThreadId, threads],
  );

  const messages = activeThread?.messages || [];
  const canSend = input.trim().length > 0 && !loading;

  const assistantHint = useMemo(() => {
    if (messages.length > 0) return null;
    return t('empty');
  }, [messages.length, t]);

  const startNewConversation = () => {
    const nextThread = createConversationThread(fallbackThreadTitle);
    setThreads((current) => [nextThread, ...current].slice(0, 20));
    setActiveThreadId(nextThread.id);
    setInput('');
    setError(null);
    setHistoryOpen(false);
  };

  const handleDeleteThread = (threadId: string) => {
    const nextState = deleteConversationThread(threads, threadId, fallbackThreadTitle);
    setThreads(nextState.threads);
    setActiveThreadId(nextState.activeThreadId);
    setHistoryOpen(false);
  };

  const handleAction = (action: AgentChatAction) => {
    if (action.type === 'new_conversation') {
      startNewConversation();
      return;
    }

    if (action.type === 'open_report') {
      openReport(action.kind || 'bug', action.prefill);
    }
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const threadId = activeThread?.id || createConversationThread(fallbackThreadTitle).id;
    const nextUserMessage = createChatMessage('user', trimmed);
    const nextMessages = [...messages, nextUserMessage];

    setThreads((current) => upsertThreadMessages(current, threadId, nextMessages, fallbackThreadTitle));
    setActiveThreadId(threadId);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          runtimeContext: buildRuntimeContext(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent request failed (${response.status})`);
      }

      const data = (await response.json()) as AgentChatResponse;
      const assistantMessage = createChatMessage('assistant', data.answer, data.actions);
      setThreads((current) => upsertThreadMessages(current, threadId, [...nextMessages, assistantMessage], fallbackThreadTitle));
    } catch {
      setError(t('error'));
      setThreads((current) => upsertThreadMessages(current, threadId, messages, fallbackThreadTitle));
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-800 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-neutral-100">{t('title')}</div>
            <div className="text-xs text-neutral-400">{t('subtitle')}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHistoryOpen((current) => !current)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                historyOpen ? 'border-primary/40 bg-primary/10 text-primary' : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {t('history.button')} {threads.length > 1 ? `(${threads.length})` : ''}
            </button>
            <button
              type="button"
              onClick={startNewConversation}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-300 transition hover:border-neutral-600 hover:text-white"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              {t('clear')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {historyOpen && (
          <HistoryPanel
            threads={threads}
            activeThreadId={activeThread?.id || activeThreadId}
            onSelect={(threadId) => {
              setActiveThreadId(threadId);
              setHistoryOpen(false);
              setError(null);
            }}
            onDelete={handleDeleteThread}
          />
        )}

        <ContextBrief />

        {assistantHint && (
          <SectionCard className="border-dashed bg-neutral-950/60 text-sm text-neutral-400">
            {assistantHint}
          </SectionCard>
        )}

        <div className="space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} role={message.role}>
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === 'assistant' && <ActionButtons actions={message.actions} onAction={handleAction} />}
            </MessageBubble>
          ))}
        </div>
      </div>

      <PromptComposer
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        placeholder={t('placeholder')}
        helperText={t('contextHint')}
        error={error}
        disabled={!canSend}
        loading={loading}
        submitLabel={t('send')}
        loadingLabel={t('thinking')}
      />
    </div>
  );
}
