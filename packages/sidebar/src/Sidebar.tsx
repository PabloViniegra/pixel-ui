'use client';

import { cx, useControllableState } from '@pablo-v/core';
import { ChevronLeftIcon } from '@pablo-v/pixel-icons';
import { type ComponentPropsWithRef, createContext, type ReactNode, use, useId } from 'react';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  id: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar(part: string) {
  const ctx = use(SidebarContext);
  if (!ctx) throw new Error(`${part} must be used inside Sidebar`);
  return ctx;
}

export interface SidebarProps extends ComponentPropsWithRef<'aside'> {
  /** Shrinks to an icon rail; labels stay available to assistive tech. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

/** Application side navigation that can collapse to an icon rail. */
export function Sidebar({
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  id: idProp,
  ...rest
}: SidebarProps) {
  const [collapsed, setCollapsed] = useControllableState({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });
  const generatedId = useId();
  const id = idProp ?? generatedId;
  return (
    <SidebarContext value={{ collapsed, setCollapsed, id }}>
      <aside
        id={id}
        className={cx('pxl-sidebar', className)}
        data-collapsed={collapsed || undefined}
        {...rest}
      />
    </SidebarContext>
  );
}

export function SidebarHeader({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('pxl-sidebar__header', className)} {...rest} />;
}

/** Scrollable middle section; wraps the groups in a `<nav>`. Give it an `aria-label`. */
export function SidebarContent({ className, ...rest }: ComponentPropsWithRef<'nav'>) {
  return <nav className={cx('pxl-sidebar__content', className)} {...rest} />;
}

export function SidebarFooter({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('pxl-sidebar__footer', className)} {...rest} />;
}

export interface SidebarGroupProps extends ComponentPropsWithRef<'div'> {
  label?: ReactNode;
}

export function SidebarGroup({ label, className, children, ...rest }: SidebarGroupProps) {
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={label != null ? id : undefined}
      className={cx('pxl-sidebar__group', className)}
      {...rest}
    >
      {label != null && (
        <div id={id} className="pxl-sidebar__group-label">
          {label}
        </div>
      )}
      <ul className="pxl-sidebar__list">{children}</ul>
    </div>
  );
}

interface SidebarItemBaseProps {
  icon?: ReactNode;
  /** Marks the current page (`aria-current="page"`). */
  current?: boolean;
  /** Trailing count or tag, hidden when collapsed. */
  badge?: ReactNode;
  children: ReactNode;
}

export type SidebarItemProps = SidebarItemBaseProps &
  (
    | ({ href: string } & Omit<ComponentPropsWithRef<'a'>, 'children'>)
    | ({ href?: undefined } & Omit<ComponentPropsWithRef<'button'>, 'children'>)
  );

/** Navigation row: a link with `href`, otherwise a button. */
export function SidebarItem({
  icon,
  current,
  badge,
  children,
  className,
  ...rest
}: SidebarItemProps) {
  const { collapsed } = useSidebar('SidebarItem');
  const content = (
    <>
      {icon != null && (
        <span className="pxl-sidebar__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="pxl-sidebar__label">{children}</span>
      {badge != null && <span className="pxl-sidebar__badge">{badge}</span>}
    </>
  );
  const shared = {
    className: cx('pxl-sidebar__item', className),
    'aria-current': current ? ('page' as const) : undefined,
    title: collapsed && typeof children === 'string' ? children : undefined,
  };
  return (
    <li>
      {rest.href != null ? (
        <a {...shared} {...(rest as ComponentPropsWithRef<'a'>)}>
          {content}
        </a>
      ) : (
        <button type="button" {...shared} {...(rest as ComponentPropsWithRef<'button'>)}>
          {content}
        </button>
      )}
    </li>
  );
}

export interface SidebarToggleProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  /** @default 'Collapse sidebar' / 'Expand sidebar' */
  label?: string;
}

/** Collapses and expands the surrounding `Sidebar`. */
export function SidebarToggle({ label, className, onClick, ...rest }: SidebarToggleProps) {
  const { collapsed, setCollapsed, id } = useSidebar('SidebarToggle');
  return (
    <button
      type="button"
      className={cx('pxl-sidebar__toggle', className)}
      aria-label={label ?? (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
      aria-expanded={!collapsed}
      aria-controls={id}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setCollapsed(!collapsed);
      }}
      {...rest}
    >
      <ChevronLeftIcon />
    </button>
  );
}
