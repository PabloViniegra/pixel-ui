import { type RefObject, useEffect, useRef } from 'react';

type Refs = RefObject<RefObject<HTMLElement | null>[]>;

const openLayers = new Set<Refs>();

const nodesOf = (layer: Refs) => layer.current.flatMap((r) => (r.current ? [r.current] : []));

// Nested layers (a menu inside a popover) live inside the outer layer's DOM, so
// Escape belongs to whichever open layer has no other open layer inside it.
function hasInnerLayer(layer: Refs): boolean {
  const own = nodesOf(layer);
  for (const other of openLayers) {
    if (other === layer) continue;
    if (nodesOf(other).some((n) => own.some((o) => o !== n && o.contains(n)))) return true;
  }
  return false;
}

/** Calls `onDismiss` on Escape or on a pointer press outside every given element. */
export function useDismiss(
  open: boolean,
  onDismiss: () => void,
  refs: RefObject<HTMLElement | null>[],
): void {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!open) return;
    const layer = refsRef;
    openLayers.add(layer);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || hasInnerLayer(layer)) return;
      event.preventDefault();
      onDismissRef.current();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && refsRef.current.some((r) => r.current?.contains(target))) return;
      onDismissRef.current();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      openLayers.delete(layer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);
}
