import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper.js';

const steps = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }];

describe('Stepper', () => {
  it('derives statuses from current and marks the active step', () => {
    render(<Stepper aria-label="Progress" steps={steps} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.dataset.status)).toEqual(['complete', 'current', 'upcoming']);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).toHaveTextContent('One, completed');
  });

  it('lets an explicit status override the derived one', () => {
    render(<Stepper steps={[{ label: 'One' }, { label: 'Two', status: 'error' }]} current={1} />);
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Two, has errors');
  });

  it('makes only completed steps clickable', async () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} current={1} onStepClick={onStepClick} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    await userEvent.click(buttons[0] as HTMLElement);
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
});
