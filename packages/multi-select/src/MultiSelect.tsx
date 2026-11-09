'use client';

import {
  Listbox,
  type ListboxOption,
  matchesQuery,
  type OptionInput,
  optionId,
  toOption,
} from '@pablo-v/autocomplete';
import { Chip } from '@pablo-v/chip';
import {
  cx,
  nextIndex,
  type PixelSize,
  useControllableState,
  useDismiss,
  useMergedRefs,
} from '@pablo-v/core';
import { useFieldControl, useFieldLabelId } from '@pablo-v/field';
import { ChevronDownIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface MultiSelectProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'size' | 'prefix' | 'value' | 'defaultValue' | 'onChange'
  > {
  options: readonly OptionInput[];
  /** Selected values, in selection order. */
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (value: string[], options: ListboxOption[]) => void;
  /** Replaces the default case- and accent-insensitive "contains" match. */
  filter?: (option: ListboxOption, query: string) => boolean;
  /** @default 'No results' */
  emptyMessage?: ReactNode;
  /** Accessible name of each chip's remove button. @default (label) => `Remove ${label}` */
  removeLabel?: (label: string) => string;
  /** @default 'md' */
  size?: PixelSize;
  invalid?: boolean;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

const EMPTY: readonly string[] = [];

/**
 * Combobox that picks several options. Selected values show as removable
 * chips; the list stays open while choosing.
 */
export function MultiSelect({
  options: optionsProp,
  value: valueProp,
  defaultValue = EMPTY,
  onChange,
  filter = matchesQuery,
  emptyMessage = 'No results',
  removeLabel = (label) => `Remove ${label}`,
  size = 'md',
  invalid,
  className,
  style,
  name,
  placeholder,
  ref,
  onKeyDown,
  onBlur,
  ...rest
}: MultiSelectProps) {
  const options = useMemo(() => optionsProp.map(toOption), [optionsProp]);
  const [value, setValue] = useControllableState<readonly string[]>({
    value: valueProp,
    defaultValue,
    onChange: (next) =>
      onChange?.(
        [...next],
        next.flatMap((v) => options.find((o) => o.value === v) ?? []),
      ),
  });
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, ref);
  const listId = useId();
  const props = useFieldControl(rest, invalid);
  const labelId = useFieldLabelId();
  const disabled = props.disabled;
  const inert = disabled || props.readOnly;

  const matches = useMemo(
    () => options.filter((option) => filter(option, query)),
    [options, filter, query],
  );
  const selected = value.flatMap((v) => options.find((o) => o.value === v) ?? []);

  useDismiss(open, () => setOpen(false), [boxRef, listRef]);

  const openList = (nextQuery: string) => {
    if (inert) return;
    setQuery(nextQuery);
    const list = options.filter((option) => filter(option, nextQuery));
    setActiveIndex(list.findIndex((o) => !o.disabled));
    setOpen(true);
  };

  const toggle = (option: ListboxOption) => {
    if (inert) return;
    setValue(
      value.includes(option.value)
        ? value.filter((v) => v !== option.value)
        : [...value, option.value],
    );
    if (query !== '') {
      setQuery('');
      setActiveIndex(options.filter((o) => filter(o, '')).indexOf(option));
    }
  };

  const remove = (target: string) => {
    if (inert) return;
    setValue(value.filter((v) => v !== target));
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openList(query);
        return;
      }
      const next = nextIndex(
        event.key,
        activeIndex,
        matches.map((o) => !!o.disabled),
      );
      if (next != null) setActiveIndex(next);
    } else if (event.key === 'Enter' && open) {
      const option = matches[activeIndex];
      if (option && !option.disabled) {
        event.preventDefault();
        toggle(option);
      }
    } else if (event.key === 'Backspace' && query === '' && value.length > 0 && !inert) {
      event.preventDefault();
      setValue(value.slice(0, -1));
    }
  };

  const active = open && activeIndex >= 0 && matches[activeIndex] ? activeIndex : -1;

  return (
    <>
      <div
        ref={boxRef}
        className={cx('pxl-input', 'pxl-multi-select', className)}
        style={style}
        data-size={size}
        data-open={open || undefined}
        data-invalid={props['aria-invalid'] ? true : undefined}
        data-disabled={disabled || undefined}
        onPointerDown={(event) => {
          if (inert || event.target === inputRef.current) return;
          if ((event.target as Element).closest('.pxl-chip')) return;
          event.preventDefault();
          inputRef.current?.focus();
          if (open) setOpen(false);
          else openList(query);
        }}
      >
        <div className="pxl-multi-select__values">
          {selected.map((option) => (
            <Chip
              key={option.value}
              size="sm"
              disabled={disabled}
              onRemove={props.readOnly ? undefined : () => remove(option.value)}
              removeLabel={removeLabel(option.label)}
            >
              {option.label}
            </Chip>
          ))}
          <input
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open && matches.length > 0 ? listId : undefined}
            aria-activedescendant={active >= 0 ? optionId(listId, active) : undefined}
            autoComplete="off"
            spellCheck={false}
            className="pxl-input__control pxl-multi-select__control"
            placeholder={selected.length === 0 ? placeholder : undefined}
            {...props}
            ref={mergedRef}
            value={query}
            onChange={(event) => openList(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={(event) => {
              onBlur?.(event);
              setOpen(false);
              setQuery('');
            }}
          />
        </div>
        <span className="pxl-input__affix pxl-multi-select__chevron" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </div>
      {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      <Listbox
        ref={listRef}
        id={listId}
        open={open}
        anchorRef={boxRef}
        options={matches}
        activeIndex={active}
        isSelected={(v) => value.includes(v)}
        onSelect={toggle}
        onActivate={setActiveIndex}
        emptyMessage={emptyMessage}
        highlight={query}
        multiselectable
        labelledBy={props['aria-labelledby'] ?? labelId}
        label={props['aria-label']}
      />
    </>
  );
}
