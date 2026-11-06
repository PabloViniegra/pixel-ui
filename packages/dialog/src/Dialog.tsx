'use client';

import {
  cloneTrigger,
  cx,
  useControllableState,
  useMergedRefs,
  useModalDialog,
} from '@pixel-ui/core';
import { CloseIcon } from '@pixel-ui/pixel-icons';
import {
  type ComponentPropsWithRef,
  createContext,
  type ReactElement,
  type ReactNode,
  use,
  useId,
} from 'react';

const DialogContext = createContext<(() => void) | null>(null);

export interface DialogProps
  extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'onClose' | 'onCancel'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog on click. Optional when `open` is controlled. */
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  /** Actions row, right-aligned. Wrap a button in `DialogClose` to close on click. */
  footer?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Escape, the backdrop and the close button dismiss it. @default true */
  dismissible?: boolean;
}

/**
 * Modal dialog on the native `<dialog>`: focus trap, top layer, inert page and
 * Escape come from the browser. Content mounts only while open.
 */
export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  size = 'md',
  dismissible = true,
  className,
  children,
  ref,
  ...rest
}: DialogProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const dialogProps = useModalDialog(open, setOpen, dismissible);
  const mergedRef = useMergedRefs(dialogProps.ref, ref);
  const id = useId();
  const close = () => setOpen(false);

  return (
    <>
      {trigger &&
        cloneTrigger(trigger, { onClick: () => setOpen(true), 'aria-haspopup': 'dialog' })}
      <dialog
        {...dialogProps}
        ref={mergedRef}
        className={cx('pxl-dialog', className)}
        data-size={size}
        aria-labelledby={`${id}-title`}
        aria-describedby={description != null ? `${id}-desc` : undefined}
        {...rest}
      >
        {open && (
          <DialogContext value={close}>
            <div className="pxl-dialog__panel">
              <header className="pxl-dialog__header">
                <h2 id={`${id}-title`} className="pxl-dialog__title">
                  {title}
                </h2>
                {description != null && (
                  <p id={`${id}-desc`} className="pxl-dialog__description">
                    {description}
                  </p>
                )}
              </header>
              {children != null && <div className="pxl-dialog__body">{children}</div>}
              {footer != null && <footer className="pxl-dialog__footer">{footer}</footer>}
              {dismissible && (
                <button
                  type="button"
                  className="pxl-dialog__close"
                  aria-label="Close"
                  onClick={close}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </DialogContext>
        )}
      </dialog>
    </>
  );
}

/** Makes its child close the surrounding `Dialog` when clicked. */
export function DialogClose({ children }: { children: ReactElement }) {
  const close = use(DialogContext);
  return cloneTrigger(children, { onClick: () => close?.() });
}
