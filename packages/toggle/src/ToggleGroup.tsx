'use client';

import {
  cx,
  nextIndex,
  type Orientation,
  type PixelSize,
  useControllableState,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  createContext,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  use,
  useRef,
} from 'react';

interface GroupContextValue {
  value: string[];
  toggle: (item: string) => void;
  size: PixelSize;
}

const GroupContext = createContext<GroupContextValue | null>(null);

function buttons(group: HTMLElement | null) {
  return Array.from(group?.querySelectorAll<HTMLButtonElement>('.pxl-toggle') ?? []);
}

export interface ToggleGroupProps
  extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** `single` keeps at most one item pressed. @default 'single' */
  type?: 'single' | 'multiple';
  /** Pressed item values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** @default 'horizontal' */
  orientation?: Orientation;
  /** @default 'md' */
  size?: PixelSize;
}

/** A set of toggles behind one tab stop; arrow keys, Home and End move between them. */
export function ToggleGroup({
  type = 'single',
  value: valueProp,
  defaultValue = [],
  onValueChange,
  orientation = 'horizontal',
  size = 'md',
  className,
  onKeyDown,
  onFocus,
  ref,
  ...rest
}: ToggleGroupProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const groupRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(groupRef, ref);

  const toggle = (item: string) => {
    if (value.includes(item)) setValue(value.filter((v) => v !== item));
    else setValue(type === 'single' ? [item] : [...value, item]);
  };

  useIsomorphicLayoutEffect(() => {
    const list = buttons(groupRef.current).filter((b) => !b.disabled);
    if (list.includes(document.activeElement as HTMLButtonElement)) return;
    const current = list.find((b) => b.getAttribute('aria-pressed') === 'true') ?? list[0];
    for (const b of list) b.tabIndex = b === current ? 0 : -1;
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const list = buttons(groupRef.current);
    const current = list.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;
    const next = nextIndex(
      event.key,
      current,
      list.map((b) => b.disabled),
      orientation,
    );
    if (next == null) return;
    event.preventDefault();
    list[next]?.focus();
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    const target = event.target as HTMLElement;
    const list = buttons(groupRef.current);
    if (!list.some((b) => b === target)) return;
    for (const b of list) b.tabIndex = b === target ? 0 : -1;
  };

  return (
    <GroupContext value={{ value, toggle, size }}>
      <div
        ref={mergedRef}
        role="toolbar"
        aria-orientation={orientation}
        className={cx('pxl-toggle-group', className)}
        data-orientation={orientation}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...rest}
      />
    </GroupContext>
  );
}

export interface ToggleGroupItemProps extends Omit<ComponentPropsWithRef<'button'>, 'value'> {
  value: string;
  icon?: ReactNode;
}

export function ToggleGroupItem({
  value,
  icon,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ToggleGroupItemProps) {
  const group = use(GroupContext);
  if (!group) throw new Error('ToggleGroupItem must be used inside ToggleGroup');
  const pressed = group.value.includes(value);
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cx('pxl-toggle', className)}
      data-size={group.size}
      data-state={pressed ? 'on' : 'off'}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) group.toggle(value);
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
