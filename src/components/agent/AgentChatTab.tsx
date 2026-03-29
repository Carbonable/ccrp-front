'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { clearAgentMessages, createChatMessage, loadAgentMessages, saveAgentMessages } from '@/lib/agent/conversations';
import type { AgentChatAction, AgentChatMessage, AgentChatResponse, AgentRuntimeContext } from '@/lib/agent/types';
import { useAgent } from '@/components/agent/AgentProvider';

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
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{t('context.user')}</div>
        <div className="mt-1">{user?.fullName || user?.primaryEmailAddress?.emailAddress || t('context.unknownUser')}</div>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{t('context.device')}</div>
        <div className="mt-1">{formatBrowser(runtime)}</div>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{t('context.lastAction')}</div>
        <div className="mt-1 line-clamp-2">{lastAction?.label || t('context.none')}</div>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 text-xs text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-neutral-500">{lastApiError ? t('context.lastApiError') : t('context.lastApiCall')}</div>
        <div className="mt-1 line-clamp-2">{lastApiError ? `${lastApiError.method} ${lastApiError.url}` : lastApiCall?.label || t('context.none')}</div>
      </div>
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

export default function AgentChatTab() {
  const t = useTranslations('agent.chat');
  const { buildRuntimeContext, openReport } = useAgent();
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages(loadAgentMessages());
  }, []);

  useEffect(() => {
    saveAgentMessages(messages);
  }, [messages]);

  const canSend = input.trim().length > 0 && !loading;

  const assistantHint = useMemo(() => {
    if (messages.length > 0) return null;
    return t('empty');
  }, [messages.length, t]);

  const handleAction = (action: AgentChatAction) => {
    if (action.type === 'new_conversation') {
      clearAgentMessages();
      setMessages([]);
      setInput('');
      return;
    }

    if (action.type === 'open_report') {
      openReport(action.kind || 'bug', action.prefill);
    }
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextUserMessage = createChatMessage('user', trimmed);
    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
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
      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setError(t('error'));
      setMessages((current) => current.slice(0, -1));
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-neutral-100">{t('title')}</div>
          <div className="text-xs text-neutral-400">{t('subtitle')}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            clearAgentMessages();
            setMessages([]);
          }}
          className="rounded-lg border border-neutral-800 px-2 py-1 text-xs text-neutral-300 transition hover:border-neutral-600 hover:text-white"
        >
          {t('clear')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ContextBrief />

        {assistantHint && (
          <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
            {assistantHint}
          </div>
        )}

        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === 'assistant'
                  ? 'border border-neutral-800 bg-neutral-950 text-neutral-100'
                  : 'ml-auto bg-primary/15 text-primary'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === 'assistant' && <ActionButtons actions={message.actions} onAction={handleAction} />}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t('placeholder')}
          className="min-h-[110px] w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-primary"
        />

        {error && <div role="alert" className="mt-2 text-xs text-red-400">{error}</div>}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">{t('contextHint')}</div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSend}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t('thinking') : t('send')}
          </button>
        </div>
      </div>
    </div>
  );
}
