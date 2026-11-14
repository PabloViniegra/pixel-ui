'use client';

import {
  type Align,
  nextIndex,
  useControllableState,
  useDismiss,
  useFloating,
  useIsomorphicLayoutEffect,
  usePresence,
} from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import { ClockIcon } from '@pablo-v/pixel-icons';
import { type KeyboardEvent, useId, useMemo, useRef } from 'react';
import { TimeField, type TimeFieldProps, timeToSeconds, uses12Hours } from './TimeField.js';

export interface TimePickerProps extends TimeFieldProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Minutes between the suggested times in the list. @default 30 */
  interval?: number;
  /** Accessible name of the trigger and the list. @default 'Choose time' */
  pickerLabel?: string;
  /** @default 'end' */
  align?: Align;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * TimeField with a list of suggested times. Alt+ArrowDown or the clock button
 * opens it; arrows move, Enter picks and Escape closes.
 */
export function TimePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  interval = 30,
  pickerLabel = 'Choose time',
  align = 'end',
  granularity = 'minute',
  hourCycle,
  locale,
  min,
  max,
  disabled,
  readOnly,
  onKeyDown,
  ...rest
}: TimePickerProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const boxRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const inert = useFieldControl({ disabled }).disabled || readOnly;
  const twelve = hourCycle ? hourCycle === 12 : uses12Hours(locale);

  const options = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, {
      hour: twelve ? 'numeric' : '2-digit',
      minute: '2-digit',
      hour12: twelve,
    });
    const minS = timeToSeconds(min) ?? 0;
    const maxS = timeToSeconds(max) ?? 86_399;
    const step = Math.max(1, interval) * 60;
    const list: { value: string; label: string }[] = [];
    for (let s = 0; s < 86_400; s += step) {
      if (s < minS || s > maxS) continue;
      const h = Math.floor(s / 3600);
      const m = Math.floor(s / 60) % 60;
      list.push({
        value: `${pad(h)}:${pad(m)}${granularity === 'second' ? ':00' : ''}`,
        label: format.format(new Date(2000, 0, 1, h, m)),
      });
    }
    return list;
  }, [locale, twelve, min, max, interval, granularity]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  useFloating({ open, anchorRef: boxRef, floatingRef: listRef, side: 'bottom', align, offset: 4 });
  useDismiss(open, () => close(!!listRef.current?.contains(document.activeElement)), [
    boxRef,
    listRef,
  ]);

  // The option to start on: the selected time, the first one after it, or the last one.
  const current = timeToSeconds(value);
  const after =
    current == null ? 0 : options.findIndex((o) => (timeToSeconds(o.value) ?? 0) >= current);
  const activeIndex = after === -1 ? options.length - 1 : after;

  // Runs after useFloating has shown the popover; a hidden popover cannot take focus.
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const option = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[activeIndex];
    option?.focus({ preventScroll: true });
    option?.scrollIntoView?.({ block: 'center' });
  }, [open]);

  const mounted = usePresence(open, listRef);

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'));
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Tab') {
      close(false);
      return;
    }
    const next = nextIndex(
      event.key,
      index,
      items.map(() => false),
      'vertical',
    );
    if (next == null) return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <>
      <TimeField
        {...rest}
        ref={boxRef}
        value={value}
        onChange={setValue}
        granularity={granularity}
        hourCycle={hourCycle}
        locale={locale}
        min={min}
        max={max}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
          onKeyDown?.(event);
          if (event.altKey && event.key === 'ArrowDown' && !inert && options.length) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        suffix={
          <button
            ref={triggerRef}
            type="button"
            className="pxl-time-picker__trigger"
            aria-label={pickerLabel}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? id : undefined}
            disabled={inert || !options.length}
            onClick={() => (open ? close(false) : setOpen(true))}
          >
            <ClockIcon />
          </button>
        }
      />
      {mounted && (
        <div
          ref={listRef}
          id={id}
          role="listbox"
          aria-label={pickerLabel}
          popover="manual"
          data-closing={!open || undefined}
          inert={!open || undefined}
          className="pxl-time-picker__popover"
          onKeyDown={handleListKeyDown}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <div
                key={option.value}
                role="option"
                tabIndex={-1}
                aria-selected={selected}
                className="pxl-time-picker__option"
                onClick={() => {
                  setValue(option.value);
                  close(true);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  setValue(option.value);
                  close(true);
                }}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
