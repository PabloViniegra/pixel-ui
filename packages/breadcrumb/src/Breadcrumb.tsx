import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface BreadcrumbProps extends ComponentPropsWithRef<'nav'> {
  /** @default 'Breadcrumb' */
  label?: string;
}

/** Path to the current page. Separators are drawn in CSS, not read aloud. */
export function Breadcrumb({
  label = 'Breadcrumb',
  className,
  children,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cx('pxl-breadcrumb', className)} {...rest}>
      <ol className="pxl-breadcrumb__list">{children}</ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends Omit<ComponentPropsWithRef<'li'>, 'children'> {
  /** Renders a plain link. For a router link, pass it as `children` instead. */
  href?: string;
  /** Marks the last crumb as the current page. */
  current?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function BreadcrumbItem({
  href,
  current = false,
  icon,
  className,
  children,
  ...rest
}: BreadcrumbItemProps) {
  const content = (
    <>
      {icon != null && (
        <span className="pxl-breadcrumb__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </>
  );
  return (
    <li className={cx('pxl-breadcrumb__item', className)} {...rest}>
      {current ? (
        <span className="pxl-breadcrumb__current" aria-current="page">
          {content}
        </span>
      ) : href != null ? (
        <a className="pxl-breadcrumb__link" href={href}>
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}
