'use client';

import { type Align, cx, type PixelSize, type Side } from '@pablo-v/core';
import { Popover } from '@pablo-v/popover';
import type { CSSProperties, ReactNode } from 'react';
import { ColorArea } from './ColorArea.js';
import { ColorField } from './ColorField.js';
import { ColorSlider } from './ColorSlider.js';
import { type ColorSwatchOption, ColorSwatchPicker } from './ColorSwatchPicker.js';
import { toCss, toHex } from './color.js';
import { ColorContext, type ColorValueProps, useColor } from './use-color.js';

export interface ColorPickerProps extends ColorValueProps {
  /** Accessible name of the trigger and the panel. @default 'Color' */
  label?: string;
  /** Adds an alpha slider to the default panel. */
  alpha?: boolean;
  /** Preset colours under the default panel. */
  swatches?: readonly ColorSwatchOption[];
  /** Replaces the default panel. Colour controls inside share the picker's colour. */
  children?: ReactNode;
  /** @default 'md' */
  size?: PixelSize;
  disabled?: boolean;
  /** @default 'bottom' */
  side?: Side;
  /** @default 'start' */
  align?: Align;
  className?: string;
  style?: CSSProperties;
}

/**
 * Trigger showing the current colour that opens a panel with an area, hue
 * slider and hex field. Pass children to compose your own panel.
 */
export function ColorPicker({
  value,
  defaultValue = '#0070f3',
  onChange,
  label = 'Color',
  alpha = false,
  swatches,
  children,
  size = 'md',
  disabled,
  side = 'bottom',
  align = 'start',
  className,
  style,
}: ColorPickerProps) {
  const state = useColor({ value, defaultValue, onChange });
  const hex = toHex(state.color);

  return (
    <ColorContext value={state}>
      <Popover
        side={side}
        align={align}
        label={label}
        className="pxl-color-picker__panel"
        trigger={
          <button
            type="button"
            className={cx('pxl-color-picker', className)}
            style={style}
            data-size={size}
            disabled={disabled}
          >
            <span className="pxl-color-picker__label">{label}</span>{' '}
            <span
              className="pxl-color-picker__swatch"
              style={{ '--_color': toCss(state.color) } as CSSProperties}
            />
            <span className="pxl-color-picker__value">{hex}</span>
          </button>
        }
      >
        {children ?? (
          <>
            <ColorArea />
            <ColorSlider channel="hue" />
            {alpha && <ColorSlider channel="alpha" />}
            <ColorField size="sm" aria-label="Hex" />
            {swatches && swatches.length > 0 && (
              <ColorSwatchPicker colors={swatches} size="sm" aria-label="Presets" />
            )}
          </>
        )}
      </Popover>
    </ColorContext>
  );
}
