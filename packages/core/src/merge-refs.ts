import { type Ref, type RefCallback, useCallback } from 'react';

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }
  };
}

/** `mergeRefs` with a stable identity, so callback refs are not re-attached on every render. */
export function useMergedRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  // biome-ignore lint/correctness/useExhaustiveDependencies: the refs themselves are the dependencies
  return useCallback(mergeRefs(...refs), refs);
}
