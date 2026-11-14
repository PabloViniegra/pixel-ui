'use client';

import {
  cloneTrigger,
  cx,
  type Side,
  useControllableState,
  useMergedRefs,
  useModalDialog,
  usePresence,
} from '@pablo-v/core';
import { CloseIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  createContext,
  type ReactElement,
  type ReactNode,
  use,
  useId,
} from 'react';

const DrawerContext = createContext<(() => void) | null>(null);

export interface DrawerProps
  extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'onClose' | 'onCancel'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the drawer on click. Optional when `open` is controlled. */
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  /** Actions row pinned to the bottom. Wrap a button in `DrawerClose` to close on click. */
  footer?: ReactNode;
  /** Edge the panel slides in from. @default 'right' */
  side?: Side;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Escape, the backdrop and the close button dismiss it. @default true */
  dismissible?: boolean;
}

/** Modal panel anchored to a viewport edge, on the native `<dialog>`. */
export function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  side = 'right',
  size = 'md',
  dismissible = true,
  className,
  children,
  ref,
  ...rest
}: DrawerProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const dialogProps = useModalDialog(open, setOpen, dismissible);
  const mergedRef = useMergedRefs(dialogProps.ref, ref);
  const id = useId();
  const close = () => setOpen(false);
  const mounted = usePresence(open, dialogProps.ref);

  return (
    <>
      {trigger &&
        cloneTrigger(trigger, { onClick: () => setOpen(true), 'aria-haspopup': 'dialog' })}
      <dialog
        {...dialogProps}
        ref={mergedRef}
        className={cx('pxl-drawer', className)}
        data-side={side}
        data-size={size}
        aria-labelledby={`${id}-title`}
        aria-describedby={description != null ? `${id}-desc` : undefined}
        {...rest}
      >
        {mounted && (
          <DrawerContext value={close}>
            <header className="pxl-drawer__header">
              <h2 id={`${id}-title`} className="pxl-drawer__title">
                {title}
              </h2>
              {description != null && (
                <p id={`${id}-desc`} className="pxl-drawer__description">
                  {description}
                </p>
              )}
            </header>
            <div className="pxl-drawer__body">{children}</div>
            {footer != null && <footer className="pxl-drawer__footer">{footer}</footer>}
            {dismissible && (
              <button
                type="button"
                className="pxl-drawer__close"
                aria-label="Close"
                onClick={close}
              >
                <CloseIcon />
              </button>
            )}
          </DrawerContext>
        )}
      </dialog>
    </>
  );
}

/** Makes its child close the surrounding `Drawer` when clicked. */
export function DrawerClose({ children }: { children: ReactElement }) {
  const close = use(DrawerContext);
  return cloneTrigger(children, { onClick: () => close?.() });
}
