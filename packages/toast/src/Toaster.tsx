'use client';

import { cx } from '@pixel-ui/core';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@pixel-ui/pixel-icons';
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
  const visible = all.slice(-max);

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
        {visible.map((t) => (
          <ToastItem key={t.id} toast={t} paused={paused} />
        ))}
      </ol>
    </section>
  );
}

function ToastItem({ toast: t, paused }: { toast: ToastData; paused: boolean }) {
  const budget = useRef({ version: t.version, left: t.duration });
  const Icon = ICONS[t.tone];
  const timed = Number.isFinite(t.duration);

  useEffect(() => {
    if (budget.current.version !== t.version) {
      budget.current = { version: t.version, left: t.duration };
    }
    if (!timed || paused) return;
    const started = performance.now();
    const timer = setTimeout(() => toast.dismiss(t.id), budget.current.left);
    return () => {
      clearTimeout(timer);
      budget.current.left -= performance.now() - started;
    };
  }, [paused, timed, t.id, t.version, t.duration]);

  return (
    <li
      className="pxl-toast"
      data-tone={t.tone}
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
