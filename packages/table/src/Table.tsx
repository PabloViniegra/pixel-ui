import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef } from 'react';

export interface TableProps extends ComponentPropsWithRef<'table'> {
  /** @default 'default' */
  density?: 'compact' | 'default';
  /** Header stays visible while the wrapper scrolls vertically. */
  stickyHeader?: boolean;
}

/** Data table. Wide tables scroll inside their own box instead of the page. */
export function Table({
  density = 'default',
  stickyHeader = false,
  className,
  style,
  ...rest
}: TableProps) {
  return (
    <div
      className={cx('pxl-table', className)}
      style={style}
      data-density={density}
      data-sticky={stickyHeader || undefined}
    >
      <table className="pxl-table__table" {...rest} />
    </div>
  );
}

export function TableCaption({ className, ...rest }: ComponentPropsWithRef<'caption'>) {
  return <caption className={cx('pxl-table__caption', className)} {...rest} />;
}

export function TableHead({ className, ...rest }: ComponentPropsWithRef<'thead'>) {
  return <thead className={cx('pxl-table__head', className)} {...rest} />;
}

export function TableBody({ className, ...rest }: ComponentPropsWithRef<'tbody'>) {
  return <tbody className={cx('pxl-table__body', className)} {...rest} />;
}

export function TableFooter({ className, ...rest }: ComponentPropsWithRef<'tfoot'>) {
  return <tfoot className={cx('pxl-table__foot', className)} {...rest} />;
}

export interface TableRowProps extends ComponentPropsWithRef<'tr'> {
  /** Highlights the row. Visual only: pair it with a checkbox or text for assistive tech. */
  selected?: boolean;
}

export function TableRow({ selected, className, ...rest }: TableRowProps) {
  return (
    <tr
      className={cx('pxl-table__row', className)}
      data-selected={selected || undefined}
      {...rest}
    />
  );
}

type Align = 'start' | 'center' | 'end';

export interface TableHeaderProps extends Omit<ComponentPropsWithRef<'th'>, 'align'> {
  align?: Align;
}

export function TableHeader({ align, scope = 'col', className, ...rest }: TableHeaderProps) {
  return (
    <th scope={scope} className={cx('pxl-table__th', className)} data-align={align} {...rest} />
  );
}

export interface TableCellProps extends Omit<ComponentPropsWithRef<'td'>, 'align'> {
  align?: Align;
  /** Monospace with tabular figures, for ids, hashes and numbers. */
  mono?: boolean;
}

export function TableCell({ align, mono, className, ...rest }: TableCellProps) {
  return (
    <td
      className={cx('pxl-table__td', className)}
      data-align={align}
      data-mono={mono || undefined}
      {...rest}
    />
  );
}
