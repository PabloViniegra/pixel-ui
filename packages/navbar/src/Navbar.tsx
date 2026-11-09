'use client';

import { cx, nextIndex, useDismiss, useIsomorphicLayoutEffect } from '@pablo-v/core';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  createContext,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  use,
  useId,
  useRef,
  useState,
} from 'react';

interface NavbarContextValue {
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  closeAll: () => void;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

const TOP_LEVEL = ':scope > li > :is(a, button)';

export interface NavbarProps extends ComponentPropsWithRef<'nav'> {
  /** Logo or product name at the start. */
  brand?: ReactNode;
  /** Controls at the end, e.g. a sign-in button. */
  actions?: ReactNode;
  /** Accessible name of the narrow-screen menu button. @default 'Menu' */
  toggleLabel?: string;
}

/**
 * Site navigation bar. Menus are disclosure buttons that reveal a list of
 * links; below 640px of width the links collapse behind a menu button.
 */
export function Navbar({
  brand,
  actions,
  toggleLabel = 'Menu',
  className,
  children,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: NavbarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useDismiss(expanded, () => {
    setExpanded(false);
    if (barRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
  }, [barRef]);

  const closeAll = () => {
    setOpenMenu(null);
    setExpanded(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(TOP_LEVEL));
    const current = items.indexOf(event.target as HTMLElement);
    if (current < 0) return;
    const next = nextIndex(
      event.key,
      current,
      items.map(() => false),
      'horizontal',
    );
    if (next == null) return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <NavbarContext value={{ openMenu, setOpenMenu, closeAll }}>
      <nav aria-label={ariaLabel} className={cx('pxl-navbar', className)} {...rest}>
        <div ref={barRef} className="pxl-navbar__bar" data-expanded={expanded || undefined}>
          {brand != null && <div className="pxl-navbar__brand">{brand}</div>}
          <button
            ref={toggleRef}
            type="button"
            className="pxl-navbar__toggle"
            aria-label={toggleLabel}
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <CloseIcon /> : <MenuIcon />}
          </button>
          <ul id={listId} className="pxl-navbar__list" onKeyDown={handleKeyDown}>
            {children}
          </ul>
          {actions != null && <div className="pxl-navbar__actions">{actions}</div>}
        </div>
      </nav>
    </NavbarContext>
  );
}

export interface NavbarLinkProps extends ComponentPropsWithRef<'a'> {
  /** Marks the link as the current page (`aria-current="page"`). */
  current?: boolean;
}

export function NavbarLink({ current, className, onClick, ...rest }: NavbarLinkProps) {
  const navbar = use(NavbarContext);
  return (
    <li className="pxl-navbar__item">
      <a
        aria-current={current ? 'page' : undefined}
        className={cx('pxl-navbar__link', className)}
        onClick={(event) => {
          onClick?.(event);
          navbar?.closeAll();
        }}
        {...rest}
      />
    </li>
  );
}

export interface NavbarMenuProps extends Omit<ComponentPropsWithRef<'li'>, 'children'> {
  /** Text of the button that reveals the links. */
  label: ReactNode;
  /** Highlights the button when one of its links is the current page. */
  current?: boolean;
  children: ReactNode;
}

/** Disclosure button with a panel of `NavbarMenuLink`s. */
export function NavbarMenu({
  label,
  current,
  className,
  children,
  onBlur,
  ...rest
}: NavbarMenuProps) {
  const navbar = use(NavbarContext);
  const id = useId();
  const itemRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const open = navbar?.openMenu === id;
  const focusFirst = useRef(false);

  const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []);

  const close = (returnFocus: boolean) => {
    navbar?.setOpenMenu(null);
    if (returnFocus) buttonRef.current?.focus();
  };

  useDismiss(open, () => close(!!itemRef.current?.contains(document.activeElement)), [itemRef]);
  useIsomorphicLayoutEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    links()[0]?.focus();
  }, [open]);

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    if (open) links()[0]?.focus();
    else {
      focusFirst.current = true;
      navbar?.setOpenMenu(id);
    }
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const list = links();
    const next = nextIndex(
      event.key,
      list.indexOf(event.target as HTMLElement),
      list.map(() => false),
    );
    if (next == null) return;
    event.preventDefault();
    list[next]?.focus();
  };

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    onBlur?.(event);
    if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) close(false);
  };

  return (
    <li
      ref={itemRef}
      className={cx('pxl-navbar__item', 'pxl-navbar__menu', className)}
      data-open={open || undefined}
      {...rest}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        className="pxl-navbar__link pxl-navbar__trigger"
        aria-expanded={open}
        aria-controls={id}
        data-current={current || undefined}
        onClick={() => navbar?.setOpenMenu(open ? null : id)}
        onKeyDown={handleButtonKeyDown}
      >
        {label}
        <ChevronDownIcon className="pxl-navbar__chevron" />
      </button>
      <ul
        ref={panelRef}
        id={id}
        className="pxl-navbar__panel"
        hidden={!open}
        onKeyDown={handlePanelKeyDown}
      >
        {children}
      </ul>
    </li>
  );
}

export interface NavbarMenuLinkProps extends ComponentPropsWithRef<'a'> {
  /** Secondary line under the label. */
  description?: ReactNode;
  icon?: ReactNode;
  current?: boolean;
}

export function NavbarMenuLink({
  description,
  icon,
  current,
  className,
  children,
  onClick,
  ...rest
}: NavbarMenuLinkProps) {
  const navbar = use(NavbarContext);
  return (
    <li>
      <a
        aria-current={current ? 'page' : undefined}
        className={cx('pxl-navbar__menu-link', className)}
        onClick={(event) => {
          onClick?.(event);
          navbar?.closeAll();
        }}
        {...rest}
      >
        {icon != null && (
          <span className="pxl-navbar__menu-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="pxl-navbar__menu-text">
          <span className="pxl-navbar__menu-label">{children}</span>
          {description != null && (
            <span className="pxl-navbar__menu-description">{description}</span>
          )}
        </span>
      </a>
    </li>
  );
}
