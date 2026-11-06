import type { ReactNode } from 'react';

export type ToastTone = 'default' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  description?: ReactNode;
  /** @default 'default' */
  tone?: ToastTone;
  /** Time on screen in ms; `Infinity` keeps it until dismissed. @default 5000 */
  duration?: number;
  action?: { label: string; onClick: () => void };
  /** Reusing an id replaces that toast instead of stacking a new one. */
  id?: string;
}

export interface ToastData extends Required<Pick<ToastOptions, 'tone' | 'duration'>> {
  id: string;
  /** Changes each time the toast is shown again under the same id. */
  version: number;
  title: ReactNode;
  description?: ReactNode;
  action?: ToastOptions['action'];
}

const EMPTY: ToastData[] = [];
let toasts: ToastData[] = EMPTY;
let seq = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSnapshot = () => toasts;
export const getServerSnapshot = () => EMPTY;

function show(
  title: ReactNode,
  { id, tone = 'default', duration = 5000, ...rest }: ToastOptions = {},
) {
  const key = id ?? `pxl-toast-${++seq}`;
  toasts = [
    ...toasts.filter((t) => t.id !== key),
    { id: key, version: ++seq, title, tone, duration, ...rest },
  ];
  emit();
  return key;
}

/** Shows a notification in the mounted `Toaster`. Returns its id. */
export const toast = Object.assign(show, {
  success: (title: ReactNode, options?: Omit<ToastOptions, 'tone'>) =>
    show(title, { ...options, tone: 'success' }),
  warning: (title: ReactNode, options?: Omit<ToastOptions, 'tone'>) =>
    show(title, { ...options, tone: 'warning' }),
  error: (title: ReactNode, options?: Omit<ToastOptions, 'tone'>) =>
    show(title, { ...options, tone: 'danger' }),
  /** Removes one toast, or all of them without an id. */
  dismiss: (id?: string) => {
    toasts = id == null ? EMPTY : toasts.filter((t) => t.id !== id);
    emit();
  },
});
