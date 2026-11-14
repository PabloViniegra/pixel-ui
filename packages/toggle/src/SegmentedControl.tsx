'use client';

import {
  cx,
  nextIndex,
  type PixelSize,
  useControllableState,
  useIsomorphicLayoutEffect,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'md' */
  size?: PixelSize;
  /** Stretches the segments to fill the container. */
  fullWidth?: boolean;
}

/**
 * Exclusive choice between a few options (`radiogroup`). Arrow keys move and
 * select; the selected segment's surface slides between options.
 */
export function SegmentedControl({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  fullWidth = false,
  className,
  onKeyDown,
  ...rest
}: SegmentedControlProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? options.find((o) => !o.disabled)?.value ?? '',
    onChange: onValueChange,
  });
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<CSSProperties>();
  const selected = options.findIndex((o) => o.value === value);
  const tabStop = selected >= 0 ? selected : options.findIndex((o) => !o.disabled);

  useIsomorphicLayoutEffect(() => {
    const list = listRef.current;
    const update = () => {
      const item = list?.querySelector<HTMLElement>('[aria-checked="true"]');
      if (!item) return setIndicator(undefined);
      setIndicator({
        '--_x': `${item.offsetLeft}px`,
        '--_w': `${item.offsetWidth}px`,
      } as CSSProperties);
    };
    update();
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const next = nextIndex(
      event.key,
      tabStop,
      options.map((o) => !!o.disabled),
      'horizontal',
    );
    const option = next == null ? undefined : options[next];
    if (next == null || !option) return;
    event.preventDefault();
    setValue(option.value);
    listRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="radiogroup"
      className={cx('pxl-segmented', className)}
      data-size={size}
      data-full-width={fullWidth || undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {indicator && (
        <span className="pxl-segmented__indicator" style={indicator} aria-hidden="true" />
      )}
      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={i === tabStop ? 0 : -1}
          disabled={option.disabled}
          className="pxl-segmented__option"
          onClick={() => setValue(option.value)}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
