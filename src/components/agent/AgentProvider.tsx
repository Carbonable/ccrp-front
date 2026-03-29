'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type {
  AgentActionLog,
  AgentApiError,
  AgentConsoleError,
  AgentRuntimeContext,
  AgentSelectedEntities,
  AgentTab,
} from '@/lib/agent/types';

interface AgentContextValue {
  isOpen: boolean;
  activeTab: AgentTab;
  openPanel: (tab?: AgentTab) => void;
  closePanel: () => void;
  setActiveTab: (tab: AgentTab) => void;
  buildRuntimeContext: () => AgentRuntimeContext;
  selectedEntities: AgentSelectedEntities;
  registerEntities: (entities: Partial<AgentSelectedEntities>) => void;
  resetEntities: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

const MAX_ACTIONS = 8;
const MAX_ERRORS = 5;

function keepLatest<T>(items: T[], max: number) {
  return items.slice(-max);
}

function extractLabel(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null;

  const explicit =
    target.getAttribute('data-agent-label') ||
    target.getAttribute('aria-label') ||
    target.getAttribute('title');

  if (explicit) return explicit.trim().slice(0, 160);

  const clickable = target.closest('button, a, [role="button"], input, textarea, select');
  if (!(clickable instanceof HTMLElement)) return null;

  const text = clickable.innerText || clickable.textContent || clickable.getAttribute('name');
  return text?.trim().slice(0, 160) || clickable.tagName.toLowerCase();
}

function deriveEntities(pathname: string, query: URLSearchParams): AgentSelectedEntities {
  const entities: AgentSelectedEntities = {};
  const parts = pathname.split('/').filter(Boolean);
  const projectIndex = parts.indexOf('projects');

  if (projectIndex >= 0 && parts[projectIndex + 1]) {
    entities.projectSlug = parts[projectIndex + 1];
  }

  for (const key of [
    'projectId',
    'projectSlug',
    'projectName',
    'businessUnitId',
    'businessUnitName',
    'companyId',
    'companyName',
    'allocationId',
  ]) {
    const value = query.get(key);
    if (value) {
      entities[key] = value;
    }
  }

  return entities;
}

export function AgentProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AgentTab>('ask');
  const [selectedEntities, setSelectedEntities] = useState<AgentSelectedEntities>({});
  const actionsRef = useRef<AgentActionLog[]>([]);
  const apiErrorsRef = useRef<AgentApiError[]>([]);
  const consoleErrorsRef = useRef<AgentConsoleError[]>([]);

  const pushAction = useCallback((entry: AgentActionLog) => {
    actionsRef.current = keepLatest([...actionsRef.current, entry], MAX_ACTIONS);
  }, []);

  const pushApiError = useCallback((entry: AgentApiError) => {
    apiErrorsRef.current = keepLatest([...apiErrorsRef.current, entry], MAX_ERRORS);
  }, []);

  const pushConsoleError = useCallback((entry: AgentConsoleError) => {
    consoleErrorsRef.current = keepLatest([...consoleErrorsRef.current, entry], MAX_ERRORS);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(searchParams?.toString() || '');
    setSelectedEntities((current) => ({
      ...deriveEntities(pathname, query),
      ...current,
    }));

    pushAction({
      kind: 'navigation',
      label: `${pathname}${query.toString() ? `?${query.toString()}` : ''}`,
      at: new Date().toISOString(),
    });
  }, [pathname, pushAction, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const label = extractLabel(event.target);
      if (!label) return;
      pushAction({ kind: 'click', label, at: new Date().toISOString() });
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pushAction]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const request = args[0];
      const input = typeof request === 'string' ? request : request instanceof Request ? request.url : '';
      const method = request instanceof Request ? request.method : 'GET';

      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          pushApiError({
            url: input,
            method,
            status: response.status,
            message: response.statusText || 'Request failed',
            at: new Date().toISOString(),
          });
        }
        return response;
      } catch (error) {
        pushApiError({
          url: input,
          method,
          message: error instanceof Error ? error.message : 'Network error',
          at: new Date().toISOString(),
        });
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [pushApiError]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      pushConsoleError({
        message: event.message,
        source: event.filename,
        at: new Date().toISOString(),
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      pushConsoleError({
        message:
          event.reason instanceof Error
            ? event.reason.message
            : typeof event.reason === 'string'
              ? event.reason
              : 'Unhandled promise rejection',
        at: new Date().toISOString(),
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [pushConsoleError]);

  const openPanel = useCallback((tab: AgentTab = 'ask') => {
    setActiveTab(tab);
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const registerEntities = useCallback((entities: Partial<AgentSelectedEntities>) => {
    setSelectedEntities((current) => ({ ...current, ...entities }));
  }, []);

  const resetEntities = useCallback(() => {
    const query = new URLSearchParams(searchParams?.toString() || '');
    setSelectedEntities(deriveEntities(pathname, query));
  }, [pathname, searchParams]);

  const buildRuntimeContext = useCallback((): AgentRuntimeContext => {
    const query = Object.fromEntries(new URLSearchParams(searchParams?.toString() || '').entries());
    const fullUrl = typeof window === 'undefined' ? pathname : window.location.href;

    return {
      capturedAt: new Date().toISOString(),
      page: {
        pathname,
        fullUrl,
        title: typeof document === 'undefined' ? '' : document.title,
        locale: pathname.split('/').filter(Boolean)[0],
        query,
      },
      viewport: {
        width: typeof window === 'undefined' ? 0 : window.innerWidth,
        height: typeof window === 'undefined' ? 0 : window.innerHeight,
        devicePixelRatio: typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1,
      },
      browser: {
        language: typeof navigator === 'undefined' ? 'unknown' : navigator.language,
        userAgent: typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent,
        platform:
          typeof navigator === 'undefined'
            ? undefined
            : (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
              ?.platform || navigator.platform,
      },
      selectedEntities,
      recentActions: actionsRef.current,
      recentApiErrors: apiErrorsRef.current,
      recentConsoleErrors: consoleErrorsRef.current,
    };
  }, [pathname, searchParams, selectedEntities]);

  const value = useMemo<AgentContextValue>(
    () => ({
      isOpen,
      activeTab,
      openPanel,
      closePanel,
      setActiveTab,
      buildRuntimeContext,
      selectedEntities,
      registerEntities,
      resetEntities,
    }),
    [activeTab, buildRuntimeContext, closePanel, isOpen, openPanel, registerEntities, resetEntities, selectedEntities],
  );

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}
