import { cloneElement, isValidElement, type ReactElement, type Ref } from 'react';
import { cx } from './cx.js';
import { mergeRefs } from './merge-refs.js';

type AnyProps = Record<string, unknown>;

/**
 * Clones a trigger element, chaining event handlers (the element's own runs
 * first and can `preventDefault()` to skip ours), merging refs and classes.
 */
export function cloneTrigger(element: ReactElement, props: AnyProps): ReactElement {
  if (!isValidElement<AnyProps>(element)) return element;
  const own = element.props;
  const merged: AnyProps = { ...props };
  for (const key of Object.keys(props)) {
    const ours = props[key];
    const theirs = own[key];
    if (/^on[A-Z]/.test(key) && typeof ours === 'function' && typeof theirs === 'function') {
      merged[key] = (event: { defaultPrevented?: boolean }) => {
        theirs(event);
        if (!event?.defaultPrevented) ours(event);
      };
    }
  }
  if (props.ref) merged.ref = mergeRefs(own.ref as Ref<unknown>, props.ref as Ref<unknown>);
  if (props.className || own.className)
    merged.className = cx(own.className as string, props.className as string);
  return cloneElement(element, merged);
}
