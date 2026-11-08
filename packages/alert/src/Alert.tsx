import { cx, type PixelTone } from '@pablo-v/core';
import {
  CloseIcon,
  ErrorIcon,
  InfoIcon,
  type PixelIcon,
  SuccessIcon,
  WarningIcon,
} from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const ICONS: Record<PixelTone, PixelIcon> = {
  neutral: InfoIcon,
  accent: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: ErrorIcon,
};

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Colour intent. @default 'neutral' */
  tone?: PixelTone;
  title?: ReactNode;
  /** Replaces the tone icon; `false` hides it. */
  icon?: ReactNode | false;
  /** Button or link shown at the end, e.g. "Retry". */
  action?: ReactNode;
  /** Shows a close button that calls it. */
  onDismiss?: () => void;
  /** Accessible name of the close button. @default 'Dismiss' */
  dismissLabel?: string;
}

/**
 * Inline message that stays in the page flow. Warning and danger alerts use
 * `role="alert"` so they are announced; the rest use `role="status"`.
 */
export function Alert({
  tone = 'neutral',
  title,
  icon,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  ...rest
}: AlertProps) {
  const Icon = ICONS[tone];
  return (
    <div
      role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'}
      className={cx('pxl-alert', className)}
      data-tone={tone}
      {...rest}
    >
      {icon !== false && (
        <span className="pxl-alert__icon" aria-hidden="true">
          {icon ?? <Icon />}
        </span>
      )}
      <div className="pxl-alert__content">
        {title != null && <p className="pxl-alert__title">{title}</p>}
        {children != null && <div className="pxl-alert__description">{children}</div>}
      </div>
      {action != null && <div className="pxl-alert__action">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          className="pxl-alert__close"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
