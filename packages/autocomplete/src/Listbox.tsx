'use client';

import { cx, useFloating, useIsomorphicLayoutEffect, useMergedRefs } from '@pablo-v/core';
import { CheckIcon } from '@pablo-v/pixel-icons';
import { memo, type ReactNode, type Ref, type RefObject, useRef } from 'react';

export interface ListboxOption {
  value: string;
  label: string;
  /** Secondary line under the label. */
  description?: string;
  disabled?: boolean;
}

export type OptionInput = ListboxOption | string;

export function toOption(option: OptionInput): ListboxOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Case- and accent-insensitive "label contains query". */
export function matchesQuery(option: ListboxOption, query: string): boolean {
  const q = fold(query.trim());
  return q === '' || fold(option.label).includes(q);
}

/** Splits `label` around the first accent-insensitive match of `query`, or `null` without one. */
export function splitMatch(label: string, query: string): [string, string, string] | null {
  const q = fold(query.trim());
  if (q === '') return null;
  let folded = '';
  const starts: number[] = [];
  let offset = 0;
  for (const char of label) {
    for (const _ of fold(char)) starts.push(offset);
    folded += fold(char);
    offset += char.length;
  }
  starts.push(label.length);
  const at = folded.indexOf(q);
  if (at < 0) return null;
  const from = starts[at] ?? 0;
  const to = starts[at + q.length] ?? label.length;
  return [label.slice(0, from), label.slice(from, to), label.slice(to)];
}

export const optionId = (listId: string, index: number) => `${listId}-option-${index}`;

export interface ListboxProps {
  /** Id of the listbox, referenced by the input's `aria-controls`. */
  id: string;
  /** Renders the list only while true. */
  open: boolean;
  /** Box the list is anchored to and sized from. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Options to render, already filtered. */
  options: readonly ListboxOption[];
  /** Index of the highlighted option, or -1 for none. */
  activeIndex: number;
  /** Whether an option value is currently selected. */
  isSelected: (value: string) => boolean;
  /** Called when an option is clicked. */
  onSelect: (option: ListboxOption) => void;
  /** Called with the index of the option under the pointer. */
  onActivate: (index: number) => void;
  /** Shown when `options` is empty. */
  emptyMessage: ReactNode;
  /** Sets `aria-multiselectable` for multi-value pickers. */
  multiselectable?: boolean;
  /** Text typed by the user; its first match in each label is emphasised. */
  highlight?: string;
  /** Id of the visible label, usually the Field label. */
  labelledBy?: string;
  /** Accessible name of the list. */
  label?: string;
  /** Extra class on the list element. */
  className?: string;
  /** Ref to the list element, for positioning. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Floating listbox driven by a combobox input: focus stays in the input and
 * the active option is exposed with `aria-activedescendant`.
 */
export function Listbox({
  id,
  open,
  anchorRef,
  options,
  activeIndex,
  isSelected,
  onSelect,
  onActivate,
  emptyMessage,
  multiselectable,
  highlight = '',
  labelledBy,
  label,
  className,
  ref,
}: ListboxProps) {
  const floatingRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(floatingRef, ref);
  useFloating({ open, anchorRef, floatingRef, side: 'bottom', align: 'start', offset: 4 });

  useIsomorphicLayoutEffect(() => {
    if (open && activeIndex >= 0)
      document.getElementById(optionId(id, activeIndex))?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex, id]);

  const handlers = useRef({ onSelect, onActivate });
  useIsomorphicLayoutEffect(() => {
    handlers.current = { onSelect, onActivate };
  });

  if (!open) return null;
  return (
    <div
      ref={mergedRef}
      popover="manual"
      className={cx('pxl-listbox', className)}
      data-multiple={multiselectable || undefined}
      onPointerDown={(event) => event.preventDefault()}
    >
      {options.length > 0 && (
        <div
          id={id}
          role="listbox"
          aria-labelledby={labelledBy}
          aria-label={labelledBy ? undefined : label}
          aria-multiselectable={multiselectable || undefined}
        >
          {options.map((option, index) => (
            <OptionRow
              key={option.value}
              id={optionId(id, index)}
              index={index}
              option={option}
              active={index === activeIndex}
              selected={isSelected(option.value)}
              multiselectable={!!multiselectable}
              highlight={highlight}
              handlers={handlers}
            />
          ))}
        </div>
      )}
      <p className="pxl-listbox__empty" role="status">
        {options.length === 0 ? emptyMessage : null}
      </p>
    </div>
  );
}

interface OptionRowProps {
  id: string;
  index: number;
  option: ListboxOption;
  active: boolean;
  selected: boolean;
  multiselectable: boolean;
  highlight: string;
  handlers: RefObject<{
    onSelect: (option: ListboxOption) => void;
    onActivate: (index: number) => void;
  }>;
}

const OptionRow = memo(function OptionRow({
  id,
  index,
  option,
  active,
  selected,
  multiselectable,
  highlight,
  handlers,
}: OptionRowProps) {
  const parts = splitMatch(option.label, highlight);
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      className="pxl-listbox__option"
      data-active={active || undefined}
      onPointerMove={() => {
        if (!option.disabled && !active) handlers.current.onActivate(index);
      }}
      onClick={() => {
        if (!option.disabled) handlers.current.onSelect(option);
      }}
    >
      {multiselectable && (
        <span className="pxl-listbox__box" aria-hidden="true">
          {selected && <CheckIcon />}
        </span>
      )}
      <span className="pxl-listbox__text">
        <span className="pxl-listbox__label">
          {parts ? (
            <>
              {parts[0]}
              <mark className="pxl-listbox__match">{parts[1]}</mark>
              {parts[2]}
            </>
          ) : (
            option.label
          )}
        </span>
        {option.description && (
          <span className="pxl-listbox__description">{option.description}</span>
        )}
      </span>
      {selected && !multiselectable && <CheckIcon className="pxl-listbox__check" />}
    </div>
  );
});
