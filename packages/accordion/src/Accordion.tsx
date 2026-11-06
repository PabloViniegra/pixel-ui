'use client';

import { cx } from '@pixel-ui/core';
import { ChevronDownIcon } from '@pixel-ui/pixel-icons';
import { type ComponentPropsWithRef, createContext, type ReactNode, use, useId } from 'react';

const AccordionContext = createContext<string | undefined>(undefined);

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /** `single` closes the open item when another one opens. @default 'multiple' */
  type?: 'single' | 'multiple';
}

/**
 * Stack of disclosures on native `<details>`: works without JS, is found by
 * in-page search, and `single` mode uses the shared `name` attribute.
 */
export function Accordion({ type = 'multiple', className, ...rest }: AccordionProps) {
  const name = useId();
  return (
    <AccordionContext value={type === 'single' ? name : undefined}>
      <div className={cx('pxl-accordion', className)} {...rest} />
    </AccordionContext>
  );
}

export interface AccordionItemProps extends Omit<ComponentPropsWithRef<'details'>, 'title'> {
  title: ReactNode;
  /** Extra text on the right of the header, e.g. a count or status. */
  meta?: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  meta,
  defaultOpen,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const name = use(AccordionContext);
  return (
    <details
      name={name}
      open={defaultOpen}
      className={cx('pxl-accordion__item', className)}
      {...rest}
    >
      <summary className="pxl-accordion__trigger">
        <span className="pxl-accordion__title">{title}</span>
        {meta != null && <span className="pxl-accordion__meta">{meta}</span>}
        <ChevronDownIcon className="pxl-accordion__chevron" />
      </summary>
      <div className="pxl-accordion__content">{children}</div>
    </details>
  );
}
