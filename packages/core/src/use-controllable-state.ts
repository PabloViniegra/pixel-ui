import { useCallback, useRef, useState } from 'react';

interface Options<T> {
  value: T | undefined;
  defaultValue: T;
  onChange: ((value: T) => void) | undefined;
}

/**
 * State that can be either controlled (`value` provided) or uncontrolled
 * (`defaultValue`), with a single setter that always notifies `onChange`.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: Options<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
