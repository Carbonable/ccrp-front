"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ExternalLinkIcon, Link2Icon } from "lucide-react";
import type { AnchorHTMLAttributes, ComponentProps } from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface SourcesContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SourcesContext = createContext<SourcesContextValue | null>(null);

function useSourcesContext() {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error("Sources components must be used within <Sources />");
  }
  return context;
}

export type SourcesProps = ComponentProps<"div"> & {
  defaultOpen?: boolean;
};

export const Sources = ({
  className,
  children,
  defaultOpen = false,
  ...props
}: SourcesProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen]);

  return (
    <SourcesContext.Provider value={value}>
      <div
        className={cn(
          "w-full rounded-2xl border border-neutral-800 bg-neutral-950/70",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SourcesContext.Provider>
  );
};

export type SourcesTriggerProps = Omit<ComponentProps<typeof Button>, "children"> & {
  count: number;
  children?: string;
};

export const SourcesTrigger = ({
  count,
  className,
  children,
  ...props
}: SourcesTriggerProps) => {
  const { isOpen, setIsOpen } = useSourcesContext();

  return (
    <Button
      aria-expanded={isOpen}
      className={cn(
        "h-auto w-full justify-between rounded-2xl px-3 py-2 text-left text-xs text-neutral-300 hover:bg-transparent hover:text-white",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      type="button"
      variant="ghost"
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        <Link2Icon className="size-3.5 text-primary" />
        <span>{children || `${count} context signals used`}</span>
      </span>
      <ChevronDownIcon
        className={cn("size-4 transition-transform", isOpen && "rotate-180")}
      />
    </Button>
  );
};

export type SourcesContentProps = ComponentProps<"div">;

export const SourcesContent = ({
  className,
  children,
  ...props
}: SourcesContentProps) => {
  const { isOpen } = useSourcesContext();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "grid gap-2 border-t border-neutral-800 px-3 pb-3 pt-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type SourceProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  title: string;
  description?: string;
  meta?: string;
};

export const Source = ({
  className,
  title,
  description,
  meta,
  href,
  ...props
}: SourceProps) => {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-neutral-100">{title}</div>
          {description ? (
            <div className="mt-1 text-xs leading-5 text-neutral-400">
              {description}
            </div>
          ) : null}
        </div>
        {href ? <ExternalLinkIcon className="mt-0.5 size-3.5 text-neutral-500" /> : null}
      </div>
      {meta ? <div className="mt-2 text-[11px] uppercase tracking-wide text-neutral-500">{meta}</div> : null}
    </>
  );

  if (!href) {
    return (
      <div
        className={cn(
          "rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      className={cn(
        "rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 transition hover:border-primary/30 hover:bg-neutral-900",
        className
      )}
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {content}
    </a>
  );
};
