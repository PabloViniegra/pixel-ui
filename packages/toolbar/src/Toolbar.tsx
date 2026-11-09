'use client';

import {
  cx,
  nextIndex,
  type Orientation,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  createContext,
  type FocusEvent,
  type KeyboardEvent,
  use,
  useRef,
  useState,
} from 'react';

const ITEM =
  'button, a[href], input, select, textarea, [role="button"], [role="checkbox"], [role="radio"], [role="switch"]';
const TEXT_ENTRY =
  'input:not([type="checkbox"], [type="radio"], [type="button"]), textarea, select';
const CARET_KEYS_H = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
const CARET_KEYS_V = ['Home', 'End'];

const OrientationContext = createContext<Orientation>('horizontal');

// Items inside an open menu or listbox belong to that widget, not the toolbar.
function items(toolbar: HTMLElement | null): HTMLElement[] {
  if (!toolbar) return [];
  return Array.from(toolbar.querySelectorAll<HTMLElement>(ITEM)).filter((el) => {
    const owner = el.closest('[popover], [role="menu"], [role="listbox"]');
    return !(owner && toolbar.contains(owner)) && !el.matches(':disabled');
  });
}

export interface ToolbarProps extends ComponentPropsWithRef<'div'> {
  /** @default 'horizontal' */
  orientation?: Orientation;
}

/**
 * Groups controls behind a single tab stop; arrow keys, Home and End move
 * between them.
 */
export function Toolbar({
  orientation = 'horizontal',
  className,
  onKeyDown,
  onFocus,
  ref,
  ...rest
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(toolbarRef, ref);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const list = items(toolbarRef.current);
    const current = Math.min(active, list.length - 1);
    list.forEach((el, i) => {
      el.tabIndex = i === current ? 0 : -1;
    });
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    // Text fields keep the keys that move their caret.
    const caretKeys = orientation === 'horizontal' ? CARET_KEYS_H : CARET_KEYS_V;
    if (target.matches(TEXT_ENTRY) && caretKeys.includes(event.key)) return;
    const list = items(toolbarRef.current);
    const current = list.indexOf(target);
    if (current < 0) return;
    const next = nextIndex(
      event.key,
      current,
      list.map(() => false),
      orientation,
    );
    if (next == null) return;
    event.preventDefault();
    setActive(next);
    list[next]?.focus();
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    const index = items(toolbarRef.current).indexOf(event.target as HTMLElement);
    if (index >= 0 && index !== active) setActive(index);
  };

  return (
    <OrientationContext value={orientation}>
      <div
        ref={mergedRef}
        role="toolbar"
        aria-orientation={orientation}
        className={cx('pxl-toolbar', className)}
        data-orientation={orientation}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...rest}
      />
    </OrientationContext>
  );
}

export interface ToolbarGroupProps extends ComponentPropsWithRef<'div'> {}

/** A labelled run of related controls. Give it an `aria-label`. */
export function ToolbarGroup({ className, ...rest }: ToolbarGroupProps) {
  return <div role="group" className={cx('pxl-toolbar__group', className)} {...rest} />;
}

export function ToolbarSeparator({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  const orientation = use(OrientationContext);
  return (
    <div
      role="separator"
      aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      className={cx('pxl-toolbar__separator', className)}
      {...rest}
    />
  );
}

export interface ToolbarButtonProps extends ComponentPropsWithRef<'button'> {
  /** Makes it a toggle button (`aria-pressed`). */
  pressed?: boolean;
}

/** Compact ghost button for toolbars. Icon-only buttons need an `aria-label`. */
export function ToolbarButton({
  pressed,
  type = 'button',
  className,
  ...rest
}: ToolbarButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cx('pxl-toolbar__button', className)}
      {...rest}
    />
  );
}
