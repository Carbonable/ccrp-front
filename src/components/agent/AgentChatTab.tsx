'use client';

import { useCallback, useMemo, useState } from 'react';
import { ArrowPathIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { DefaultChatTransport, generateId, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useTranslations } from 'next-intl';
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
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
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
import { Button } from '@/components/ui/button';
import type { AgentRuntimeContext } from '@/lib/agent/types';

function buildStarterSuggestions(runtime: AgentRuntimeContext): string[] {
  const path = runtime.page.pathname || '/';
  const base: string[] = [];

  if (path.includes('/dashboard')) {
    base.push('Explain this dashboard and the key charts.', 'What should I look at first on this dashboard?');
  }

  if (path.includes('/projects')) {
    base.push('Summarize this project and what to verify first.', 'What looks unusual on this project page?');
  }

  base.push('What should I do next on this screen?', 'Open a prefilled report with the current context.');
  return base.slice(0, 4);
}

function ToolCallPart({ part }: { part: { type: string; state: string; toolName: string; input: Record<string, unknown>; output?: unknown } }) {
  const toolName = part.toolName;
  const state = part.state;

  if (toolName === 'create_ticket') {
    if (state === 'input-streaming' || state === 'input-available') {
      const input = part.input as { title?: string; type?: string; severity?: string };
      return (
        <div className="my-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Creating ticket…
          </div>
          {input.title && <div className="mt-1 font-medium text-neutral-200">{input.title}</div>}
          {input.type && <div className="text-xs text-neutral-400">{input.type} · {input.severity}</div>}
        </div>
      );
    }

    if (state === 'output-available') {
      return (
        <div className="my-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Ticket created
          </div>
          <div className="mt-1 text-neutral-300">{String(part.output)}</div>
        </div>
      );
    }

    if (state === 'output-error') {
      return (
        <div className="my-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          Failed to create ticket
        </div>
      );
    }
  }

  // Generic fallback for unknown tools
  return null;
}

function AssistantMessage({ message }: { message: UIMessage }) {
  const t = useTranslations('agent.chat');

  // Collect source-url parts
  const sourceParts = message.parts?.filter(
    (p): p is Extract<typeof p, { type: 'source-url' }> => p.type === 'source-url'
  ) ?? [];

  return (
    <Message from="assistant">
      <MessageContent>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return (
                <MessageResponse key={`${message.id}-${i}`}>
                  {part.text}
                </MessageResponse>
              );
            case 'reasoning':
              return (
                <Reasoning key={`${message.id}-reasoning-${i}`}>
                  <ReasoningTrigger>{t('reasoningTitle')}</ReasoningTrigger>
                  <ReasoningContent>
                    <MessageResponse>{part.text}</MessageResponse>
                  </ReasoningContent>
                </Reasoning>
              );
            default:
              // Handle tool-* parts
              if (part.type.startsWith('tool-')) {
                return <ToolCallPart key={`${message.id}-tool-${i}`} part={part as never} />;
              }
              return null;
          }
        })}

        {sourceParts.length > 0 && (
          <div className="mt-3">
            <Sources>
              <SourcesTrigger count={sourceParts.length}>{t('sourcesTitle')}</SourcesTrigger>
              <SourcesContent>
                {sourceParts.map((source, index) => (
                  <Source
                    key={`${source.sourceId}-${index}`}
                    title={source.title ?? source.sourceId}
                    href={source.url}
                    meta={source.providerMetadata ? String(source.providerMetadata) : undefined}
                  />
                ))}
              </SourcesContent>
            </Sources>
          </div>
        )}
      </MessageContent>
    </Message>
  );
}

export default function AgentChatTab() {
  const t = useTranslations('agent.chat');
  const { buildRuntimeContext, openReport } = useAgent();
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(() => `agent-${generateId()}`);

  const runtimeContext = buildRuntimeContext();
  const starterSuggestions = useMemo(() => buildStarterSuggestions(runtimeContext), [runtimeContext]);

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: '/api/agent/chat',
      body: () => ({
        runtimeContext: buildRuntimeContext(),
      }),
    }),
    [buildRuntimeContext],
  );

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    id: chatId,
    transport,
    experimental_throttle: 50,
    onError: (chatError) => {
      console.error('[agent/chat] useChat error', chatError);
    },
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  const handleSend = useCallback(
    async (message: PromptInputMessage | string) => {
      const text = typeof message === 'string' ? message : message.text;
      const trimmed = text.trim();
      if (!trimmed || isBusy) return;

      clearError();
      setInput('');
      await sendMessage({ text: trimmed });
    },
    [clearError, isBusy, sendMessage],
  );

  const handleReset = useCallback(() => {
    clearError();
    setInput('');
    setChatId(`agent-${generateId()}`);
  }, [clearError]);

  return (
    <PromptInputProvider>
      <div className="flex h-full min-h-0 flex-col">
        <div className="border-b border-neutral-800 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-neutral-100">{t('title')}</div>
              <div className="text-xs text-neutral-400">{t('subtitle')}</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-neutral-800 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <ArrowPathIcon className="mr-2 h-4 w-4" />
              {t('clear')}
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-neutral-800 bg-surface-panel">
            <Conversation className="h-full">
              <ConversationContent>
                {error ? (
                  <div className="mx-4 mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                    <div className="font-medium">Chat request failed.</div>
                    <div className="mt-1 text-red-100/80">
                      The request did not complete. Check auth, backend env, or API route logs.
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearError}
                      className="mt-3 border-red-400/30 bg-transparent text-red-100 hover:bg-red-500/10 hover:text-red-50"
                    >
                      Dismiss
                    </Button>
                  </div>
                ) : null}

                {messages.length === 0 ? (
                  <ConversationEmptyState
                    icon={<ChatBubbleLeftRightIcon className="h-8 w-8" />}
                    title={t('title')}
                    description={t('empty')}
                  >
                    <div className="mt-6 flex w-full flex-col items-center gap-3 px-4">
                      <Suggestions>
                        {starterSuggestions.map((prompt) => (
                          <Suggestion key={prompt} suggestion={prompt} onClick={() => void handleSend(prompt)} />
                        ))}
                      </Suggestions>
                    </div>
                  </ConversationEmptyState>
                ) : (
                  messages.map((message) => {
                    if (message.role === 'user') {
                      return (
                        <Message from="user" key={message.id}>
                          <MessageContent>
                            {message.parts.map((part, index) => (
                              part.type === 'text' ? (
                                <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>
                              ) : null
                            ))}
                          </MessageContent>
                        </Message>
                      );
                    }

                    return <AssistantMessage key={message.id} message={message} />;
                  })
                )}

                {status === 'submitted' && (
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-primary" />
                    Thinking…
                  </div>
                )}
              </ConversationContent>

              {messages.length > 0 ? <ConversationDownload messages={messages} /> : null}
              <ConversationScrollButton />
            </Conversation>
          </div>

          <PromptInput onSubmit={(message) => void handleSend(message)} className="mt-4">
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                placeholder={t('placeholder')}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <div className="text-xs text-neutral-500">{t('contextHint')}</div>
              <PromptInputTools>
                <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} onStop={stop} />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </PromptInputProvider>
  );
}
