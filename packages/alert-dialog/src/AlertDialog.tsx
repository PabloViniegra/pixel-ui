'use client';

import { Button } from '@pablo-v/button';
import {
  cloneTrigger,
  cx,
  useControllableState,
  useMergedRefs,
  useModalDialog,
  usePresence,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from 'react';

export interface AlertDialogProps
  extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'onClose' | 'onCancel'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog on click. Optional when `open` is controlled. */
  trigger?: ReactElement;
  title: ReactNode;
  description: ReactNode;
  /** @default 'Cancel' */
  cancelLabel?: ReactNode;
  /** @default 'Continue' */
  confirmLabel?: ReactNode;
  /** Runs on confirm. A returned promise keeps the dialog open, with a loading button, until it settles; a rejection keeps it open. */
  onConfirm?: () => unknown;
  onCancel?: () => void;
  /** `danger` styles the confirm button as destructive. @default 'default' */
  tone?: 'default' | 'danger';
}

/**
 * Interrupting confirmation (`role="alertdialog"`). It only closes through an
 * explicit choice: Escape cancels, the backdrop does nothing, and focus starts
 * on Cancel so a stray Enter is never destructive.
 */
export function AlertDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Continue',
  onConfirm,
  onCancel,
  tone = 'default',
  className,
  ref,
  ...rest
}: AlertDialogProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [pending, setPending] = useState(false);
  const cancel = () => {
    if (pending) return;
    onCancel?.();
    setOpen(false);
  };
  const dialogProps = useModalDialog(open, (next) => (next ? setOpen(true) : cancel()), !pending);
  const mergedRef = useMergedRefs(dialogProps.ref, ref);
  const id = useId();
  const mounted = usePresence(open, dialogProps.ref);

  const confirm = async () => {
    const result = onConfirm?.();
    if (!(result instanceof Promise)) {
      setOpen(false);
      return;
    }
    setPending(true);
    try {
      await result;
      setOpen(false);
    } catch {
      // A rejected confirm leaves the dialog open so the caller can show the error.
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {trigger &&
        cloneTrigger(trigger, { onClick: () => setOpen(true), 'aria-haspopup': 'dialog' })}
      <dialog
        {...dialogProps}
        onClick={undefined}
        ref={mergedRef}
        role="alertdialog"
        className={cx('pxl-alert-dialog', className)}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        {...rest}
      >
        {mounted && (
          <>
            <div className="pxl-alert-dialog__content">
              <h2 id={`${id}-title`} className="pxl-alert-dialog__title">
                {title}
              </h2>
              <div id={`${id}-desc`} className="pxl-alert-dialog__description">
                {description}
              </div>
            </div>
            <footer className="pxl-alert-dialog__footer">
              <Button variant="secondary" autoFocus disabled={pending} onClick={cancel}>
                {cancelLabel}
              </Button>
              <Button
                variant={tone === 'danger' ? 'danger' : 'primary'}
                loading={pending}
                onClick={confirm}
              >
                {confirmLabel}
              </Button>
            </footer>
          </>
        )}
      </dialog>
    </>
  );
}
