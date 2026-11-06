export type Orientation = 'horizontal' | 'vertical';

/**
 * Index to move to for an arrow / Home / End key in a composite widget,
 * skipping disabled items and wrapping around. `null` when the key is not a
 * navigation key for this orientation.
 */
export function nextIndex(
  key: string,
  current: number,
  disabled: readonly boolean[],
  orientation: Orientation = 'vertical',
): number | null {
  const count = disabled.length;
  if (count === 0) return null;
  const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
  const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  let step: number;
  let start: number;
  if (key === next) [step, start] = [1, current];
  else if (key === prev) [step, start] = [-1, Math.max(current, 0)];
  else if (key === 'Home') [step, start] = [1, -1];
  else if (key === 'End') [step, start] = [-1, count];
  else return null;
  for (let i = 1; i <= count; i++) {
    const idx = (((start + step * i) % count) + count) % count;
    if (!disabled[idx]) return idx;
  }
  return null;
}
