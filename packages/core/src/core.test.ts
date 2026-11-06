import { describe, expect, it } from 'vitest';
import { litCells } from './cells.js';
import { computePosition } from './position.js';
import { nextIndex } from './roving.js';

const view = { width: 400, height: 300 };
const opts = { side: 'bottom', align: 'center', offset: 8, padding: 8 } as const;
const float = { width: 60, height: 40 };

describe('computePosition', () => {
  it('centres below the anchor', () => {
    const p = computePosition({ top: 100, left: 100, width: 100, height: 20 }, float, view, opts);
    expect(p).toEqual({ x: 120, y: 128, side: 'bottom' });
  });

  it('flips to the top when the bottom overflows', () => {
    const p = computePosition({ top: 260, left: 100, width: 100, height: 20 }, float, view, opts);
    expect(p).toMatchObject({ side: 'top', y: 212 });
  });

  it('clamps inside the viewport padding', () => {
    const p = computePosition(
      { top: 100, left: 0, width: 10, height: 20 },
      { width: 120, height: 40 },
      view,
      opts,
    );
    expect(p.x).toBe(8);
  });
});

describe('nextIndex', () => {
  it('wraps and skips disabled items', () => {
    expect(nextIndex('ArrowDown', 2, [false, true, false])).toBe(0);
    expect(nextIndex('ArrowDown', 0, [false, true, false])).toBe(2);
    expect(nextIndex('ArrowUp', 0, [false, true, false])).toBe(2);
    expect(nextIndex('Home', 2, [true, false, false])).toBe(1);
    expect(nextIndex('End', 0, [false, false, true])).toBe(1);
  });

  it('ignores keys of the other orientation', () => {
    expect(nextIndex('ArrowDown', 0, [false, false], 'horizontal')).toBeNull();
  });
});

describe('litCells', () => {
  it('rounds and clamps', () => {
    expect(litCells(50, 100, 10)).toBe(5);
    expect(litCells(150, 100, 10)).toBe(10);
    expect(litCells(5, 0, 10)).toBe(0);
  });
});
