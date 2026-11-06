'use client';

import {
  cx,
  nextIndex,
  type Orientation,
  useControllableState,
  useIsomorphicLayoutEffect,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  use,
  useId,
  useRef,
  useState,
} from 'react';

interface TabsContextValue {
  id: string;
  value: string;
  setValue: (value: string) => void;
  orientation: Orientation;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return ctx;
}

const slug = (value: string) => value.replace(/[^\w-]/g, '_');

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  /** @default 'horizontal' */
  orientation?: Orientation;
}

export function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  ...rest
}: TabsProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const id = useId();
  return (
    <TabsContext value={{ id, value, setValue, orientation }}>
      <div className={cx('pxl-tabs', className)} data-orientation={orientation} {...rest} />
    </TabsContext>
  );
}

export interface TabListProps extends ComponentPropsWithRef<'div'> {
  /** Accessible name for the tab strip. */
  label?: string;
}

/** Strip of tabs. Arrow keys move and select (automatic activation). */
export function TabList({ label, className, children, onKeyDown, ...rest }: TabListProps) {
  const { value, orientation } = useTabs('TabList');
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<CSSProperties>();

  useIsomorphicLayoutEffect(() => {
    const list = listRef.current;
    const update = () => {
      const tab = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!tab) return setIndicator(undefined);
      setIndicator({
        '--_x': `${tab.offsetLeft}px`,
        '--_y': `${tab.offsetTop}px`,
        '--_w': `${tab.offsetWidth}px`,
        '--_h': `${tab.offsetHeight}px`,
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
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const next = nextIndex(
      event.key,
      current,
      tabs.map((t) => t.disabled),
      orientation,
    );
    if (next == null) return;
    event.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      className={cx('pxl-tabs__list', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
      {indicator && <span className="pxl-tabs__indicator" style={indicator} aria-hidden="true" />}
    </div>
  );
}

export interface TabProps extends Omit<ComponentPropsWithRef<'button'>, 'value'> {
  value: string;
  icon?: ReactNode;
}

export function Tab({ value, icon, className, children, onClick, ...rest }: TabProps) {
  const ctx = useTabs('Tab');
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.id}-tab-${slug(value)}`}
      aria-selected={selected}
      aria-controls={`${ctx.id}-panel-${slug(value)}`}
      tabIndex={selected ? 0 : -1}
      className={cx('pxl-tabs__tab', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setValue(value);
      }}
      {...rest}
    >
      {icon != null && (
        <span className="pxl-tabs__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

export interface TabPanelProps extends ComponentPropsWithRef<'div'> {
  value: string;
}

export function TabPanel({ value, className, ...rest }: TabPanelProps) {
  const ctx = useTabs('TabPanel');
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.id}-panel-${slug(value)}`}
      aria-labelledby={`${ctx.id}-tab-${slug(value)}`}
      tabIndex={0}
      className={cx('pxl-tabs__panel', className)}
      {...rest}
    />
  );
}
