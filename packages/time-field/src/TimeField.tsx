'use client';

import { cx, type PixelSize, useControllableState } from '@pablo-v/core';
import { useFieldControl, useFieldLabelId } from '@pablo-v/field';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Unit = 'hour' | 'minute' | 'second';
type Segment = Unit | 'period';
type Period = 'AM' | 'PM';

interface Parts {
  hour: number | null;
  minute: number | null;
  second: number | null;
  period: Period | null;
}

const EMPTY: Parts = { hour: null, minute: null, second: null, period: null };

const pad = (n: number) => String(n).padStart(2, '0');

/** Whether the locale writes times on a 12-hour clock. */
export function uses12Hours(locale?: string) {
  const cycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
  return cycle === 'h11' || cycle === 'h12';
}

function periodFirst(locale?: string) {
  const parts = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true }).formatToParts(
    new Date(2000, 0, 1, 9),
  );
  return parts.findIndex((p) => p.type === 'dayPeriod') < parts.findIndex((p) => p.type === 'hour');
}

function periodLabels(locale?: string): Record<Period, string> {
  const label = (h: number) =>
    new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true })
      .formatToParts(new Date(2000, 0, 1, h))
      .find((p) => p.type === 'dayPeriod')?.value ?? (h < 12 ? 'AM' : 'PM');
  return { AM: label(9), PM: label(21) };
}

/** Parses `HH:mm` or `HH:mm:ss` into seconds since midnight. */
export function timeToSeconds(time: string | null | undefined): number | null {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(time ?? '');
  if (!match) return null;
  const [h, m, s] = [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
  if (h > 23 || m > 59 || s > 59) return null;
  return h * 3600 + m * 60 + s;
}

function partsOf(value: string | null, twelve: boolean): Parts {
  const total = timeToSeconds(value);
  if (total == null) return EMPTY;
  const h = Math.floor(total / 3600);
  return {
    hour: twelve ? h % 12 || 12 : h,
    minute: Math.floor(total / 60) % 60,
    second: total % 60,
    period: h < 12 ? 'AM' : 'PM',
  };
}

function compose(parts: Parts, twelve: boolean, seconds: boolean): string | null {
  const { hour, minute, second, period } = parts;
  if (hour == null || minute == null || (seconds && second == null)) return null;
  if (twelve && period == null) return null;
  const h = twelve ? (hour % 12) + (period === 'PM' ? 12 : 0) : hour;
  return `${pad(h)}:${pad(minute)}${seconds ? `:${pad(second ?? 0)}` : ''}`;
}

export interface TimeFieldProps
  extends Omit<ComponentPropsWithRef<'span'>, 'onChange' | 'defaultValue' | 'prefix' | 'children'> {
  /** 24-hour `HH:mm`, or `HH:mm:ss` with `granularity="second"`. */
  value?: string | null;
  defaultValue?: string | null;
  /** Called with a complete time, or `null` once it is cleared. */
  onChange?: (value: string | null) => void;
  /** @default 'minute' */
  granularity?: 'minute' | 'second';
  /** Clock shown to the user; the value is always 24-hour. Defaults to the locale's. */
  hourCycle?: 12 | 24;
  /** BCP 47 locale for the default hour cycle and the AM/PM labels. */
  locale?: string;
  /** Earliest valid time; later values show the error style. */
  min?: string;
  max?: string;
  /** @default 'md' */
  size?: PixelSize;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Id of the first segment. Inside a `Field` this is automatic. */
  id?: string;
  /** Name of a hidden input that submits the value. */
  name?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Accessible names of the segments. */
  segmentLabels?: Partial<Record<Segment, string>>;
}

const LABELS: Record<Segment, string> = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  period: 'AM/PM',
};

/**
 * Keyboard-first time entry with one spin button per unit. Type digits to fill
 * a segment, arrows to step, A or P to set the period. Shares the Input box,
 * so import `@pablo-v/input/style.css` too.
 */
export function TimeField({
  value: valueProp,
  defaultValue = null,
  onChange,
  granularity = 'minute',
  hourCycle,
  locale,
  min,
  max,
  size = 'md',
  disabled,
  readOnly = false,
  required,
  invalid,
  id,
  name,
  prefix,
  suffix,
  segmentLabels,
  className,
  'aria-describedby': describedBy,
  'aria-labelledby': labelledBy,
  'aria-label': ariaLabel,
  ...rest
}: TimeFieldProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const control = useFieldControl(
    {
      id,
      'aria-describedby': describedBy,
      'aria-invalid': undefined as boolean | undefined,
      required,
      disabled,
    },
    invalid,
  );
  const fieldLabelId = useFieldLabelId();
  const twelve = hourCycle ? hourCycle === 12 : uses12Hours(locale);
  const seconds = granularity === 'second';
  const periods = useMemo(() => periodLabels(locale), [locale]);
  const order = useMemo<Segment[]>(() => {
    const units: Segment[] = seconds ? ['hour', 'minute', 'second'] : ['hour', 'minute'];
    if (!twelve) return units;
    return periodFirst(locale) ? ['period', ...units] : [...units, 'period'];
  }, [seconds, twelve, locale]);

  const [parts, setParts] = useState<Parts>(() => partsOf(value, twelve));
  const typed = useRef('');
  const inputs = useRef<Partial<Record<Segment, HTMLInputElement | null>>>({});
  const composed = compose(parts, twelve, seconds);

  // Only an outside change of `value` resyncs the segments; typing goes through `update`.
  // biome-ignore lint/correctness/useExhaustiveDependencies: parts are read, not tracked
  useEffect(() => {
    if (value !== composed && (value != null || composed != null)) setParts(partsOf(value, twelve));
  }, [value, twelve]);

  const update = (next: Parts) => {
    setParts(next);
    const time = compose(next, twelve, seconds);
    if (time !== value && (time != null || value != null)) setValue(time);
  };

  const limits = (unit: Unit) =>
    unit === 'hour' ? (twelve ? { lo: 1, hi: 12 } : { lo: 0, hi: 23 }) : { lo: 0, hi: 59 };

  const focusSibling = (segment: Segment, delta: number) => {
    const target = order[order.indexOf(segment) + delta];
    if (target) inputs.current[target]?.focus();
  };

  const step = (segment: Segment, delta: number) => {
    if (segment === 'period') {
      update({ ...parts, period: parts.period === 'AM' ? 'PM' : 'AM' });
      return;
    }
    const { lo, hi } = limits(segment);
    const current = parts[segment];
    const next = current == null ? (delta > 0 ? lo : hi) : current + delta;
    update({ ...parts, [segment]: next > hi ? lo : next < lo ? hi : next });
  };

  const onKeyDown = (segment: Segment, event: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const key = event.key;
    if (key === 'ArrowUp' || (key === 'ArrowDown' && !event.altKey)) {
      step(segment, key === 'ArrowUp' ? 1 : -1);
    } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      focusSibling(segment, key === 'ArrowLeft' ? -1 : 1);
    } else if (key === 'Backspace' || key === 'Delete') {
      if (parts[segment] != null) {
        typed.current = '';
        update({ ...parts, [segment]: null });
      } else if (key === 'Backspace') focusSibling(segment, -1);
    } else if (segment === 'period' && /^[ap]$/i.test(key)) {
      update({ ...parts, period: key.toLowerCase() === 'a' ? 'AM' : 'PM' });
      focusSibling(segment, 1);
    } else if (/^[:.\s]$/.test(key) && parts[segment] != null) {
      focusSibling(segment, 1);
    } else return;
    event.preventDefault();
  };

  const onInput = (unit: Unit, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const { lo, hi } = limits(unit);
    let buffer = typed.current + digit;
    if (Number(buffer) > hi) buffer = digit;
    const number = Number(buffer);
    const done = buffer.length >= 2 || number * 10 > hi;
    typed.current = done ? '' : buffer;
    update({ ...parts, [unit]: number >= lo ? number : null });
    if (done && number >= lo) focusSibling(unit, 1);
  };

  const total = timeToSeconds(composed);
  const minS = timeToSeconds(min);
  const maxS = timeToSeconds(max);
  const outOfRange =
    total != null && ((minS != null && total < minS) || (maxS != null && total > maxS));
  const isInvalid = !!control['aria-invalid'] || outOfRange;
  const labels = { ...LABELS, ...segmentLabels };
  const isDisabled = control.disabled ?? false;

  return (
    <span
      className={cx('pxl-input', 'pxl-time-field', className)}
      data-size={size}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      {...rest}
    >
      {prefix != null && <span className="pxl-input__affix">{prefix}</span>}
      <span
        role="group"
        aria-labelledby={labelledBy ?? fieldLabelId}
        aria-label={ariaLabel}
        className="pxl-time-field__segments"
      >
        {order.map((segment, index) => {
          const isPeriod = segment === 'period';
          const current = parts[segment];
          const display =
            current == null ? '' : isPeriod ? periods[current as Period] : pad(current as number);
          const range = isPeriod ? undefined : limits(segment);
          const literal =
            index > 0 && !isPeriod && order[index - 1] !== 'period' ? ':' : index > 0 ? ' ' : null;
          return (
            <span key={segment} className="pxl-time-field__part">
              {literal && (
                <span className="pxl-time-field__literal" aria-hidden="true">
                  {literal}
                </span>
              )}
              <span
                className="pxl-time-field__cell"
                data-placeholder={isPeriod ? periods.AM : '––'}
                style={{ '--_chars': isPeriod ? periods.AM.length : 2 } as CSSProperties}
              >
                <input
                  ref={(el) => {
                    inputs.current[segment] = el;
                  }}
                  id={index === 0 ? control.id : undefined}
                  className="pxl-time-field__segment"
                  data-type={segment}
                  role="spinbutton"
                  type="text"
                  inputMode={isPeriod ? 'text' : 'numeric'}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={labels[segment]}
                  aria-valuenow={
                    current == null
                      ? undefined
                      : isPeriod
                        ? current === 'AM'
                          ? 0
                          : 1
                        : (current as number)
                  }
                  aria-valuemin={range?.lo ?? 0}
                  aria-valuemax={range?.hi ?? 1}
                  aria-valuetext={current == null ? 'Empty' : display}
                  aria-describedby={control['aria-describedby']}
                  aria-invalid={isInvalid || undefined}
                  aria-required={control.required || undefined}
                  aria-readonly={readOnly || undefined}
                  disabled={isDisabled}
                  placeholder={isPeriod ? periods.AM : '––'}
                  value={display}
                  onFocus={(event) => {
                    typed.current = '';
                    event.currentTarget.select();
                  }}
                  onBlur={() => {
                    typed.current = '';
                  }}
                  onKeyDown={(event) => onKeyDown(segment, event)}
                  onChange={(event) => {
                    if (readOnly) return;
                    if (!isPeriod) onInput(segment, event.target.value);
                    else if (/[ap]$/i.test(event.target.value))
                      update({ ...parts, period: /a$/i.test(event.target.value) ? 'AM' : 'PM' });
                  }}
                />
              </span>
            </span>
          );
        })}
      </span>
      {suffix != null && <span className="pxl-input__affix">{suffix}</span>}
      {name && <input type="hidden" name={name} value={composed ?? ''} />}
    </span>
  );
}
