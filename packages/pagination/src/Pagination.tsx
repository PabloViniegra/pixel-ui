'use client';

import { clamp, cx, type PixelSize, useControllableState } from '@pablo-v/core';
import { ChevronLeftIcon, ChevronRightIcon } from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';

export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

const span = (from: number, to: number) =>
  Array.from({ length: Math.max(to - from + 1, 0) }, (_, i) => from + i);

/**
 * Pages to show for `page` out of `total`. The result always has the same
 * length once truncated, so the control does not jump while paging.
 */
export function paginationRange(
  page: number,
  total: number,
  siblings = 1,
  boundaries = 1,
): PaginationItem[] {
  if (siblings * 2 + 3 + boundaries * 2 >= total) return span(1, total);
  const left = Math.max(page - siblings, boundaries);
  const right = Math.min(page + siblings, total - boundaries);
  const leftDots = left > boundaries + 2;
  const rightDots = right < total - (boundaries + 1);
  if (!leftDots && rightDots) {
    return [
      ...span(1, siblings * 2 + boundaries + 2),
      'end-ellipsis',
      ...span(total - boundaries + 1, total),
    ];
  }
  if (leftDots && !rightDots) {
    return [
      ...span(1, boundaries),
      'start-ellipsis',
      ...span(total - (boundaries + 1 + siblings * 2), total),
    ];
  }
  return [
    ...span(1, boundaries),
    'start-ellipsis',
    ...span(left, right),
    'end-ellipsis',
    ...span(total - boundaries + 1, total),
  ];
}

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange'> {
  total: number;
  /** Current page, 1-based. */
  page?: number;
  /** @default 1 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current one. @default 1 */
  siblings?: number;
  /** Pages always shown at each end. @default 1 */
  boundaries?: number;
  /** Renders links instead of buttons, for routed or server-rendered pages. */
  getHref?: (page: number) => string;
  /** @default 'md' */
  size?: PixelSize;
  /** @default 'Previous' */
  previousLabel?: ReactNode;
  /** @default 'Next' */
  nextLabel?: ReactNode;
  /** Accessible name of each page control. @default (page) => `Page ${page}` */
  pageLabel?: (page: number) => string;
}

/** Previous / next controls around a truncated list of pages. */
export function Pagination({
  total: totalProp,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  getHref,
  size = 'md',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  pageLabel = (page) => `Page ${page}`,
  className,
  'aria-label': ariaLabel = 'Pagination',
  ...rest
}: PaginationProps) {
  const total = Math.max(1, Math.floor(totalProp));
  const [pageState, setPage] = useControllableState({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const page = clamp(pageState, 1, total);

  const control = (
    target: number,
    props: { className: string; disabled?: boolean; current?: boolean; label?: string },
    children: ReactNode,
  ) => {
    const common = {
      className: props.className,
      'aria-label': props.label,
      'aria-current': props.current ? ('page' as const) : undefined,
    };
    const go = (event: MouseEvent) => {
      if (props.disabled || props.current) return;
      if (getHref && (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0))
        return;
      setPage(target);
    };
    if (getHref) {
      return props.disabled ? (
        <a {...common} aria-disabled="true" role="link">
          {children}
        </a>
      ) : (
        <a {...common} href={getHref(target)} onClick={go}>
          {children}
        </a>
      );
    }
    return (
      <button type="button" {...common} disabled={props.disabled} onClick={go}>
        {children}
      </button>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cx('pxl-pagination', className)}
      data-size={size}
      {...rest}
    >
      <ul className="pxl-pagination__list">
        <li>
          {control(
            page - 1,
            { className: 'pxl-pagination__step', disabled: page <= 1 },
            <>
              <ChevronLeftIcon />
              <span className="pxl-pagination__step-label">{previousLabel}</span>
            </>,
          )}
        </li>
        {paginationRange(page, total, siblings, boundaries).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              {control(
                item,
                {
                  className: 'pxl-pagination__page',
                  current: item === page,
                  label: pageLabel(item),
                },
                item,
              )}
            </li>
          ) : (
            <li key={item} className="pxl-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ),
        )}
        <li>
          {control(
            page + 1,
            { className: 'pxl-pagination__step', disabled: page >= total },
            <>
              <span className="pxl-pagination__step-label">{nextLabel}</span>
              <ChevronRightIcon />
            </>,
          )}
        </li>
      </ul>
    </nav>
  );
}
