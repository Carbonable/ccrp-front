'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { clearAgentMessages, createChatMessage, loadAgentMessages, saveAgentMessages } from '@/lib/agent/conversations';
import type { AgentChatMessage, AgentChatResponse } from '@/lib/agent/types';
import { useAgent } from '@/components/agent/AgentProvider';

export default function AgentChatTab() {
  const t = useTranslations('agent.chat');
  const { buildRuntimeContext, setActiveTab } = useAgent();
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
      const assistantMessage = createChatMessage('assistant', data.answer);
      setMessages((current) => [...current, assistantMessage]);

      if (data.reportRecommended) {
        setTimeout(() => setActiveTab('report'), 300);
      }
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
