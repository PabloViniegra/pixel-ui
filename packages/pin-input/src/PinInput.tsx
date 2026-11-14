'use client';

import { cx, type PixelSize, useControllableState, useIsomorphicLayoutEffect } from '@pablo-v/core';
import { useFieldControl, useFieldLabelId } from '@pablo-v/field';
import {
  type ClipboardEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useRef,
  useState,
} from 'react';

export interface PinInputProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  /** Number of characters. @default 6 */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires once every cell is filled. */
  onComplete?: (value: string) => void;
  /** @default 'numeric' */
  type?: 'numeric' | 'alphanumeric';
  /** Hides the characters behind solid cells, for PINs. */
  mask?: boolean;
  /** @default 'md' */
  size?: PixelSize;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** Id of the first cell. Inside a `Field` this is automatic. */
  id?: string;
  /** Name of a hidden input that submits the joined value. */
  name?: string;
  autoFocus?: boolean;
  /** Accessible name of each cell. @default (i, n) => `Character ${i} of ${n}` */
  cellLabel?: (index: number, length: number) => string;
}

const PATTERN = { numeric: /[0-9]/, alphanumeric: /[a-z0-9]/i };

/**
 * One-time code or PIN entry, one cell per character. Typing advances,
 * Backspace steps back, and pasting or SMS autofill spreads across the cells.
 */
export function PinInput({
  length = 6,
  value: valueProp,
  defaultValue = '',
  onChange,
  onComplete,
  type = 'numeric',
  mask = false,
  size = 'md',
  disabled,
  invalid,
  required,
  id,
  name,
  autoFocus,
  cellLabel = (i, n) => `Character ${i} of ${n}`,
  className,
  'aria-describedby': describedBy,
  'aria-labelledby': labelledBy,
  ...rest
}: PinInputProps) {
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
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [draftCells, setDraftCells] = useState<string[] | null>(null);
  const cells = draftCells?.join('') === value ? draftCells : null;
  const chars = Array.from({ length }, (_, i) => cells?.[i] ?? value[i] ?? '');
  const pattern = PATTERN[type];
  const pendingFocus = useRef<number | null>(null);

  // Focus moves after the commit renders, so the gap check in onFocus sees the new value.
  useIsomorphicLayoutEffect(() => {
    if (pendingFocus.current == null) return;
    focus(pendingFocus.current);
    pendingFocus.current = null;
  });

  const focus = (index: number) => {
    const el = inputs.current[Math.max(0, Math.min(index, length - 1))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string[]) => {
    const joined = next.join('').slice(0, length);
    setDraftCells(next);
    setValue(joined);
    if (joined.length === length && next.every(Boolean)) onComplete?.(joined);
  };

  const fill = (index: number, text: string) => {
    const accepted = Array.from(text).filter((c) => pattern.test(c));
    if (accepted.length === 0) return;
    const next = [...chars];
    accepted.slice(0, length - index).forEach((c, i) => {
      next[index + i] = type === 'alphanumeric' ? c.toUpperCase() : c;
    });
    commit(next);
    pendingFocus.current = index + accepted.length;
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const next = [...chars];
      if (next[index]) {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        focus(index - 1);
      }
      commit(next);
    } else if (event.key === 'Delete') {
      event.preventDefault();
      commit(chars.map((c, i) => (i === index ? '' : c)));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focus(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focus(index + 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focus(event.key === 'Home' ? 0 : length - 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fill(index, event.clipboardData.getData('text'));
  };

  // Fill the first gap before accepting input in later cells.
  const firstEmpty = chars.findIndex((c) => !c);

  return (
    <div
      role="group"
      aria-labelledby={labelledBy ?? fieldLabelId}
      className={cx('pxl-pin-input', className)}
      data-size={size}
      data-invalid={control['aria-invalid'] ? true : undefined}
      data-disabled={control.disabled || undefined}
      data-mask={mask || undefined}
      {...rest}
    >
      {chars.map((char, i) => (
        <input
          // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          id={i === 0 ? control.id : undefined}
          className="pxl-pin-input__cell"
          type={mask ? 'password' : 'text'}
          inputMode={type === 'numeric' ? 'numeric' : 'text'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoCapitalize="characters"
          spellCheck={false}
          autoFocus={autoFocus && i === 0}
          aria-label={cellLabel(i + 1, length)}
          aria-describedby={control['aria-describedby']}
          aria-invalid={control['aria-invalid']}
          aria-required={control.required || undefined}
          disabled={control.disabled}
          data-filled={char ? true : undefined}
          value={char}
          onFocus={(event) => {
            if (firstEmpty >= 0 && i > firstEmpty) focus(firstEmpty);
            else event.currentTarget.select();
          }}
          onChange={(event) => {
            const typed = event.target.value.replace(char, '') || event.target.value;
            fill(i, typed);
          }}
          onKeyDown={(event) => handleKeyDown(i, event)}
          onPaste={(event) => handlePaste(i, event)}
        />
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
