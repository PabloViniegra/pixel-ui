import { type RefObject, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

/**
 * Keeps an element mounted after `open` turns false until its exit animation or
 * transition finishes. Engines that run none unmount it at once.
 */
export function usePresence(open: boolean, ref: RefObject<Element | null>): boolean {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useIsomorphicLayoutEffect(() => {
    if (open || !mounted) return;
    const running = ref.current?.getAnimations?.() ?? [];
    if (running.length === 0) {
      setMounted(false);
      return;
    }
    let current = true;
    Promise.allSettled(running.map((animation) => animation.finished)).then(() => {
      if (current) setMounted(false);
    });
    return () => {
      current = false;
    };
  }, [open, mounted]);

  return mounted;
}
