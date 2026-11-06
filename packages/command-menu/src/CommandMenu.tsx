'use client';

import {
  cloneTrigger,
  cx,
  useControllableState,
  useIsomorphicLayoutEffect,
  useMergedRefs,
  useModalDialog,
} from '@pablo-v/core';
import { Kbd } from '@pablo-v/kbd';
import { SearchIcon } from '@pablo-v/pixel-icons';
import { ScrambleText } from '@pablo-v/scramble-text';
import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

export interface CommandItem {
  id: string;
  label: string;
  /** Heading the item is listed under. Groups keep their first-seen order. */
  group?: string;
  /** Extra words that match the query but are not shown. */
  keywords?: readonly string[];
  /** Shortcut hint, one key cap per entry. */
  shortcut?: readonly string[];
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandMenuProps
  extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'onSelect' | 'onClose' | 'onCancel'> {
  commands: readonly CommandItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the menu on click. */
  trigger?: ReactElement;
  /** Toggle with ⌘K / Ctrl+K anywhere on the page. @default true */
  hotkey?: boolean;
  /** @default 'Type a command or search…' */
  placeholder?: string;
  /** @default 'No results' */
  emptyMessage?: ReactNode;
  /** Accessible name of the dialog. @default 'Command menu' */
  label?: string;
}

function rank(item: CommandItem, query: string): number {
  if (!query) return 0;
  const label = item.label.toLowerCase();
  if (label.startsWith(query)) return 0;
  if (label.includes(` ${query}`)) return 1;
  if (label.includes(query)) return 2;
  if (item.keywords?.some((k) => k.toLowerCase().includes(query))) return 3;
  return -1;
}

interface Group {
  name: string | undefined;
  items: CommandItem[];
}

function filter(commands: readonly CommandItem[], raw: string): Group[] {
  const query = raw.trim().toLowerCase();
  const groups = new Map<string | undefined, { item: CommandItem; score: number }[]>();
  for (const item of commands) {
    const score = rank(item, query);
    if (score < 0) continue;
    const list = groups.get(item.group) ?? [];
    list.push({ item, score });
    groups.set(item.group, list);
  }
  return Array.from(groups, ([name, list]) => ({
    name,
    items: list.sort((a, b) => a.score - b.score).map((entry) => entry.item),
  }));
}

/**
 * ⌘K command palette on the native `<dialog>`. Results that enter the list
 * decode in with ScrambleText; ones that stay put are left alone.
 */
export function CommandMenu({
  commands,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  hotkey = true,
  placeholder = 'Type a command or search…',
  emptyMessage = 'No results',
  label = 'Command menu',
  className,
  ref,
  ...rest
}: CommandMenuProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const dialogProps = useModalDialog(open, setOpen);
  const mergedRef = useMergedRefs(dialogProps.ref, ref);

  useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkey, open, setOpen]);

  return (
    <>
      {trigger &&
        cloneTrigger(trigger, {
          onClick: () => setOpen(true),
          'aria-haspopup': 'dialog',
          'aria-keyshortcuts': hotkey ? 'Meta+K Control+K' : undefined,
        })}
      <dialog
        {...dialogProps}
        ref={mergedRef}
        className={cx('pxl-command', className)}
        aria-label={label}
        {...rest}
      >
        {open && (
          <CommandPanel
            commands={commands}
            placeholder={placeholder}
            emptyMessage={emptyMessage}
            onDone={() => setOpen(false)}
          />
        )}
      </dialog>
    </>
  );
}

interface PanelProps {
  commands: readonly CommandItem[];
  placeholder: string;
  emptyMessage: ReactNode;
  onDone: () => void;
}

function CommandPanel({ commands, placeholder, emptyMessage, onDone }: PanelProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const groups = useMemo(() => filter(commands, query), [commands, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const enabled = useMemo(() => flat.filter((item) => !item.disabled), [flat]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const active = enabled.find((item) => item.id === activeId) ?? enabled[0];
  const optionId = (item: CommandItem) => `${id}-${item.id}`;
  const activeOptionId = active ? optionId(active) : undefined;

  useIsomorphicLayoutEffect(() => {
    if (activeOptionId)
      document.getElementById(activeOptionId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeOptionId]);

  const move = (delta: number) => {
    if (enabled.length === 0) return;
    const index = active ? enabled.indexOf(active) : -1;
    const next = enabled[(index + delta + enabled.length) % enabled.length];
    setActiveId(next?.id);
  };

  const select = (item: CommandItem | undefined) => {
    if (!item || item.disabled) return;
    onDone();
    item.onSelect?.();
  };

  return (
    <div className="pxl-command__panel">
      <div className="pxl-command__search">
        <SearchIcon className="pxl-command__search-icon" />
        <input
          className="pxl-command__input"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          aria-label="Search commands"
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          spellCheck={false}
          autoFocus
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') move(1);
            else if (event.key === 'ArrowUp') move(-1);
            else if (event.key === 'Enter') select(active);
            else return;
            event.preventDefault();
          }}
        />
      </div>
      <div id={`${id}-list`} className="pxl-command__list" role="listbox" aria-label="Commands">
        {flat.length === 0 ? (
          <p className="pxl-command__empty" role="status">
            {emptyMessage}
          </p>
        ) : (
          groups.map((group, groupIndex) => (
            <div
              key={group.name ?? ''}
              className="pxl-command__group"
              role="group"
              aria-labelledby={group.name ? `${id}-g${groupIndex}` : undefined}
            >
              {group.name && (
                <div
                  id={`${id}-g${groupIndex}`}
                  className="pxl-command__heading"
                  role="presentation"
                >
                  {group.name}
                </div>
              )}
              {group.items.map((item) => (
                <div
                  key={item.id}
                  id={optionId(item)}
                  className="pxl-command__item"
                  role="option"
                  aria-selected={item === active}
                  aria-disabled={item.disabled || undefined}
                  data-active={item === active || undefined}
                  onPointerMove={() => {
                    if (!item.disabled && item !== active) setActiveId(item.id);
                  }}
                  onClick={() => select(item)}
                >
                  {item.icon && <span className="pxl-command__icon">{item.icon}</span>}
                  <ScrambleText className="pxl-command__label" text={item.label} duration={360} />
                  {item.shortcut && <Kbd size="sm" keys={item.shortcut} aria-hidden="true" />}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <div className="pxl-command__footer" aria-hidden="true">
        <span>
          <Kbd size="sm" keys={['↑', '↓']} /> Navigate
        </span>
        <span>
          <Kbd size="sm">↵</Kbd> Select
        </span>
        <span>
          <Kbd size="sm">esc</Kbd> Close
        </span>
      </div>
    </div>
  );
}
