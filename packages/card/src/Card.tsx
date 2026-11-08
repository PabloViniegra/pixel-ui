import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef } from 'react';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  /**
   * Raises the card on hover and focus.
   * @deprecated Put a `CardLink` inside instead: it gives the card the same
   * styles plus a real link and a pointer cursor.
   */
  interactive?: boolean;
  /** Draws the border in the accent colour. */
  highlight?: boolean;
}

/** Bordered container. Compose with the header, title, description, content and footer parts. */
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

export interface CardTitleProps extends ComponentPropsWithRef<'h3'> {
  /** Sets the title in Geist Pixel. Keep it for a single featured card per view. */
  pixel?: boolean;
}

export function CardTitle({ pixel = false, className, ...rest }: CardTitleProps) {
  return (
    <h3 className={cx('pxl-card__title', className)} data-pixel={pixel || undefined} {...rest} />
  );
}

/** Makes the whole card clickable. For router links, add the `pxl-card__link` class to yours. */
export function CardLink({ className, ...rest }: ComponentPropsWithRef<'a'>) {
  return <a className={cx('pxl-card__link', className)} {...rest} />;
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
