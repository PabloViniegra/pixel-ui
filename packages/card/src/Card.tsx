import { cx } from '@pixel-ui/core';
import type { ComponentPropsWithRef } from 'react';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  /** Lifts with a hard pixel shadow and glitches the title on hover/focus. */
  interactive?: boolean;
  /** Draws an animated "marching pixels" border. */
  highlight?: boolean;
}

/** Container with notched pixel corners and a 1px pixel border. */
export function Card({ interactive = false, highlight = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cx('pxl-card', className)}
      data-interactive={interactive || undefined}
      data-highlight={highlight || undefined}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('pxl-card__header', className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: ComponentPropsWithRef<'h3'>) {
  return <h3 className={cx('pxl-card__title', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: ComponentPropsWithRef<'p'>) {
  return <p className={cx('pxl-card__description', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('pxl-card__content', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('pxl-card__footer', className)} {...rest} />;
}
