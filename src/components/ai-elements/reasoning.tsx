"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ReasoningContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isStreaming: boolean;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoningContext() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within <Reasoning />");
  }
  return context;
}

export type ReasoningProps = ComponentProps<"div"> & {
  isStreaming?: boolean;
  defaultOpen?: boolean;
};

export const Reasoning = ({
  className,
  children,
  isStreaming = false,
  defaultOpen = false,
  ...props
}: ReasoningProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || isStreaming);

  useEffect(() => {
    if (isStreaming) {
      setIsOpen(true);
    }
  }, [isStreaming]);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, isStreaming }),
    [isOpen, isStreaming]
  );

  return (
    <ReasoningContext.Provider value={value}>
      <div
        className={cn(
          "w-full rounded-2xl border border-primary/15 bg-primary/5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ReasoningContext.Provider>
  );
};

export type ReasoningTriggerProps = Omit<ComponentProps<typeof Button>, "children"> & {
  children?: ReactNode;
  getThinkingMessage?: (isStreaming: boolean) => ReactNode;
};

export const ReasoningTrigger = ({
  className,
  children,
  getThinkingMessage,
  ...props
}: ReasoningTriggerProps) => {
  const { isOpen, setIsOpen, isStreaming } = useReasoningContext();
  const label =
    children ||
    getThinkingMessage?.(isStreaming) ||
    (isStreaming ? "Analyzing current context…" : "Why I answered this way");

  return (
    <Button
      aria-expanded={isOpen}
      className={cn(
        "h-auto w-full justify-between rounded-2xl px-3 py-2 text-left text-xs text-neutral-200 hover:bg-transparent hover:text-white",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      type="button"
      variant="ghost"
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-2 w-2 rounded-full bg-primary/70",
            isStreaming && "animate-pulse"
          )}
        />
        <span>{label}</span>
      </span>
      <ChevronDownIcon
        className={cn("size-4 transition-transform", isOpen && "rotate-180")}
      />
    </Button>
  );
};

export type ReasoningContentProps = ComponentProps<"div">;

export const ReasoningContent = ({
  className,
  children,
  ...props
}: ReasoningContentProps) => {
  const { isOpen } = useReasoningContext();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "border-t border-primary/10 px-3 pb-3 pt-2 text-xs leading-6 text-neutral-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
