'use client';

import { clamp, cx, type PixelSize, useControllableState } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import { MinusIcon, PlusIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  useState,
} from 'react';

export interface NumberFieldProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'type'
  > {
  value?: number | null;
  defaultValue?: number | null;
  /** Fires when a typed value is committed (blur or Enter) and on every step. */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  /** @default 'md' */
  size?: PixelSize;
  /** Shows the error style. Inside a `Field` with `error` this is automatic. */
  invalid?: boolean;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

function decimals(n: number) {
  return (String(n).split('.')[1] ?? '').length;
}

/**
 * Numeric entry (`spinbutton`) between decrement and increment compartments.
 * Arrow keys step, Page keys step ×10, Home and End jump to the bounds. Shares
 * the Input box, so import `@pablo-v/input/style.css` too.
 */
export function NumberField({
  value: valueProp,
  defaultValue = null,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  size = 'md',
  invalid,
  className,
  style,
  onBlur,
  onKeyDown,
  readOnly,
  ...rest
}: NumberFieldProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const [draft, setDraft] = useState<string | null>(null);
  const props = useFieldControl(rest, invalid);
  const locked = props.disabled || readOnly;
  const precision = decimals(step);

  const commit = (next: number | null) => {
    setDraft(null);
    const normalized = next == null ? null : Number(clamp(next, min, max).toFixed(precision));
    if (normalized !== value) setValue(normalized);
  };

  const parse = () => {
    if (draft == null) return value;
    const n = Number(draft.trim().replace(',', '.'));
    return draft.trim() === '' ? null : Number.isFinite(n) ? n : value;
  };

  const stepBy = (delta: number) => {
    const base = parse();
    commit(base == null ? (Number.isFinite(min) ? min : 0) : base + delta * step);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || locked) return;
    const steps: Record<string, number> = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
    if (event.key in steps) {
      event.preventDefault();
      stepBy(steps[event.key] ?? 0);
    } else if (event.key === 'Enter') commit(parse());
    else if (event.key === 'Home' && Number.isFinite(min)) {
      event.preventDefault();
      commit(min);
    } else if (event.key === 'End' && Number.isFinite(max)) {
      event.preventDefault();
      commit(max);
    }
  };

  return (
    <span
      className={cx('pxl-input', 'pxl-number-field', className)}
      style={style}
      data-size={size}
      data-invalid={props['aria-invalid'] ? true : undefined}
      data-disabled={props.disabled || undefined}
    >
      <span className="pxl-input__affix">
        <button
          type="button"
          tabIndex={-1}
          className="pxl-number-field__step"
          aria-label="Decrease"
          disabled={locked || (value != null && value <= min)}
          onClick={() => stepBy(-1)}
        >
          <MinusIcon />
        </button>
      </span>
      <input
        type="text"
        inputMode={precision > 0 || min < 0 ? 'decimal' : 'numeric'}
        role="spinbutton"
        autoComplete="off"
        className="pxl-input__control"
        aria-valuenow={value ?? undefined}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        readOnly={readOnly}
        {...props}
        value={draft ?? (value == null ? '' : String(value))}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          onBlur?.(event);
          if (draft != null) commit(parse());
        }}
      />
      <span className="pxl-input__affix">
        <button
          type="button"
          tabIndex={-1}
          className="pxl-number-field__step"
          aria-label="Increase"
          disabled={locked || (value != null && value >= max)}
          onClick={() => stepBy(1)}
        >
          <PlusIcon />
        </button>
      </span>
    </span>
  );
}
