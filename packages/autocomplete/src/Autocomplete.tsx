'use client';

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
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Listbox,
  type ListboxOption,
  matchesQuery,
  type OptionInput,
  optionId,
  toOption,
} from './Listbox.js';

export interface AutocompleteProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'size' | 'prefix' | 'value' | 'defaultValue' | 'onChange'
  > {
  options: readonly OptionInput[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, option: ListboxOption | null) => void;
  /** Text in the input. Controlled when given. */
  inputValue?: string;
  onInputChange?: (text: string) => void;
  /** Replaces the default case- and accent-insensitive "contains" match. */
  filter?: (option: ListboxOption, query: string) => boolean;
  /** @default 'No results' */
  emptyMessage?: ReactNode;
  /** @default 'md' */
  size?: PixelSize;
  invalid?: boolean;
  prefix?: ReactNode;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

/**
 * Text input that suggests matching options (WAI-ARIA combobox with list
 * autocomplete). Leaving the field restores the selected label, so the value
 * is always one of the options.
 */
export function Autocomplete({
  options: optionsProp,
  value: valueProp,
  defaultValue = null,
  onChange,
  inputValue: inputProp,
  onInputChange,
  filter = matchesQuery,
  emptyMessage = 'No results',
  size = 'md',
  invalid,
  prefix,
  className,
  style,
  name,
  ref,
  onKeyDown,
  onBlur,
  ...rest
}: AutocompleteProps) {
  const options = useMemo(() => optionsProp.map(toOption), [optionsProp]);
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: (next) => onChange?.(next, options.find((o) => o.value === next) ?? null),
  });
  const selected = options.find((o) => o.value === value) ?? null;
  const [text, setText] = useControllableState({
    value: inputProp,
    defaultValue: selected?.label ?? '',
    onChange: onInputChange,
  });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(inputRef, ref);
  const listId = useId();
  const props = useFieldControl(rest, invalid);
  const labelId = useFieldLabelId();
  const inert = props.disabled || props.readOnly;

  // A value or options set from outside must show their label, or blurring an empty input would clear the value.
  const selectedLabel = selected?.label ?? '';
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new selected label resyncs the text
  useEffect(() => {
    if (
      inputProp === undefined &&
      text !== selectedLabel &&
      document.activeElement !== inputRef.current
    )
      setText(selectedLabel);
  }, [selectedLabel]);

  const matches = useMemo(
    () => options.filter((option) => filter(option, query)),
    [options, filter, query],
  );

  const firstEnabled = (list: readonly ListboxOption[]) => list.findIndex((o) => !o.disabled);

  const openList = (nextQuery: string) => {
    if (inert) return;
    setQuery(nextQuery);
    const list = options.filter((option) => filter(option, nextQuery));
    const current = list.findIndex((o) => o.value === value);
    setActiveIndex(current >= 0 ? current : firstEnabled(list));
    setOpen(true);
  };

  const choose = (option: ListboxOption) => {
    if (option.value !== value) setValue(option.value);
    setText(option.label);
    setOpen(false);
  };

  const settle = () => {
    setOpen(false);
    if (text.trim() === '') {
      if (value != null) setValue(null);
    } else if (text !== selectedLabel) {
      setText(selectedLabel);
    }
  };

  useDismiss(open, () => setOpen(false), [boxRef, listRef]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openList('');
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
        choose(option);
      }
    }
  };

  const disabled = props.disabled;
  const active = open && activeIndex >= 0 && matches[activeIndex] ? activeIndex : -1;

  return (
    <>
      <span
        ref={boxRef}
        className={cx('pxl-input', 'pxl-autocomplete', className)}
        style={style}
        data-size={size}
        data-open={open || undefined}
        data-invalid={props['aria-invalid'] ? true : undefined}
        data-disabled={disabled || undefined}
      >
        {prefix != null && <span className="pxl-input__affix">{prefix}</span>}
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open && matches.length > 0 ? listId : undefined}
          aria-activedescendant={active >= 0 ? optionId(listId, active) : undefined}
          autoComplete="off"
          spellCheck={false}
          className="pxl-input__control"
          {...props}
          ref={mergedRef}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            openList(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            onBlur?.(event);
            settle();
          }}
        />
        <span
          className="pxl-input__affix pxl-autocomplete__chevron"
          aria-hidden="true"
          onPointerDown={(event) => {
            event.preventDefault();
            if (inert) return;
            inputRef.current?.focus();
            if (open) setOpen(false);
            else openList('');
          }}
        >
          <ChevronDownIcon />
        </span>
      </span>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <Listbox
        ref={listRef}
        id={listId}
        open={open}
        anchorRef={boxRef}
        options={matches}
        activeIndex={active}
        isSelected={(v) => v === value}
        onSelect={choose}
        onActivate={setActiveIndex}
        emptyMessage={emptyMessage}
        highlight={query}
        labelledBy={props['aria-labelledby'] ?? labelId}
        label={props['aria-label']}
      />
    </>
  );
}
