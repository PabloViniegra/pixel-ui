export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** How many of `segments` cells are lit for `value` out of `max`. */
export function litCells(value: number, max: number, segments: number): number {
  if (!(max > 0)) return 0;
  return Math.round(clamp(value / max, 0, 1) * segments);
}
