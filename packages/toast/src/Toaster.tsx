'use client';

import { cx, useIsomorphicLayoutEffect, usePresence } from '@pablo-v/core';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { getServerSnapshot, getSnapshot, subscribe, type ToastData, toast } from './store.js';

const ICONS = {
  default: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: ErrorIcon,
};

const CELLS = 12;

interface Shown {
  toast: ToastData;
  leaving: boolean;
}

function reconcile(shown: Shown[], visible: ToastData[]): Shown[] {
  const next = new Map(visible.map((t) => [t.id, t]));
  const kept = shown.map(({ toast: t }) => {
    const current = next.get(t.id);
    next.delete(t.id);
    return current ? { toast: current, leaving: false } : { toast: t, leaving: true };
  });
  return [...kept, ...[...next.values()].map((t) => ({ toast: t, leaving: false }))];
}

export interface ToasterProps extends ComponentPropsWithRef<'section'> {
  /** @default 'bottom-right' */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** Most toasts visible at once; older ones wait. @default 3 */
  max?: number;
  /** @default 'Notifications' */
  label?: string;
}

/** Mount once near the root. Renders toasts sent with `toast()`. */
export function Toaster({
  position = 'bottom-right',
  max = 3,
  label = 'Notifications',
  className,
  ...rest
}: ToasterProps) {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [paused, setPaused] = useState(false);
  const [shown, setShown] = useState<Shown[]>(() => reconcile([], all.slice(-max)));
  const [synced, setSynced] = useState({ all, max });
  if (synced.all !== all || synced.max !== max) {
    setSynced({ all, max });
    setShown(reconcile(shown, all.slice(-max)));
  }
  const remove = (id: string) =>
    setShown((current) => current.filter((s) => !(s.leaving && s.toast.id === id)));

  return (
    <section
      aria-label={label}
      className={cx('pxl-toaster', className)}
      data-position={position}
      data-paused={paused || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      {...rest}
    >
      <ol className="pxl-toaster__list" aria-live="polite" aria-relevant="additions text">
        {shown.map(({ toast: t, leaving }) => (
          <ToastItem key={t.id} toast={t} paused={paused} leaving={leaving} onExited={remove} />
        ))}
      </ol>
    </section>
  );
}

function ToastItem({
  toast: t,
  paused,
  leaving,
  onExited,
}: {
  toast: ToastData;
  paused: boolean;
  leaving: boolean;
  onExited: (id: string) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const budget = useRef({ version: t.version, left: t.duration });
  const Icon = ICONS[t.tone];
  const timed = Number.isFinite(t.duration);

  // The exit collapses the toast's own height so the rest of the stack slides into place.
  useIsomorphicLayoutEffect(() => {
    if (leaving) ref.current?.style.setProperty('--_h', `${ref.current.offsetHeight}px`);
  }, [leaving]);
  const mounted = usePresence(!leaving, ref);
  useEffect(() => {
    if (!mounted) onExited(t.id);
  }, [mounted, onExited, t.id]);

  useEffect(() => {
    if (budget.current.version !== t.version) {
      budget.current = { version: t.version, left: t.duration };
    }
    if (!timed || paused || leaving) return;
    const started = performance.now();
    const timer = setTimeout(() => toast.dismiss(t.id), budget.current.left);
    return () => {
      clearTimeout(timer);
      budget.current.left -= performance.now() - started;
    };
  }, [paused, leaving, timed, t.id, t.version, t.duration]);

  if (!mounted) return null;

  return (
    <li
      ref={ref}
      className="pxl-toast"
      data-tone={t.tone}
      data-closing={leaving || undefined}
      inert={leaving || undefined}
      style={{ '--_duration': `${t.duration}ms`, '--_cells': CELLS } as CSSProperties}
    >
      <Icon className="pxl-toast__icon" />
      <div className="pxl-toast__content">
        <p className="pxl-toast__title">{t.title}</p>
        {t.description != null && <p className="pxl-toast__description">{t.description}</p>}
      </div>
      {t.action && (
        <button
          type="button"
          className="pxl-toast__action"
          onClick={() => {
            t.action?.onClick();
            toast.dismiss(t.id);
          }}
        >
          {t.action.label}
        </button>
      )}
      <button
        type="button"
        className="pxl-toast__close"
        aria-label="Dismiss notification"
        onClick={() => toast.dismiss(t.id)}
      >
        <CloseIcon />
      </button>
      {timed && (
        <span key={t.version} className="pxl-toast__timer" aria-hidden="true">
          {Array.from({ length: CELLS }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable cells
              key={i}
              className="pxl-toast__cell"
              style={{ '--_i': CELLS - 1 - i } as CSSProperties}
            />
          ))}
        </span>
      )}
    </li>
  );
}
