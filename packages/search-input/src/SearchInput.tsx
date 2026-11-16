'use client';

import { cx, useControllableState, useMergedRefs } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import { Input, type InputProps } from '@pablo-v/input';
import { CloseIcon, SearchIcon } from '@pablo-v/pixel-icons';
import { useRef } from 'react';

export interface SearchInputProps
  extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'suffix'> {
  /** Current text. Controlled when given; pair it with `onValueChange`. */
  value?: string;
  /** Initial text when uncontrolled. @default '' */
  defaultValue?: string;
  /** Called with the new text on every edit, and with `''` when cleared. */
  onValueChange?: (value: string) => void;
  /** Called after the clear button or Escape empties the field. */
  onClear?: () => void;
  /** Accessible name of the clear button. @default 'Clear search' */
  clearLabel?: string;
}

/**
 * Input with `type="search"`, a search icon and a clear button that appears once
 * there is text. Escape also clears it.
 */
export function SearchInput({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onClear,
  clearLabel = 'Clear search',
  prefix = <SearchIcon />,
  onChange,
  onKeyDown,
  ref,
  className,
  ...rest
}: SearchInputProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, ref);
  const { disabled } = useFieldControl({ disabled: rest.disabled });
  const clearable = value !== '' && !disabled && !rest.readOnly;

  const clear = () => {
    setValue('');
    onClear?.();
  };

  return (
    <Input
      {...rest}
      className={cx('pxl-search-input', className)}
      ref={mergedRef}
      type="search"
      value={value}
      prefix={prefix}
      onChange={(event) => {
        onChange?.(event);
        setValue(event.target.value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Escape' && clearable && !event.defaultPrevented) {
          // Keeps a surrounding dialog open: the first Escape only clears the text.
          event.preventDefault();
          event.stopPropagation();
          clear();
        }
      }}
      suffix={
        clearable ? (
          <button
            type="button"
            className="pxl-input__affix-button pxl-search-input__clear"
            aria-label={clearLabel}
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
          >
            <CloseIcon />
          </button>
        ) : undefined
      }
    />
  );
}
