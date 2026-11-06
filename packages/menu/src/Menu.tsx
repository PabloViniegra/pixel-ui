'use client';

import {
  type Align,
  cloneTrigger,
  cx,
  nextIndex,
  type Side,
  useControllableState,
  useDismiss,
  useFloating,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  createContext,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  use,
  useId,
  useRef,
} from 'react';

const ITEM = '[role="menuitem"]';

const MenuContext = createContext<{ close: () => void } | null>(null);

function items(menu: HTMLElement | null): HTMLElement[] {
  return menu ? Array.from(menu.querySelectorAll<HTMLElement>(ITEM)) : [];
}

function focusItem(menu: HTMLElement | null, which: 'first' | 'last') {
  const list = items(menu).filter((el) => el.getAttribute('aria-disabled') !== 'true');
  (which === 'first' ? list[0] : list.at(-1))?.focus();
}

export interface MenuProps extends ComponentPropsWithRef<'div'> {}

/** A list of actions with arrow-key navigation and type-to-select. */
export function Menu({ className, onKeyDown, onFocus, ref, ...rest }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(menuRef, ref);
  const inDropdown = use(MenuContext) != null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const list = items(menuRef.current);
    const current = list.indexOf(document.activeElement as HTMLElement);
    const disabled = list.map((el) => el.getAttribute('aria-disabled') === 'true');
    const next = nextIndex(event.key, current, disabled);
    if (next != null) {
      event.preventDefault();
      list[next]?.focus();
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key) && !event.metaKey && !event.ctrlKey) {
      const char = event.key.toLowerCase();
      for (let i = 1; i <= list.length; i++) {
        const index = (current + i) % list.length;
        const el = list[index];
        if (!disabled[index] && el?.textContent?.trim().toLowerCase().startsWith(char)) {
          el.focus();
          break;
        }
      }
    }
  };

  return (
    <div
      ref={mergedRef}
      role="menu"
      aria-orientation="vertical"
      tabIndex={inDropdown ? -1 : 0}
      className={cx('pxl-menu', className)}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        onFocus?.(event);
        if (event.target === event.currentTarget && !inDropdown)
          focusItem(menuRef.current, 'first');
      }}
      {...rest}
    />
  );
}

export interface MenuItemProps extends Omit<ComponentPropsWithRef<'button'>, 'onSelect'> {
  /** Runs on click or Enter. Call `event.preventDefault()` to keep a dropdown open. */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  /** Keyboard hint shown at the end, e.g. `⌘D`. */
  shortcut?: ReactNode;
  /** @default 'default' */
  tone?: 'default' | 'danger';
}

export function MenuItem({
  onSelect,
  icon,
  shortcut,
  tone = 'default',
  disabled,
  className,
  children,
  onClick,
  onPointerMove,
  ...rest
}: MenuItemProps) {
  const menu = use(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-tone={tone === 'danger' ? tone : undefined}
      className={cx('pxl-menu__item', className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!disabled && document.activeElement !== event.currentTarget)
          event.currentTarget.focus();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (disabled || event.defaultPrevented) return;
        onSelect?.(event);
        if (!event.defaultPrevented) menu?.close();
      }}
      {...rest}
    >
      {icon != null && (
        <span className="pxl-menu__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="pxl-menu__label">{children}</span>
      {shortcut != null && (
        <span className="pxl-menu__shortcut" aria-hidden="true">
          {shortcut}
        </span>
      )}
    </button>
  );
}

export interface MenuGroupProps extends ComponentPropsWithRef<'div'> {
  label: ReactNode;
}

export function MenuGroup({ label, className, children, ...rest }: MenuGroupProps) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className={cx('pxl-menu__group', className)} {...rest}>
      <div id={id} className="pxl-menu__group-label">
        {label}
      </div>
      {children}
    </div>
  );
}

export function MenuSeparator({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div role="separator" className={cx('pxl-menu__separator', className)} {...rest} />;
}

export interface DropdownProps extends Omit<MenuProps, 'children'> {
  /** Button that opens the menu. ArrowDown / ArrowUp open it on the first / last item. */
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'bottom' */
  side?: Side;
  /** @default 'start' */
  align?: Align;
}

/** A `Menu` that opens from a trigger button and closes after an action. */
export function Dropdown({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  className,
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const anchorRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<'first' | 'last'>('first');
  const id = useId();

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) anchorRef.current?.focus();
  };

  useFloating({ open, anchorRef, floatingRef, side, align, offset: 4 });
  useDismiss(open, () => close(floatingRef.current?.contains(document.activeElement)), [
    anchorRef,
    floatingRef,
  ]);
  useIsomorphicLayoutEffect(() => {
    if (open) focusItem(floatingRef.current, initialFocus.current);
  }, [open]);

  const openWith = (which: 'first' | 'last') => {
    initialFocus.current = which;
    setOpen(true);
  };

  return (
    <MenuContext value={{ close }}>
      {cloneTrigger(trigger, {
        ref: anchorRef,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        onClick: () => (open ? close(false) : openWith('first')),
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openWith(event.key === 'ArrowDown' ? 'first' : 'last');
          }
        },
      })}
      {open && (
        <Menu
          ref={floatingRef}
          id={id}
          popover="manual"
          className={cx('pxl-menu--floating', className)}
          onKeyDown={(event) => {
            if (event.key === 'Tab') close(false);
          }}
          {...rest}
        >
          {children}
        </Menu>
      )}
    </MenuContext>
  );
}
