'use client';

import { cx, useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@pablo-v/core';
import { ArrowDownIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
  useRef,
  useState,
} from 'react';

export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error';

export interface LogLine {
  /** Stable key. Falls back to the line index. */
  id?: string | number;
  /** @default 'info' */
  level?: LogLevel;
  text: ReactNode;
  /** Pre-formatted timestamp, so server and client render the same string. */
  time?: string;
}

export interface TerminalProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  lines: readonly LogLine[];
  /** Header label; also names the log region for assistive tech. */
  title?: string;
  /** Trailing header content, e.g. a Badge with the build state. */
  status?: ReactNode;
  /** Shows a blinking block cursor after the last line. */
  streaming?: boolean;
  /** Keep the newest line in view while the reader is at the bottom. @default true */
  follow?: boolean;
  /** @default 320 */
  maxHeight?: CSSProperties['maxHeight'];
  /** Shown when there are no lines and nothing is streaming. */
  placeholder?: ReactNode;
}

const STICKY_SLACK = 24;

/**
 * Streaming log viewer. Follows new output while the reader sits at the
 * bottom; scrolling up pauses it and offers a jump back to the latest line.
 */
export function Terminal({
  lines,
  title,
  status,
  streaming = false,
  follow = true,
  maxHeight = 320,
  placeholder = 'No output yet',
  className,
  style,
  ...rest
}: TerminalProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const stuck = useRef(true);
  const seen = useRef(lines.length);
  const [unseen, setUnseen] = useState(0);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = viewport.current;
    const added = lines.length - seen.current;
    seen.current = lines.length;
    if (!el) return;
    if (follow && stuck.current) {
      el.scrollTop = el.scrollHeight;
      setUnseen(0);
    } else if (added > 0) {
      setUnseen((n) => n + added);
    } else if (added < 0) {
      setUnseen(0);
    }
  }, [lines.length, follow]);

  const jumpToLatest = () => {
    const el = viewport.current;
    if (!el) return;
    stuck.current = true;
    setUnseen(0);
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className={cx('pxl-terminal', className)} style={style} {...rest}>
      {(title || status) && (
        <div className="pxl-terminal__header">
          <span className="pxl-terminal__title">{title}</span>
          {status && <span className="pxl-terminal__status">{status}</span>}
        </div>
      )}
      <div
        ref={viewport}
        className="pxl-terminal__viewport"
        role="log"
        aria-label={title ?? 'Log output'}
        // Scrollable regions must be reachable without a pointer.
        tabIndex={0}
        style={{ maxHeight }}
        onScroll={(event) => {
          const el = event.currentTarget;
          stuck.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICKY_SLACK;
          if (stuck.current) setUnseen(0);
        }}
      >
        {lines.length === 0 && !streaming ? (
          <p className="pxl-terminal__placeholder">{placeholder}</p>
        ) : (
          <ol className="pxl-terminal__lines">
            {lines.map((line, index) => (
              <li
                key={line.id ?? index}
                className="pxl-terminal__line"
                data-level={line.level ?? 'info'}
              >
                {line.time && <time className="pxl-terminal__time">{line.time}</time>}
                <span className="pxl-terminal__text">{line.text}</span>
              </li>
            ))}
            {streaming && (
              <li className="pxl-terminal__line" aria-hidden="true">
                <span className="pxl-terminal__cursor" />
              </li>
            )}
          </ol>
        )}
      </div>
      {unseen > 0 && (
        <button type="button" className="pxl-terminal__jump" onClick={jumpToLatest}>
          <ArrowDownIcon />
          {unseen === 1 ? '1 new line' : `${unseen} new lines`}
        </button>
      )}
    </div>
  );
}
