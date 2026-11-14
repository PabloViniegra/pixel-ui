'use client';

import { clamp, cx, type Orientation } from '@pablo-v/core';
import {
  Children,
  type ComponentPropsWithRef,
  cloneElement,
  Fragment,
  isValidElement,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  useId,
  useRef,
  useState,
} from 'react';

export interface ResizablePanelProps extends ComponentPropsWithRef<'div'> {
  /** Initial share of the group, in %. Panels without one split what is left. */
  defaultSize?: number;
  /** @default 10 */
  minSize?: number;
  /** @default 100 */
  maxSize?: number;
}

export function ResizablePanel({
  defaultSize: _defaultSize,
  minSize: _minSize,
  maxSize: _maxSize,
  className,
  ...rest
}: ResizablePanelProps) {
  return <div className={cx('pxl-resizable__panel', className)} {...rest} />;
}

export interface ResizablePanelsProps extends ComponentPropsWithRef<'div'> {
  /** `horizontal` lays panels side by side. @default 'horizontal' */
  orientation?: Orientation;
  /** Called with the panel sizes, in %, after each resize. */
  onLayout?: (sizes: number[]) => void;
  /** % moved per arrow key. @default 5 */
  keyboardStep?: number;
  /** Accessible name of each handle. @default 'Resize' */
  handleLabel?: string;
}

const panelProps = (el: ReactElement) => el.props as ResizablePanelProps;

function initialSizes(panels: ReactElement[]): number[] {
  const given = panels.map((p) => panelProps(p).defaultSize);
  const rest = 100 - given.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const unset = given.filter((s) => s == null).length;
  return given.map((s) => s ?? Math.max(0, rest) / unset);
}

/**
 * Panels separated by draggable handles. Handles are focusable separators:
 * arrows resize, Home and End jump to the limits.
 */
export function ResizablePanels({
  orientation = 'horizontal',
  onLayout,
  keyboardStep = 5,
  handleLabel = 'Resize',
  className,
  children,
  ...rest
}: ResizablePanelsProps) {
  const panels = Children.toArray(children).filter(isValidElement) as ReactElement[];
  let [sizes, setSizes] = useState(() => initialSizes(panels));
  // Adding or removing a panel invalidates every share, so the layout restarts from the defaults.
  if (sizes.length !== panels.length) {
    sizes = initialSizes(panels);
    setSizes(sizes);
  }
  const groupRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ index: number; start: number; sizes: number[] } | null>(null);
  const id = useId();
  const horizontal = orientation === 'horizontal';

  const limits = (index: number, current: number[]) => {
    const a = panelProps(panels[index] as ReactElement);
    const b = panelProps(panels[index + 1] as ReactElement);
    const pair = (current[index] ?? 0) + (current[index + 1] ?? 0);
    return {
      pair,
      min: Math.max(a.minSize ?? 10, pair - (b.maxSize ?? 100)),
      max: Math.min(a.maxSize ?? 100, pair - (b.minSize ?? 10)),
    };
  };

  const resize = (index: number, target: number, from = sizes) => {
    const { pair, min, max } = limits(index, from);
    const size = clamp(target, min, max);
    if (size === sizes[index]) return;
    const next = [...from];
    next[index] = size;
    next[index + 1] = pair - size;
    setSizes(next);
    onLayout?.(next);
  };

  const handlePointerDown = (index: number) => (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.focus();
    drag.current = { index, start: horizontal ? event.clientX : event.clientY, sizes };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const group = groupRef.current;
    if (!d || !group) return;
    const length = horizontal ? group.offsetWidth : group.offsetHeight;
    if (!length) return;
    const delta = (((horizontal ? event.clientX : event.clientY) - d.start) / length) * 100;
    resize(d.index, (d.sizes[d.index] ?? 0) + delta, d.sizes);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const forward = horizontal ? 'ArrowRight' : 'ArrowDown';
    const { min, max } = limits(index, sizes);
    const current = sizes[index] ?? 0;
    const target = (
      {
        [back]: current - keyboardStep,
        [forward]: current + keyboardStep,
        Home: min,
        End: max,
      } as Record<string, number>
    )[event.key];
    if (target == null) return;
    event.preventDefault();
    resize(index, target);
  };

  return (
    <div
      ref={groupRef}
      data-orientation={orientation}
      className={cx('pxl-resizable', className)}
      {...rest}
    >
      {panels.map((panel, index) => {
        const panelId = `${id}-${index}`;
        const own = panelProps(panel);
        const { min, max } =
          index < panels.length - 1 ? limits(index, sizes) : { min: 0, max: 100 };
        return (
          <Fragment key={panel.key ?? index}>
            {cloneElement(panel as ReactElement<ResizablePanelProps>, {
              id: own.id ?? panelId,
              style: { ...own.style, flex: `${sizes[index]} 1 0px` },
            })}
            {index < panels.length - 1 && (
              <div
                role="separator"
                tabIndex={0}
                aria-label={handleLabel}
                aria-orientation={horizontal ? 'vertical' : 'horizontal'}
                aria-controls={own.id ?? panelId}
                aria-valuenow={Math.round(sizes[index] ?? 0)}
                aria-valuemin={Math.round(min)}
                aria-valuemax={Math.round(max)}
                className="pxl-resizable__handle"
                onPointerDown={handlePointerDown(index)}
                onPointerMove={handlePointerMove}
                onPointerUp={() => {
                  drag.current = null;
                }}
                onLostPointerCapture={() => {
                  drag.current = null;
                }}
                onKeyDown={handleKeyDown(index)}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
