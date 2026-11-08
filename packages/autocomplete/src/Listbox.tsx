'use client';

import { cx, useFloating, useIsomorphicLayoutEffect, useMergedRefs } from '@pablo-v/core';
import { CheckIcon } from '@pablo-v/pixel-icons';
import { type ReactNode, type Ref, type RefObject, useRef } from 'react';

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

export const optionId = (listId: string, index: number) => `${listId}-option-${index}`;

export interface ListboxProps {
  id: string;
  open: boolean;
  /** Box the list is anchored to and sized from. */
  anchorRef: RefObject<HTMLElement | null>;
  options: readonly ListboxOption[];
  activeIndex: number;
  isSelected: (value: string) => boolean;
  onSelect: (option: ListboxOption) => void;
  onActivate: (index: number) => void;
  emptyMessage: ReactNode;
  multiselectable?: boolean;
  /** Id of the visible label, usually the Field label. */
  labelledBy?: string;
  label?: string;
  className?: string;
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

  if (!open) return null;
  return (
    <div
      ref={mergedRef}
      popover="manual"
      className={cx('pxl-listbox', className)}
      onPointerDown={(event) => event.preventDefault()}
    >
      {options.length === 0 ? (
        <p className="pxl-listbox__empty" role="status">
          {emptyMessage}
        </p>
      ) : (
        <div
          id={id}
          role="listbox"
          aria-labelledby={labelledBy}
          aria-label={labelledBy ? undefined : label}
          aria-multiselectable={multiselectable || undefined}
        >
          {options.map((option, index) => {
            const selected = isSelected(option.value);
            return (
              <div
                key={option.value}
                id={optionId(id, index)}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                className="pxl-listbox__option"
                data-active={index === activeIndex || undefined}
                onPointerMove={() => {
                  if (!option.disabled && index !== activeIndex) onActivate(index);
                }}
                onClick={() => {
                  if (!option.disabled) onSelect(option);
                }}
              >
                <span className="pxl-listbox__text">
                  <span className="pxl-listbox__label">{option.label}</span>
                  {option.description && (
                    <span className="pxl-listbox__description">{option.description}</span>
                  )}
                </span>
                {selected && <CheckIcon className="pxl-listbox__check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
