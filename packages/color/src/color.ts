import { clamp } from '@pablo-v/core';

/** Hue 0–360, saturation / brightness / alpha 0–1. */
export interface Hsva {
  h: number;
  s: number;
  v: number;
  a: number;
}

export type ColorChannel = 'hue' | 'saturation' | 'brightness' | 'alpha';

const HEX = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

/** Parses `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa` (the `#` is optional). */
export function parseHex(input: string): Hsva | null {
  const match = HEX.exec(input.trim());
  if (!match?.[1]) return null;
  let hex = match[1];
  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');
  const n = (i: number) => Number.parseInt(hex.slice(i, i + 2), 16) / 255;
  return rgbToHsv(n(0), n(2), n(4), hex.length === 8 ? n(6) : 1);
}

function rgbToHsv(r: number, g: number, b: number, a: number): Hsva {
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max === 0 ? 0 : d / max, v: max, a };
}

export function hsvToRgb({ h, s, v }: Hsva): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)].map((c) => Math.round(c * 255)) as [number, number, number];
}

const byte = (n: number) =>
  Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, '0');

/** Lowercase `#rrggbb`, or `#rrggbbaa` when the colour is not opaque. */
export function toHex(color: Hsva): string {
  const [r, g, b] = hsvToRgb(color);
  const alpha = color.a < 1 ? byte(color.a * 255) : '';
  return `#${byte(r)}${byte(g)}${byte(b)}${alpha}`;
}

export function toCss(color: Hsva): string {
  const [r, g, b] = hsvToRgb(color);
  return color.a < 1 ? `rgb(${r} ${g} ${b} / ${+color.a.toFixed(3)})` : `rgb(${r} ${g} ${b})`;
}

const RANGE: Record<ColorChannel, number> = { hue: 360, saturation: 1, brightness: 1, alpha: 1 };
const KEY: Record<ColorChannel, keyof Hsva> = {
  hue: 'h',
  saturation: 's',
  brightness: 'v',
  alpha: 'a',
};

export const channelMax = (channel: ColorChannel) => RANGE[channel];

export const getChannel = (color: Hsva, channel: ColorChannel) => color[KEY[channel]];

export function setChannel(color: Hsva, channel: ColorChannel, value: number): Hsva {
  return { ...color, [KEY[channel]]: clamp(value, 0, RANGE[channel]) };
}

export function channelText(color: Hsva, channel: ColorChannel): string {
  const value = getChannel(color, channel);
  return channel === 'hue' ? `${Math.round(value)}°` : `${Math.round(value * 100)}%`;
}
