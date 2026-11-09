'use client';

import { createContext, use, useState } from 'react';
import { type Hsva, parseHex, toHex } from './color.js';

export interface ColorState {
  color: Hsva;
  setColor: (color: Hsva) => void;
}

export const ColorContext = createContext<ColorState | null>(null);

const BLACK: Hsva = { h: 0, s: 0, v: 0, a: 1 };

export interface ColorValueProps {
  /** Hex colour (`#rrggbb` or `#rrggbbaa`). */
  value?: string;
  defaultValue?: string;
  /** Receives lowercase hex; `#rrggbbaa` only when the alpha is below 1. */
  onChange?: (value: string) => void;
}

/**
 * Colour state kept as HSV, so hue and saturation survive while the colour
 * passes through greys, where hex alone would lose them. Inside a
 * `ColorPicker` without its own value, a control shares the picker's colour.
 */
export function useColor({ value, defaultValue, onChange }: ColorValueProps): ColorState {
  const shared = use(ColorContext);
  const useShared = shared != null && value === undefined && defaultValue === undefined;
  const [internal, setInternal] = useState<Hsva>(
    () => parseHex(value ?? defaultValue ?? '') ?? BLACK,
  );

  const parsed = value === undefined ? null : parseHex(value);
  const local = parsed && toHex(parsed) !== toHex(internal) ? parsed : internal;

  const source = useShared ? shared : { color: local, setColor: setInternal };
  return {
    color: source.color,
    setColor: (next) => {
      source.setColor(next);
      if (toHex(next) !== toHex(source.color)) onChange?.(toHex(next));
    },
  };
}
