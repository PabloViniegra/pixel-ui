'use client';

import { clamp, cx } from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useRef,
} from 'react';
import { channelText, type Hsva, toCss } from './color.js';
import { type ColorValueProps, useColor } from './use-color.js';

export interface ColorAreaProps
  extends ColorValueProps,
    Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  /** Cells per side. Each cell is one pickable colour. @default 16 */
  cells?: number;
  /** @default 'Saturation' */
  xLabel?: string;
  /** @default 'Brightness' */
  yLabel?: string;
  disabled?: boolean;
}

// Hard colour stops, one band per cell, so the area reads as a pixel grid.
function bands(direction: string, cells: number, color: (step: number) => string): string {
  const stops = Array.from({ length: cells }, (_, i) => {
    const from = (i / cells) * 100;
    const to = ((i + 1) / cells) * 100;
    return `${color(i / (cells - 1))} ${from}% ${to}%`;
  });
  return `linear-gradient(${direction}, ${stops.join(', ')})`;
}

/**
 * Saturation × brightness grid for the current hue. Pointer picks a cell;
 * arrows move one cell (Shift moves four). Each axis is a range input for
 * assistive technology.
 */
export function ColorArea({
  value,
  defaultValue,
  onChange,
  cells: cellsProp = 16,
  xLabel = 'Saturation',
  yLabel = 'Brightness',
  disabled,
  className,
  style,
  'aria-label': ariaLabel = 'Color',
  onPointerDown,
  onPointerMove,
  ...rest
}: ColorAreaProps) {
  const { color, setColor } = useColor({ value, defaultValue, onChange });
  const cells = Math.max(2, Math.round(cellsProp));
  const max = cells - 1;
  const xRef = useRef<HTMLInputElement>(null);
  const x = Math.round(color.s * max);
  const y = Math.round((1 - color.v) * max);

  const move = (nx: number, ny: number) => {
    const next: Hsva = { ...color, s: clamp(nx, 0, max) / max, v: 1 - clamp(ny, 0, max) / max };
    if (next.s !== color.s || next.v !== color.v) setColor(next);
  };

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    move(
      Math.floor(((event.clientX - rect.left) / rect.width) * cells),
      Math.floor(((event.clientY - rect.top) / rect.height) * cells),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = event.shiftKey ? 4 : 1;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
      PageUp: [0, -4],
      PageDown: [0, 4],
    };
    const d = delta[event.key];
    if (!d) return;
    event.preventDefault();
    move(x + d[0], y + d[1]);
  };

  const hue = toCss({ h: color.h, s: 1, v: 1, a: 1 });
  const background = [
    bands('to bottom', cells, (t) => `rgb(0 0 0 / ${+t.toFixed(4)})`),
    bands('to right', cells, (t) => `rgb(255 255 255 / ${+(1 - t).toFixed(4)})`),
    hue,
  ].join(', ');

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cx('pxl-color-area', className)}
      data-disabled={disabled || undefined}
      style={{ '--_cells': cells, ...style } as CSSProperties}
      {...rest}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || disabled || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        xRef.current?.focus({ preventScroll: true });
        fromPointer(event);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) fromPointer(event);
      }}
    >
      <div className="pxl-color-area__surface" style={{ background }} aria-hidden="true" />
      <div
        className="pxl-color-area__thumb"
        aria-hidden="true"
        style={
          {
            left: `${((x + 0.5) / cells) * 100}%`,
            top: `${((y + 0.5) / cells) * 100}%`,
            '--_color': toCss({ ...color, a: 1 }),
          } as CSSProperties
        }
      />
      <input
        ref={xRef}
        type="range"
        className="pxl-color-area__input"
        aria-label={xLabel}
        aria-valuetext={`${channelText(color, 'saturation')}, ${yLabel} ${channelText(color, 'brightness')}`}
        min={0}
        max={max}
        step={1}
        value={x}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onChange={(event) => move(event.currentTarget.valueAsNumber, y)}
      />
      <input
        type="range"
        className="pxl-color-area__input"
        aria-label={yLabel}
        aria-valuetext={`${channelText(color, 'brightness')}, ${xLabel} ${channelText(color, 'saturation')}`}
        min={0}
        max={max}
        step={1}
        value={max - y}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onChange={(event) => move(x, max - event.currentTarget.valueAsNumber)}
      />
    </div>
  );
}
