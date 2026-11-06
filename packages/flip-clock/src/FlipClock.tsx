'use client';

import { cx, usePrefersReducedMotion } from '@pablo-v/core';
import { type ComponentPropsWithRef, useEffect, useState } from 'react';

const FLIP_MS = 600;

function FlipChar({ char }: { char: string }) {
  const reduced = usePrefersReducedMotion();
  const [from, setFrom] = useState(char);

  useEffect(() => {
    if (reduced) return setFrom(char);
    // A timer, not animationend: reduced-motion CSS shortens the animation to 1ms
    // and an interrupted flip must still settle.
    const id = setTimeout(() => setFrom(char), FLIP_MS);
    return () => clearTimeout(id);
  }, [char, reduced]);

  if (!/\d/.test(char)) return <span className="pxl-flip__sep">{char}</span>;

  const flipping = from !== char;
  return (
    <span className="pxl-flip__card" data-flipping={flipping || undefined}>
      <span className="pxl-flip__half" data-half="top">
        <span className="pxl-flip__glyph">{char}</span>
      </span>
      <span className="pxl-flip__half" data-half="bottom">
        <span className="pxl-flip__glyph">{from}</span>
      </span>
      {flipping && (
        <span key={`${from}${char}`} className="pxl-flip__flaps">
          <span className="pxl-flip__half pxl-flip__flap" data-half="top">
            <span className="pxl-flip__glyph">{from}</span>
          </span>
          <span className="pxl-flip__half pxl-flip__flap" data-half="bottom">
            <span className="pxl-flip__glyph">{char}</span>
          </span>
        </span>
      )}
    </span>
  );
}

export interface FlipCounterProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  value: number | string;
  /** Pads numbers with leading zeros to this many digits. */
  minDigits?: number;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Number shown on split-flap cards in the pixel font. Each digit flips on its
 * own when it changes; separators such as `:` or `.` stay put.
 */
export function FlipCounter({
  value,
  minDigits = 1,
  size = 'md',
  className,
  ...rest
}: FlipCounterProps) {
  const text = typeof value === 'number' ? String(value).padStart(minDigits, '0') : value;
  const chars = Array.from(text);
  return (
    <span className={cx('pxl-flip', className)} data-size={size} {...rest}>
      <span className="pxl-flip__cards" aria-hidden="true">
        {chars.map((char, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: keyed from the right so a new leading digit does not re-flip the rest
          <FlipChar key={chars.length - i} char={char} />
        ))}
      </span>
      <span className="pxl-visually-hidden">{text}</span>
    </span>
  );
}

export interface ClockProps extends Omit<FlipCounterProps, 'value' | 'minDigits'> {
  /** @default true */
  showSeconds?: boolean;
  /** IANA zone, e.g. `Europe/Madrid`. Defaults to the viewer's zone. */
  timeZone?: string;
}

function format(date: Date, showSeconds: boolean, timeZone?: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hourCycle: 'h23',
    timeZone,
  }).format(date);
}

/** 24-hour flip clock. Renders dashes until mounted so server and client markup match. */
export function Clock({ showSeconds = true, timeZone, ...rest }: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      id = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    return () => clearTimeout(id);
  }, []);

  const placeholder = showSeconds ? '--:--:--' : '--:--';
  return (
    <FlipCounter
      role="timer"
      value={now ? format(now, showSeconds, timeZone) : placeholder}
      {...rest}
    />
  );
}
