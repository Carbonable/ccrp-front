"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleDashedIcon,
  LoaderCircleIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface TaskContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("Task components must be used within <Task />");
  }
  return context;
}

export type TaskProps = ComponentProps<"div"> & {
  defaultOpen?: boolean;
};

export const Task = ({
  className,
  children,
  defaultOpen = true,
  ...props
}: TaskProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen]);

  return (
    <TaskContext.Provider value={value}>
      <div
        className={cn(
          "w-full rounded-2xl border border-neutral-800 bg-neutral-950/70",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TaskContext.Provider>
  );
};

function getStatusIcon(status?: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2Icon className="size-4 text-primary" />;
    case "in_progress":
      return <LoaderCircleIcon className="size-4 animate-spin text-primary" />;
    default:
      return <CircleDashedIcon className="size-4 text-neutral-500" />;
  }
}

export type TaskTriggerProps = Omit<ComponentProps<typeof Button>, "children"> & {
  title: string;
  status?: "pending" | "in_progress" | "completed";
};

export const TaskTrigger = ({
  title,
  status = "pending",
  className,
  ...props
}: TaskTriggerProps) => {
  const { isOpen, setIsOpen } = useTaskContext();

  return (
    <Button
      aria-expanded={isOpen}
      className={cn(
        "h-auto w-full justify-between rounded-2xl px-3 py-2 text-left text-sm text-neutral-100 hover:bg-transparent hover:text-white",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      type="button"
      variant="ghost"
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        {getStatusIcon(status)}
        <span>{title}</span>
      </span>
      <ChevronDownIcon
        className={cn("size-4 text-neutral-400 transition-transform", isOpen && "rotate-180")}
      />
    </Button>
  );
};

export type TaskContentProps = ComponentProps<"div">;

export const TaskContent = ({
  className,
  children,
  ...props
}: TaskContentProps) => {
  const { isOpen } = useTaskContext();

  if (!isOpen) return null;

  return (
    <div
      className={cn("grid gap-2 border-t border-neutral-800 px-3 pb-3 pt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export type TaskItemProps = ComponentProps<"div"> & {
  status?: "pending" | "in_progress" | "completed";
};

export const TaskItem = ({
  className,
  children,
  status = "pending",
  ...props
}: TaskItemProps) => (
  <div
    className={cn(
      "flex items-start gap-2 rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-xs leading-5 text-neutral-300",
      className
    )}
    {...props}
  >
    <span className="mt-0.5 shrink-0">{getStatusIcon(status)}</span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

export type TaskItemFileProps = ComponentProps<"div">;

export const TaskItemFile = ({ className, ...props }: TaskItemFileProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-950 px-1.5 py-0.5 text-[11px] text-neutral-300",
      className
    )}
    {...props}
  />
);
