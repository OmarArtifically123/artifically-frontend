import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import type { ReactNode } from "react";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  id?: string;
  tone?: ToastTone;
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps extends ToastOptions {
  onDismiss?: () => void;
}

const toneIcon: Record<ToastTone, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  danger: "⛔",
};

export function Toast({
  tone = "info",
  title,
  description,
  action,
  onDismiss,
}: ToastProps) {
  return (
    <div className={cn("ads-toast")} role="status" data-tone={tone}>
      <span aria-hidden>{toneIcon[tone]}</span>
      <div>
        {title ? <p className="ads-heading" style={{ fontSize: "1rem" }}>{title}</p> : null}
        {description ? <p className="ads-text-subtle">{description}</p> : null}
      </div>
      <div className="ads-card__footer">
        {action ? (
          <Button variant="ghost" onClick={action.onClick}>
            {action.label}
          </Button>
        ) : null}
        {onDismiss ? (
          <Button variant="ghost" onClick={onDismiss} aria-label="Dismiss notification">
            ✕
          </Button>
        ) : null}
      </div>
    </div>
  );
}

interface StoredToast extends ToastOptions {
  id: string;
}

type ToastContextValue = {
  toasts: StoredToast[];
  push: (toast: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const listeners = new Set<(value: StoredToast[]) => void>();
let currentToasts: StoredToast[] = [];

function emit(next: StoredToast[]) {
  currentToasts = next;
  listeners.forEach((listener) => listener(next));
}

export function useToastController(): ToastContextValue {
  const [toasts, setToasts] = useState<StoredToast[]>(currentToasts);
  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    emit(currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((toast: ToastOptions) => {
    const id =
      toast.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(16).slice(2));
    const entry: StoredToast = {
      tone: "info",
      duration: 6000,
      ...toast,
      id,
    };
    emit([...currentToasts, entry]);
    if (entry.duration && entry.duration > 0 && typeof window !== "undefined") {
      window.setTimeout(() => dismiss(id), entry.duration);
    }
    return id;
  }, [dismiss]);

  return useMemo(() => ({ toasts, push, dismiss }), [dismiss, push, toasts]);
}

export function ToastStack({ controller }: { controller: ToastContextValue }) {
  const { toasts, dismiss } = controller;
  const latest = useRef(toasts);
  latest.current = toasts;

  return (
    <div className="ads-toast-stack" aria-live="polite" aria-relevant="additions removals">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}