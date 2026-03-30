'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatBubbleLeftRightIcon, ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useTranslations } from 'next-intl';
import {
  createConversationThread,
  deleteConversationThread,
  getConversationScope,
  loadConversationState,
  saveConversationState,
} from '@/lib/agent/conversations';
import type {
  AgentChatAction,
  AgentChatMessage,
  AgentChatSource,
  AgentChatSuggestion,
  AgentChatTask,
  AgentConversationThread,
  AgentRuntimeContext,
} from '@/lib/agent/types';
import { useAgent } from '@/components/agent/AgentProvider';
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from '@/components/ai-elements/task';
import { TooltipProvider } from '@/components/ui/tooltip';

// ---------------------------------------------------------------------------
// Types for the structured data part the backend sends
// ---------------------------------------------------------------------------

interface AgentMetaData {
  type: 'agent_meta';
  reasoning: string | null;
  sources: AgentChatSource[];
  tasks: AgentChatTask[];
  suggestions: AgentChatSuggestion[];
  actions: AgentChatAction[];
  reportRecommended: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBrowser(runtime: AgentRuntimeContext) {
  return `${runtime.browser.platform || 'Unknown device'} · ${runtime.browser.language || 'unknown'}`;
}

function getLastMeaningfulAction(runtime: AgentRuntimeContext) {
  return [...runtime.recentActions].reverse().find((e) => e.kind === 'click' || e.kind === 'navigation');
}

function getLastApiCall(runtime: AgentRuntimeContext) {
  return [...runtime.recentActions].reverse().find((e) => e.kind === 'api');
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function buildStarterSuggestions(runtime: AgentRuntimeContext): string[] {
  const path = runtime.page.pathname || '/';
  const base: string[] = [];
  if (path.includes('/dashboard')) {
    base.push('Explain this dashboard and the key charts.', 'Why could this chart or KPI look wrong?');
  }
  if (path.includes('/projects')) {
    base.push('Summarize this project and what to verify first.', 'What data is missing on this project page?');
  }
  base.push('What should I do next on this screen?', 'Open a prefilled report with the current context.');
  return base.slice(0, 4);
}

// Extract agent_meta from a UIMessage's data parts
function getMetaFromMessage(msg: UIMessage): AgentMetaData | null {
  for (const part of msg.parts) {
    if (part.type === 'data-agent_meta') {
      const d = (part as { type: string; data: unknown }).data as Record<string, unknown>;
      if (d && typeof d === 'object') return d as unknown as AgentMetaData;
    }
  }
  return null;
}

// Per-message meta: we need to associate a meta snapshot with each assistant message.
// We keep a ref map: messageId -> AgentMetaData, populated when a new assistant message lands.
function getTextFromMessage(msg: UIMessage): string {
  return msg.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
      {[
        [t('context.user'), user?.fullName || user?.primaryEmailAddress?.emailAddress || t('context.unknownUser')],
        [t('context.device'), formatBrowser(runtime)],
        [t('context.lastAction'), lastAction?.label || t('context.none')],
        [lastApiError ? t('context.lastApiError') : t('context.lastApiCall'), lastApiError ? `${lastApiError.method} ${lastApiError.url}` : lastApiCall?.label || t('context.none')],
      ].map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-neutral-800 bg-surface-elevated p-3 text-xs text-neutral-300">
          <div className="font-semibold uppercase tracking-wide text-neutral-500">{label}</div>
          <div className="mt-1 line-clamp-2">{value}</div>
        </div>
      ))}
    </div>
  );
}

function ActionButtons({ actions, onAction }: { actions: AgentChatAction[]; onAction: (a: AgentChatAction) => void }) {
  const t = useTranslations('agent.chat.actions');
  if (!actions.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <button
          key={`${action.type}-${action.kind ?? 'none'}-${i}`}
          type="button"
          onClick={() => onAction(action)}
          className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-white transition hover:border-primary/60 hover:bg-primary/15"
        >
          {action.label || (action.type === 'new_conversation' ? t('newConversation') : action.kind === 'feature' ? t('openFeature') : t('openBug'))}
        </button>
      ))}
    </div>
  );
}

function HistoryPanel({
  threads, activeThreadId, onSelect, onDelete,
}: {
  threads: AgentConversationThread[];
  activeThreadId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('agent.chat.history');
  if (!threads.length) return (
    <div className="mb-4 rounded-2xl border border-dashed border-neutral-800 bg-surface-panel p-4 text-sm text-neutral-400">{t('empty')}</div>
  );

  return (
    <div className="mb-4 rounded-2xl border border-neutral-800 bg-surface-panel p-3">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        <ClockIcon className="h-4 w-4" />{t('title')}
      </div>
      <div className="space-y-2">
        {threads.map((thread) => {
          const active = thread.id === activeThreadId;
          const preview = thread.messages.at(-1)?.content || t('emptyThread');
          return (
            <div key={thread.id} className={`flex items-start gap-2 rounded-2xl border p-3 transition ${active ? 'border-primary/40 bg-primary/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'}`}>
              <button type="button" onClick={() => onSelect(thread.id)} className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm font-medium text-neutral-100">{thread.title || t('untitled')}</div>
                <div className="mt-1 line-clamp-2 text-xs text-neutral-400">{preview}</div>
                <div className="mt-2 text-[11px] text-neutral-500">{formatTimeLabel(thread.updatedAt)}</div>
              </button>
              {threads.length > 1 && (
                <button type="button" onClick={() => onDelete(thread.id)}
                  className="rounded-lg border border-neutral-800 p-2 text-neutral-400 transition hover:border-red-500/40 hover:text-red-300"
                  aria-label={t('delete')}>
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StarterSuggestions({ prompts, onSelect }: { prompts: string[]; onSelect: (p: string) => void }) {
  const t = useTranslations('agent.chat');
  if (!prompts.length) return null;
  return (
    <div className="mt-4 w-full max-w-2xl">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">{t('suggestionsTitle')}</div>
      <Suggestions>
        {prompts.map((p) => <Suggestion key={p} suggestion={p} onClick={onSelect} />)}
      </Suggestions>
    </div>
  );
}

function AssistantMessage({
  msg, meta, onAction, onPrompt,
}: {
  msg: UIMessage;
  meta: AgentMetaData | null;
  onAction: (a: AgentChatAction) => void;
  onPrompt: (p: string) => void;
}) {
  const t = useTranslations('agent.chat');
  const text = getTextFromMessage(msg);

  return (
    <Message from="assistant">
      <MessageContent>
        <MessageResponse>{text}</MessageResponse>

        {meta?.reasoning ? (
          <div className="mt-3">
            <Reasoning>
              <ReasoningTrigger>{t('reasoningTitle')}</ReasoningTrigger>
              <ReasoningContent><MessageResponse>{meta.reasoning}</MessageResponse></ReasoningContent>
            </Reasoning>
          </div>
        ) : null}

        {meta?.tasks && meta.tasks.length > 0 ? (
          <div className="mt-3 space-y-2">
            {meta.tasks.map((task, i) => (
              <Task key={`${task.title}-${i}`} defaultOpen={i === 0}>
                <TaskTrigger title={task.title} status={task.status} />
                <TaskContent>
                  {task.items.map((item, j) => (
                    <TaskItem key={`${task.title}-${j}`} status={item.state}>{item.text}</TaskItem>
                  ))}
                </TaskContent>
              </Task>
            ))}
          </div>
        ) : null}

        {meta?.sources && meta.sources.length > 0 ? (
          <div className="mt-3">
            <Sources>
              <SourcesTrigger count={meta.sources.length}>{t('sourcesTitle')}</SourcesTrigger>
              <SourcesContent>
                {meta.sources.map((src, i) => (
                  <Source key={`${src.title}-${i}`} title={src.title} description={src.description} href={src.href} meta={src.meta || src.type} />
                ))}
              </SourcesContent>
            </Sources>
          </div>
        ) : null}

        {meta?.suggestions && meta.suggestions.length > 0 ? (
          <div className="mt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">{t('suggestionsTitle')}</div>
            <Suggestions>
              {meta.suggestions.map((s) => (
                <Suggestion key={s.prompt} suggestion={s.label} onClick={() => onPrompt(s.prompt)} />
              ))}
            </Suggestions>
          </div>
        ) : null}

        {meta?.actions && meta.actions.length > 0 ? (
          <MessageActions className="mt-3 flex flex-wrap gap-2">
            <ActionButtons actions={meta.actions} onAction={onAction} />
          </MessageActions>
        ) : null}
      </MessageContent>
    </Message>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AgentChatTab() {
  const t = useTranslations('agent.chat');
  const { user, isLoaded } = useUser();
  const { buildRuntimeContext, openReport } = useAgent();

  // Conversation history (localStorage)
  const [threads, setThreads] = useState<AgentConversationThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const fallbackTitle = t('history.newConversationTitle');
  const scope = getConversationScope(user?.id || user?.primaryEmailAddress?.emailAddress || null);

  // Load from storage
  useEffect(() => {
    if (!isLoaded) return;
    const state = loadConversationState(scope, fallbackTitle);
    setThreads(state.threads);
    setActiveThreadId(state.activeThreadId);
    setHydrated(true);
  }, [isLoaded, scope, fallbackTitle]);

  // Per-message meta map: msgId -> AgentMetaData
  const metaMapRef = useRef<Map<string, AgentMetaData>>(new Map());
  const lastMetaRef = useRef<AgentMetaData | null>(null);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) || threads[0] || null,
    [activeThreadId, threads],
  );

  // Seed useChat with existing messages from active thread
  const initialMessages: UIMessage[] = useMemo(() => {
    if (!activeThread) return [];
    return activeThread.messages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: 'text' as const, text: m.content }],
    }));
  }, [activeThread?.id]); // only on thread switch

  const [input, setInput] = useState('');

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/agent/chat',
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
      body: {
        id,
        trigger,
        messageId,
        runtimeContext: buildRuntimeContext(),
        messages: messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: getTextFromMessage(message),
          createdAt: new Date().toISOString(),
        })),
      },
    }),
  }), [buildRuntimeContext]);

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: initialMessages,
    id: activeThreadId ?? undefined,
    onFinish: ({ message: msg }) => {
      // Extract meta from the finished message's data parts
      const meta = getMetaFromMessage(msg);
      if (meta) {
        metaMapRef.current.set(msg.id, meta);
        lastMetaRef.current = meta;
      }

      // Persist to localStorage
      const raw: AgentChatMessage[] = messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: getTextFromMessage(m),
        createdAt: new Date().toISOString(),
      }));
      const finalMessages: AgentChatMessage[] = [
        ...raw,
        {
          id: msg.id,
          role: 'assistant',
          content: getTextFromMessage(msg),
          createdAt: new Date().toISOString(),
        },
      ];
      const threadId = activeThreadId ?? createConversationThread(fallbackTitle).id;
      const updatedAt = new Date().toISOString();
      const firstUser = finalMessages.find((m) => m.role === 'user' && m.content.trim());
      const title = firstUser ? firstUser.content.trim().slice(0, 72) : fallbackTitle;

      setThreads((prev) => {
        const exists = prev.some((t) => t.id === threadId);
        const next = exists
          ? prev.map((t) => t.id === threadId ? { ...t, title, updatedAt, messages: finalMessages.slice(-40) } : t)
          : [{ id: threadId, title, createdAt: updatedAt, updatedAt, messages: finalMessages.slice(-40) }, ...prev];
        const sorted = next.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 20);
        saveConversationState(scope, { activeThreadId: threadId, threads: sorted });
        return sorted;
      });
    },
  });

  // Capture meta from last assistant message as it streams in
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
    if (lastAssistant) {
      const meta = getMetaFromMessage(lastAssistant);
      if (meta) lastMetaRef.current = meta;
    }
  }, [messages]);

  const isStreaming = status === 'streaming' || status === 'submitted';
  const canSend = input.trim().length > 0 && !isStreaming;
  const runtimeContext = buildRuntimeContext();
  const starterSuggestions = useMemo(() => buildStarterSuggestions(runtimeContext), [runtimeContext]);

  const handleAction = useCallback((action: AgentChatAction) => {
    if (action.type === 'new_conversation') {
      const next = createConversationThread(fallbackTitle);
      setThreads((prev) => {
        const updated = [next, ...prev].slice(0, 20);
        saveConversationState(scope, { activeThreadId: next.id, threads: updated });
        return updated;
      });
      setActiveThreadId(next.id);
      return;
    }
    if (action.type === 'open_report') {
      openReport(action.kind ?? 'bug', action.prefill);
    }
  }, [fallbackTitle, openReport, scope]);

  const handleSend = useCallback((text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isStreaming) return;
    sendMessage({ text: trimmed });
    if (!text) setInput('');
  }, [input, isStreaming, sendMessage, buildRuntimeContext, setInput]);

  const startNewConversation = useCallback(() => {
    const next = createConversationThread(fallbackTitle);
    setThreads((prev) => {
      const updated = [next, ...prev].slice(0, 20);
      saveConversationState(scope, { activeThreadId: next.id, threads: updated });
      return updated;
    });
    setActiveThreadId(next.id);
    setHistoryOpen(false);
  }, [fallbackTitle, scope]);

  const handleDeleteThread = useCallback((id: string) => {
    const next = deleteConversationThread(threads, id, fallbackTitle);
    setThreads(next.threads);
    setActiveThreadId(next.activeThreadId);
    saveConversationState(scope, next);
    setHistoryOpen(false);
  }, [threads, fallbackTitle, scope]);

  const downloadableMessages: UIMessage[] = messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts,
  }));

  if (!hydrated) return null;

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-neutral-800 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-neutral-100">{t('title')}</div>
              <div className="text-xs text-neutral-400">{t('subtitle')}</div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setHistoryOpen((v) => !v)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${historyOpen ? 'border-primary/40 bg-primary/10 text-white' : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white'}`}>
                {t('history.button')} {threads.length > 1 ? `(${threads.length})` : ''}
              </button>
              <button type="button" onClick={startNewConversation}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-300 transition hover:border-neutral-600 hover:text-white">
                <PlusIcon className="h-3.5 w-3.5" />
                {t('clear')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
          {historyOpen && (
            <HistoryPanel
              threads={threads}
              activeThreadId={activeThreadId}
              onSelect={(id) => { setActiveThreadId(id); setHistoryOpen(false); }}
              onDelete={handleDeleteThread}
            />
          )}

          <ContextBrief />

          {/* Conversation */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-neutral-800 bg-surface-panel">
            <Conversation>
              {messages.length > 0 ? <ConversationDownload messages={downloadableMessages} /> : null}
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    icon={<ChatBubbleLeftRightIcon className="h-8 w-8" />}
                    title={t('title')}
                    description={t('empty')}
                  >
                    <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center">
                      <div className="text-muted-foreground"><ChatBubbleLeftRightIcon className="h-8 w-8" /></div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">{t('title')}</h3>
                        <p className="text-sm text-muted-foreground">{t('empty')}</p>
                      </div>
                      <StarterSuggestions prompts={starterSuggestions} onSelect={handleSend} />
                    </div>
                  </ConversationEmptyState>
                ) : (
                  <>
                    {messages.map((msg) => {
                      if (msg.role === 'user') {
                        return (
                          <Message key={msg.id} from="user">
                            <MessageContent>
                              <MessageResponse>{getTextFromMessage(msg)}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );
                      }
                      // Assistant: read meta from parts, fallback to ref if still streaming
                      const meta = getMetaFromMessage(msg) ?? metaMapRef.current.get(msg.id) ?? (isStreaming ? lastMetaRef.current : null);
                      return (
                        <AssistantMessage
                          key={msg.id}
                          msg={msg}
                          meta={meta}
                          onAction={handleAction}
                          onPrompt={handleSend}
                        />
                      );
                    })}

                    {isStreaming ? (
                      <Message from="assistant">
                        <MessageContent>
                          <div className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2 text-xs text-neutral-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            {t('loadingAnswer')}
                          </div>
                        </MessageContent>
                      </Message>
                    ) : null}
                  </>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          {/* Composer */}
          <PromptInput
            className="mt-4"
            onSubmit={(msg) => { if (!isStreaming) handleSend(msg.text); }}
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <div className="text-xs text-neutral-500">{t('contextHint')}</div>
              <PromptInputTools>
                <PromptInputSubmit disabled={!canSend} status={isStreaming ? 'submitted' : 'ready'} />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </TooltipProvider>
  );
}
