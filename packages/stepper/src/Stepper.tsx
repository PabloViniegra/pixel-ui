import { cx, type Orientation } from '@pablo-v/core';
import { CheckIcon, ErrorIcon } from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
  /** Overrides the status derived from `current`, e.g. `'error'`. */
  status?: StepStatus;
  disabled?: boolean;
}

export interface StepperProps extends Omit<ComponentPropsWithRef<'ol'>, 'onChange'> {
  steps: StepperStep[];
  /** Index of the active step. Steps before it are complete. */
  current: number;
  /** Makes complete steps buttons that jump back to them. */
  onStepClick?: (index: number) => void;
  /** @default 'horizontal' */
  orientation?: Orientation;
  /** Screen-reader text appended to each step by status. */
  statusLabels?: Partial<Record<StepStatus, string>>;
}

const STATUS_LABELS: Record<StepStatus, string> = {
  complete: 'completed',
  current: 'current',
  upcoming: 'not started',
  error: 'has errors',
};

/** Progress through a sequence of steps, with pixel-cell connectors between them. */
export function Stepper({
  steps,
  current,
  onStepClick,
  orientation = 'horizontal',
  statusLabels,
  className,
  ...rest
}: StepperProps) {
  const labels = { ...STATUS_LABELS, ...statusLabels };
  return (
    <ol data-orientation={orientation} className={cx('pxl-stepper', className)} {...rest}>
      {steps.map((step, index) => {
        const status: StepStatus =
          step.status ??
          (index < current ? 'complete' : index === current ? 'current' : 'upcoming');
        const interactive =
          onStepClick && status !== 'current' && index < current && !step.disabled;
        const body = (
          <>
            <span className="pxl-stepper__marker" aria-hidden="true">
              {status === 'complete' ? (
                <CheckIcon />
              ) : status === 'error' ? (
                <ErrorIcon />
              ) : (
                index + 1
              )}
            </span>
            <span className="pxl-stepper__text">
              <span className="pxl-stepper__label">
                {step.label}
                <span className="pxl-stepper__status">, {labels[status]}</span>
              </span>
              {step.description != null && (
                <span className="pxl-stepper__description">{step.description}</span>
              )}
            </span>
          </>
        );
        return (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: steps are positional
            key={index}
            data-status={status}
            aria-current={status === 'current' ? 'step' : undefined}
            className="pxl-stepper__step"
          >
            {interactive ? (
              <button
                type="button"
                className="pxl-stepper__body"
                onClick={() => onStepClick(index)}
              >
                {body}
              </button>
            ) : (
              <span className="pxl-stepper__body" data-disabled={step.disabled || undefined}>
                {body}
              </span>
            )}
            {index < steps.length - 1 && (
              <span
                className="pxl-stepper__connector"
                data-lit={index < current || undefined}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
