'use client';

import { cx } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import {
  type ColorChannel,
  channelMax,
  channelText,
  getChannel,
  type Hsva,
  setChannel,
  toCss,
} from './color.js';
import { type ColorValueProps, useColor } from './use-color.js';

export interface ColorSliderProps
  extends ColorValueProps,
    Omit<
      ComponentPropsWithRef<'input'>,
      'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'size'
    > {
  /** @default 'hue' */
  channel?: ColorChannel;
  /** Number of cells in the track. @default 24 */
  segments?: number;
  /** Shows the channel value at the end of the track. */
  showValue?: boolean;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

const NAMES: Record<ColorChannel, string> = {
  hue: 'Hue',
  saturation: 'Saturation',
  brightness: 'Brightness',
  alpha: 'Alpha',
};

function cellColor(color: Hsva, channel: ColorChannel, t: number): string {
  const base = channel === 'hue' ? { ...color, s: 1, v: 1, a: 1 } : color;
  const solid = channel === 'alpha' ? base : { ...base, a: 1 };
  return toCss(setChannel(solid, channel, t * channelMax(channel)));
}

/** One colour channel on a native range input, drawn as a row of colour cells. */
export function ColorSlider({
  value,
  defaultValue,
  onChange,
  channel = 'hue',
  segments = 24,
  showValue = false,
  className,
  style,
  ...rest
}: ColorSliderProps) {
  const { color, setColor } = useColor({ value, defaultValue, onChange });
  const props = useFieldControl(rest);
  const scale = channel === 'hue' ? 1 : 100;
  const current = Math.round(getChannel(color, channel) * scale);
  const text = channelText(color, channel);
  const count = Math.max(2, Math.round(segments));

  return (
    <span
      className={cx('pxl-color-slider', className)}
      data-channel={channel}
      data-disabled={props.disabled || undefined}
      style={
        {
          '--_segments': count,
          '--_thumb-color': toCss(channel === 'hue' ? { h: color.h, s: 1, v: 1, a: 1 } : color),
          ...style,
        } as CSSProperties
      }
    >
      <span className="pxl-color-slider__body">
        <span className="pxl-color-slider__track" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable cells
              key={i}
              className="pxl-color-slider__cell"
              style={{ '--_c': cellColor(color, channel, i / (count - 1)) } as CSSProperties}
            />
          ))}
        </span>
        <input
          type="range"
          className="pxl-color-slider__control"
          aria-label={props['aria-labelledby'] || props.id ? undefined : NAMES[channel]}
          aria-valuetext={text}
          min={0}
          max={channelMax(channel) * scale}
          step={1}
          value={current}
          onChange={(event) =>
            setColor(setChannel(color, channel, event.currentTarget.valueAsNumber / scale))
          }
          {...props}
        />
      </span>
      {showValue && (
        <output className="pxl-color-slider__value" aria-hidden="true">
          {text}
        </output>
      )}
    </span>
  );
}
