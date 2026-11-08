import { cx } from '@pablo-v/core';
import { ExternalLinkIcon } from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef } from 'react';

export interface LinkProps extends ComponentPropsWithRef<'a'> {
  /** `muted` suits footers and secondary text. @default 'default' */
  tone?: 'default' | 'muted';
  /** @default 'hover' */
  underline?: 'always' | 'hover';
  /**
   * Opens in a new tab with `rel="noopener noreferrer"`, shows the external
   * icon and tells screen readers. Defaults to `true` for `target="_blank"`.
   */
  external?: boolean;
  /** Announced after the label of external links. @default '(opens in a new tab)' */
  externalLabel?: string;
}

/** Native `<a>`. For router links, style yours with the `pxl-link` class. */
export function Link({
  tone = 'default',
  underline = 'hover',
  external,
  externalLabel = '(opens in a new tab)',
  target,
  rel,
  className,
  children,
  ...rest
}: LinkProps) {
  const isExternal = external ?? target === '_blank';
  return (
    <a
      className={cx('pxl-link', className)}
      data-tone={tone}
      data-underline={underline}
      target={isExternal ? (target ?? '_blank') : target}
      rel={isExternal ? cx(rel, 'noopener noreferrer') : rel}
      {...rest}
    >
      {children}
      {isExternal && (
        <>
          {' '}
          <ExternalLinkIcon className="pxl-link__icon" />
          <span className="pxl-link__sr">{externalLabel}</span>
        </>
      )}
    </a>
  );
}
