import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface TimelineProps extends ComponentPropsWithRef<'ol'> {}

/** Chronological list of events joined by a rail. */
export function Timeline({ className, ...rest }: TimelineProps) {
  return <ol className={cx('pxl-timeline', className)} {...rest} />;
}

export interface TimelineItemProps extends Omit<ComponentPropsWithRef<'li'>, 'title'> {
  title: ReactNode;
  /** Displayed timestamp, e.g. `2h ago`. */
  time?: ReactNode;
  /** Machine-readable value for `time`, e.g. an ISO date. */
  dateTime?: string;
  /** Replaces the square marker. */
  icon?: ReactNode;
  /** @default 'default' */
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}

export function TimelineItem({
  title,
  time,
  dateTime,
  icon,
  tone = 'default',
  className,
  children,
  ...rest
}: TimelineItemProps) {
  return (
    <li
      data-tone={tone === 'default' ? undefined : tone}
      data-icon={icon != null || undefined}
      className={cx('pxl-timeline__item', className)}
      {...rest}
    >
      <span className="pxl-timeline__marker" aria-hidden="true">
        {icon}
      </span>
      <div className="pxl-timeline__body">
        <div className="pxl-timeline__header">
          <span className="pxl-timeline__title">{title}</span>
          {time != null && (
            <time className="pxl-timeline__time" dateTime={dateTime}>
              {time}
            </time>
          )}
        </div>
        {children != null && <div className="pxl-timeline__content">{children}</div>}
      </div>
    </li>
  );
}
