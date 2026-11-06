'use client';

import {
  cx,
  useIsomorphicLayoutEffect,
  useMergedRefs,
  usePrefersReducedMotion,
} from '@pablo-v/core';
import { type ComponentPropsWithRef, useCallback, useEffect, useRef, useState } from 'react';

export type ScrambleTrigger = 'mount' | 'hover' | 'inView' | 'manual';

export interface ScrambleTextProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Final text. Changing it re-runs the effect. */
  text: string;
  /** When to play. `manual` only plays when `play` flips to true. @default 'mount' */
  trigger?: ScrambleTrigger;
  /** For `trigger="manual"`. */
  play?: boolean;
  /** Total duration in ms. @default 900 */
  duration?: number;
  /** Glyphs used while scrambling. */
  characters?: string;
  /** Called when the text has fully resolved. */
  onComplete?: () => void;
}

const DEFAULT_CHARS = '█▓▒░<>/\\[]{}=+*^?#_01';
const FRAME_MS = 45;

/**
 * Text that decodes itself from random pixel glyphs, left to right.
 * Screen readers always get the final text; motion is skipped for users who
 * prefer reduced motion.
 */
export function ScrambleText({
  text,
  trigger = 'mount',
  play = false,
  duration = 900,
  characters = DEFAULT_CHARS,
  onComplete,
  className,
  onMouseEnter,
  ref,
  ...rest
}: ScrambleTextProps) {
  const reduced = usePrefersReducedMotion();
  const [output, setOutput] = useState(text);
  const [running, setRunning] = useState(false);
  const frame = useRef(0);
  const localRef = useRef<HTMLSpanElement | null>(null);
  const mergedRef = useMergedRefs(localRef, ref);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (reduced || text.length === 0) {
      setOutput(text);
      onCompleteRef.current?.();
      return;
    }

    // Each character resolves at its own time, roughly left → right with jitter.
    const resolveAt = Array.from(text, (_, i) => {
      const base = (i / Math.max(text.length - 1, 1)) * duration * 0.75;
      return base + Math.random() * duration * 0.25;
    });
    const start = performance.now();
    let lastPaint = 0;
    setRunning(true);

    const tick = (now: number) => {
      const elapsed = now - start;
      if (now - lastPaint >= FRAME_MS || elapsed >= duration) {
        lastPaint = now;
        let next = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i] ?? '';
          next +=
            ch === ' ' || elapsed >= (resolveAt[i] ?? 0)
              ? ch
              : (characters[Math.floor(Math.random() * characters.length)] ?? ch);
        }
        setOutput(next);
      }
      if (elapsed < duration) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setOutput(text);
        setRunning(false);
        onCompleteRef.current?.();
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration, characters, reduced]);

  useIsomorphicLayoutEffect(() => {
    if (trigger === 'mount') run();
    else setOutput(text);
    return () => cancelAnimationFrame(frame.current);
  }, [text, trigger, run]);

  useEffect(() => {
    if (trigger === 'manual' && play) run();
  }, [trigger, play, run]);

  useEffect(() => {
    if (trigger !== 'inView' || !localRef.current || typeof IntersectionObserver === 'undefined')
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(localRef.current);
    return () => observer.disconnect();
  }, [trigger, run]);

  return (
    <span
      ref={mergedRef}
      className={cx('pxl-scramble', className)}
      data-running={running || undefined}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (trigger === 'hover' && !running) run();
      }}
      {...rest}
    >
      <span className="pxl-scramble__sizer" aria-hidden="true">
        {text}
      </span>
      <span className="pxl-scramble__output" aria-hidden="true">
        {output}
      </span>
      <span className="pxl-visually-hidden">{text}</span>
    </span>
  );
}
