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
  MessageActions,
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
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from '@/components/ai-elements/task';
import { Button } from '@/components/ui/button';
import type {
  AgentChatAction,
  AgentChatSource,
  AgentChatSuggestion,
  AgentChatTask,
  AgentRuntimeContext,
} from '@/lib/agent/types';

interface AgentMetaData {
  reasoning: string | null;
  sources: AgentChatSource[];
  tasks: AgentChatTask[];
  suggestions: AgentChatSuggestion[];
  actions: AgentChatAction[];
  reportRecommended: boolean;
}

function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

function getMetaFromMessage(message: UIMessage): AgentMetaData | null {
  for (const part of message.parts) {
    if (part.type === 'data-agent_meta') {
      return (part as { data: AgentMetaData }).data;
    }
  }
  return null;
}

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

function ActionButtons({
  actions,
  onAction,
}: {
  actions: AgentChatAction[];
  onAction: (action: AgentChatAction) => void;
}) {
  if (!actions.length) return null;

  return (
    <MessageActions className="mt-3 flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <Button
          key={`${action.type}-${action.kind ?? 'none'}-${index}`}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAction(action)}
          className="border-primary/30 bg-primary/10 text-white hover:bg-primary/15 hover:text-white"
        >
          {action.label}
        </Button>
      ))}
    </MessageActions>
  );
}

function AssistantMessage({
  message,
  onAction,
  onSuggestion,
}: {
  message: UIMessage;
  onAction: (action: AgentChatAction) => void;
  onSuggestion: (prompt: string) => void;
}) {
  const t = useTranslations('agent.chat');
  const text = getTextFromMessage(message);
  const meta = getMetaFromMessage(message);

  return (
    <Message from="assistant">
      <MessageContent>
        {text ? <MessageResponse>{text}</MessageResponse> : null}

        {meta?.reasoning ? (
          <div className="mt-3">
            <Reasoning>
              <ReasoningTrigger>{t('reasoningTitle')}</ReasoningTrigger>
              <ReasoningContent>
                <MessageResponse>{meta.reasoning}</MessageResponse>
              </ReasoningContent>
            </Reasoning>
          </div>
        ) : null}

        {meta?.tasks?.length ? (
          <div className="mt-3 space-y-2">
            {meta.tasks.map((task, taskIndex) => (
              <Task key={`${task.title}-${taskIndex}`} defaultOpen={taskIndex === 0}>
                <TaskTrigger title={task.title} status={task.status} />
                <TaskContent>
                  {task.items.map((item, itemIndex) => (
                    <TaskItem key={`${task.title}-${itemIndex}`} status={item.state}>
                      {item.text}
                    </TaskItem>
                  ))}
                </TaskContent>
              </Task>
            ))}
          </div>
        ) : null}

        {meta?.sources?.length ? (
          <div className="mt-3">
            <Sources>
              <SourcesTrigger count={meta.sources.length}>{t('sourcesTitle')}</SourcesTrigger>
              <SourcesContent>
                {meta.sources.map((source, index) => (
                  <Source
                    key={`${source.title}-${index}`}
                    title={source.title}
                    description={source.description}
                    href={source.href}
                    meta={source.meta || source.type}
                  />
                ))}
              </SourcesContent>
            </Sources>
          </div>
        ) : null}

        {meta?.suggestions?.length ? (
          <div className="mt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {t('suggestionsTitle')}
            </div>
            <Suggestions>
              {meta.suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion.prompt}
                  suggestion={suggestion.label}
                  onClick={() => onSuggestion(suggestion.prompt)}
                />
              ))}
            </Suggestions>
          </div>
        ) : null}

        {meta?.actions?.length ? <ActionButtons actions={meta.actions} onAction={onAction} /> : null}
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

  const handleAction = useCallback(
    (action: AgentChatAction) => {
      if (action.type === 'new_conversation') {
        clearError();
        setInput('');
        setChatId(`agent-${generateId()}`);
        return;
      }

      if (action.type === 'open_report') {
        openReport(action.kind ?? 'bug', action.prefill);
      }
    },
    [clearError, openReport],
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

                    return (
                      <AssistantMessage
                        key={message.id}
                        message={message}
                        onAction={handleAction}
                        onSuggestion={(prompt) => void handleSend(prompt)}
                      />
                    );
                  })
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
