'use client';

import { cx, useMergedRefs, usePrefersReducedMotion } from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface PixelImageProps extends Omit<ComponentPropsWithRef<'img'>, 'src' | 'alt'> {
  src: string;
  /** Required: describe the image, or pass `""` if it is decorative. */
  alt: string;
  /** Block sizes in px, coarse to fine, shown before the real image. @default [32, 16, 8, 4] */
  steps?: readonly number[];
  /** Time each mosaic step stays on screen, in ms. @default 110 */
  stepDuration?: number;
}

type State = 'loading' | 'resolving' | 'loaded' | 'error';

/** Draws `img` into `canvas` as a mosaic of `block`-px squares, cropped like object-fit: cover. */
function drawMosaic(canvas: HTMLCanvasElement, img: HTMLImageElement, block: number): boolean {
  const { width, height } = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');
  if (!ctx || !width || !height || !img.naturalWidth) return false;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const cols = Math.max(1, Math.round(width / block));
  const rows = Math.max(1, Math.round(height / block));
  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;

  const small = document.createElement('canvas');
  small.width = cols;
  small.height = rows;
  const sctx = small.getContext('2d');
  if (!sctx) return false;
  sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  return true;
}

/**
 * Image that arrives as a coarse pixel mosaic and sharpens step by step to the
 * real resolution. With reduced motion it simply fades in.
 */
export function PixelImage({
  src,
  alt,
  steps = [32, 16, 8, 4],
  stepDuration = 110,
  width,
  height,
  className,
  style,
  onLoad,
  onError,
  ref,
  ...rest
}: PixelImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const mergedRef = useMergedRefs(imgRef, ref);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [state, setState] = useState<State>('loading');
  const reduced = usePrefersReducedMotion();

  const resolve = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    clearTimeout(timer.current);
    if (!img || !canvas || reduced || steps.length === 0) return setState('loaded');
    let i = 0;
    const next = () => {
      const block = steps[i];
      if (block == null || !drawMosaic(canvas, img, block)) return setState('loaded');
      setState('resolving');
      i++;
      timer.current = setTimeout(next, stepDuration);
    };
    next();
  }, [reduced, steps, stepDuration]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: restart only when the source changes
  useEffect(() => {
    setState('loading');
    const img = imgRef.current;
    // Cached images can finish before hydration attaches onLoad.
    if (img?.complete && img.naturalWidth) resolve();
    return () => clearTimeout(timer.current);
  }, [src]);

  return (
    <span
      className={cx('pxl-image', className)}
      data-state={state}
      style={
        {
          ...(width && height ? { aspectRatio: `${width} / ${height}` } : null),
          ...style,
        } as CSSProperties
      }
    >
      <img
        ref={mergedRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="pxl-image__img"
        onLoad={(event) => {
          onLoad?.(event);
          resolve();
        }}
        onError={(event) => {
          onError?.(event);
          setState('error');
        }}
        {...rest}
      />
      <canvas ref={canvasRef} className="pxl-image__mosaic" aria-hidden="true" />
    </span>
  );
}
