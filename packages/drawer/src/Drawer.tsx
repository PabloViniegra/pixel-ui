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
  /** Open state. Controlled when given; pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the user opens or closes it. */
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the drawer on click. Optional when `open` is controlled. */
  trigger?: ReactElement;
  /** Heading and accessible name of the drawer. */
  title: ReactNode;
  /** Supporting text under the title, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Actions row pinned to the bottom. Wrap a button in `DrawerClose` to close on click. */
  footer?: ReactNode;
  /** Edge the panel slides in from. @default 'right' */
  side?: Side;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Escape, the backdrop and the close button dismiss it. @default true */
  dismissible?: boolean;
  /** Accessible name of the close button. @default 'Close' */
  closeLabel?: string;
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
  closeLabel = 'Close',
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
                aria-label={closeLabel}
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
