'use client';

import {
  cloneTrigger,
  cx,
  useControllableState,
  useDismiss,
  useFloating,
  useIsomorphicLayoutEffect,
  usePresence,
} from '@pablo-v/core';
import { Menu, type MenuProps } from '@pablo-v/menu';
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react';

export interface ContextMenuProps extends Omit<MenuProps, 'children' | 'content'> {
  /** The area that opens the menu on right-click, Shift+F10 or the Menu key. */
  children: ReactElement;
  /** `MenuItem`, `MenuGroup` and `MenuSeparator` elements. */
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

/** A `Menu` that opens at the pointer on right-click, or at the target from the keyboard. */
export function ContextMenu({
  children,
  content,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  className,
  onClick,
  onKeyDown,
  ...rest
}: ContextMenuProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = (restore = true) => {
    setOpen(false);
    if (restore) returnFocus.current?.focus();
  };

  useFloating({ open, anchorRef, floatingRef, side: 'bottom', align: 'start', offset: 2 });
  useDismiss(open, () => close(!!floatingRef.current?.contains(document.activeElement)), [
    floatingRef,
  ]);
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    floatingRef.current
      ?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
      ?.focus();
  }, [open, point]);

  const mounted = usePresence(open, floatingRef);

  const openAt = (x: number, y: number) => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : targetRef.current;
    setPoint({ x, y });
    setOpen(true);
  };

  return (
    <>
      {cloneTrigger(children, {
        ref: targetRef,
        onContextMenu: (event: MouseEvent) => {
          if (disabled) return;
          event.preventDefault();
          // Keyboard-fired contextmenu events carry no pointer position.
          if (event.clientX === 0 && event.clientY === 0) {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            openAt(rect.left, rect.bottom);
          } else openAt(event.clientX, event.clientY);
        },
      })}
      {mounted && (
        <>
          <span
            ref={anchorRef}
            className="pxl-context-menu__anchor"
            style={{ left: point.x, top: point.y }}
            aria-hidden="true"
          />
          <Menu
            ref={floatingRef}
            popover="manual"
            tabIndex={-1}
            data-closing={!open || undefined}
            inert={!open || undefined}
            className={cx('pxl-menu--floating', 'pxl-context-menu', className)}
            onClick={(event) => {
              onClick?.(event);
              const item = (event.target as Element).closest('[role="menuitem"]');
              if (!event.defaultPrevented && item?.getAttribute('aria-disabled') !== 'true' && item)
                close();
            }}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              onKeyDown?.(event);
              if (event.key === 'Tab') close(false);
            }}
            {...rest}
          >
            {content}
          </Menu>
        </>
      )}
    </>
  );
}
