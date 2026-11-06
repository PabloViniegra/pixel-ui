export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export interface PositionOptions {
  side: Side;
  align: Align;
  /** Gap between anchor and floating element. */
  offset: number;
  /** Minimum distance kept from the viewport edges. */
  padding: number;
}

interface Box {
  width: number;
  height: number;
}

interface AnchorRect extends Box {
  top: number;
  left: number;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function place(a: AnchorRect, f: Box, side: Side, align: Align, offset: number) {
  const vertical = side === 'top' || side === 'bottom';
  const crossStart = vertical ? a.left : a.top;
  const crossAnchor = vertical ? a.width : a.height;
  const crossFloat = vertical ? f.width : f.height;
  const cross =
    align === 'start'
      ? crossStart
      : align === 'end'
        ? crossStart + crossAnchor - crossFloat
        : crossStart + (crossAnchor - crossFloat) / 2;
  if (side === 'top') return { x: cross, y: a.top - f.height - offset };
  if (side === 'bottom') return { x: cross, y: a.top + a.height + offset };
  if (side === 'left') return { x: a.left - f.width - offset, y: cross };
  return { x: a.left + a.width + offset, y: cross };
}

function overflow(p: { x: number; y: number }, f: Box, view: Box, pad: number, side: Side) {
  if (side === 'top') return pad - p.y;
  if (side === 'bottom') return p.y + f.height - (view.height - pad);
  if (side === 'left') return pad - p.x;
  return p.x + f.width - (view.width - pad);
}

/**
 * Viewport coordinates for a floating element next to an anchor. Flips to the
 * opposite side when the preferred one overflows and the opposite fits better,
 * then clamps along the cross axis so it never leaves the viewport.
 */
export function computePosition(
  anchor: AnchorRect,
  floating: Box,
  viewport: Box,
  { side, align, offset, padding }: PositionOptions,
): { x: number; y: number; side: Side } {
  let finalSide = side;
  let p = place(anchor, floating, side, align, offset);
  const over = overflow(p, floating, viewport, padding, side);
  if (over > 0) {
    const flipped = OPPOSITE[side];
    const q = place(anchor, floating, flipped, align, offset);
    if (overflow(q, floating, viewport, padding, flipped) < over) {
      p = q;
      finalSide = flipped;
    }
  }
  const maxX = Math.max(padding, viewport.width - floating.width - padding);
  const maxY = Math.max(padding, viewport.height - floating.height - padding);
  return {
    x: Math.round(Math.min(Math.max(p.x, padding), maxX)),
    y: Math.round(Math.min(Math.max(p.y, padding), maxY)),
    side: finalSide,
  };
}
