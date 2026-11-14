'use client';

import { cx } from '@pablo-v/core';
import { Children, type ComponentPropsWithRef, type ReactNode, useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Person or entity shown; names the avatar and feeds the initials fallback. */
  name: string;
  src?: string;
  /** Replaces the initials when there is no image or it fails to load. */
  fallback?: ReactNode;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default 'circle' */
  shape?: 'circle' | 'square';
  /** Presence cell in the corner, announced with the name. */
  status?: AvatarStatus;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return letters.map((w) => Array.from(w ?? '')[0]?.toUpperCase()).join('');
}

/** Profile picture with an initials fallback while loading or on error. */
export function Avatar({
  name,
  src,
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  className,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState<string>();
  const [loaded, setLoaded] = useState<string>();
  const showImage = src != null && failed !== src;

  return (
    <span
      role="img"
      aria-label={status ? `${name} (${status})` : name}
      className={cx('pxl-avatar', className)}
      data-size={size}
      data-shape={shape}
      {...rest}
    >
      {(!showImage || loaded !== src) && (
        <span className="pxl-avatar__fallback" aria-hidden="true">
          {fallback ?? initials(name)}
        </span>
      )}
      {showImage && (
        <img
          className="pxl-avatar__image"
          src={src}
          alt=""
          data-loaded={loaded === src || undefined}
          ref={(img) => {
            // Cached images can finish before hydration attaches onLoad.
            if (img?.complete) img.naturalWidth ? setLoaded(src) : setFailed(src);
          }}
          onLoad={() => setLoaded(src)}
          onError={() => setFailed(src)}
        />
      )}
      {status && <span className="pxl-avatar__status" data-status={status} aria-hidden="true" />}
    </span>
  );
}

export interface AvatarGroupProps extends ComponentPropsWithRef<'div'> {
  /** Avatars beyond this count collapse into a "+N" chip. */
  max?: number;
  /** Size of the overflow chip; match the avatars. @default 'md' */
  size?: AvatarSize;
}

/** Overlapping row of avatars. */
export function AvatarGroup({ max, size = 'md', className, children, ...rest }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = max != null && items.length > max ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <div role="group" className={cx('pxl-avatar-group', className)} {...rest}>
      {visible}
      {hidden > 0 && (
        <span
          role="img"
          aria-label={`${hidden} more`}
          className="pxl-avatar pxl-avatar__more"
          data-size={size}
          data-shape="circle"
        >
          <span className="pxl-avatar__fallback" aria-hidden="true">
            +{hidden}
          </span>
        </span>
      )}
    </div>
  );
}
