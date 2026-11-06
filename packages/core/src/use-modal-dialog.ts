import type { KeyboardEvent, MouseEvent, PointerEvent, RefObject, SyntheticEvent } from 'react';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export interface ModalDialogProps {
  ref: RefObject<HTMLDialogElement | null>;
  onKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
  onCancel: (event: SyntheticEvent<HTMLDialogElement>) => void;
  onClose: () => void;
  onPointerDown: (event: PointerEvent<HTMLDialogElement>) => void;
  onClick: (event: MouseEvent<HTMLDialogElement>) => void;
}

/** Syncs a native `<dialog>` with `open` and routes Escape and backdrop presses to `setOpen`. */
export function useModalDialog(
  open: boolean,
  setOpen: (open: boolean) => void,
  dismissible = true,
): ModalDialogProps {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return {
    ref,
    // A cancelled keydown stops the close request before `cancel` fires.
    onKeyDown: (event) => {
      if (!dismissible && event.key === 'Escape') event.preventDefault();
    },
    onCancel: (event) => {
      event.preventDefault();
      if (dismissible) setOpen(false);
    },
    // Chrome skips the cancelable `cancel` on a repeated Escape and closes directly.
    onClose: () => {
      if (!open) return;
      if (dismissible) setOpen(false);
      else ref.current?.showModal();
    },
    // Only a press that starts and ends on the backdrop closes: dragging a
    // text selection out of the panel must not.
    onPointerDown: (event) => {
      pressedBackdrop.current = event.target === event.currentTarget;
    },
    onClick: (event) => {
      if (dismissible && pressedBackdrop.current && event.target === event.currentTarget)
        setOpen(false);
      pressedBackdrop.current = false;
    },
  };
}
