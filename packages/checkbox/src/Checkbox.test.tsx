import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox.js';

describe('Checkbox', () => {
  it('toggles from its label and reports the change', async () => {
    const onChange = vi.fn();
    render(
      <Checkbox label="Preview deployments" description="For every branch" onChange={onChange} />,
    );
    const box = screen.getByRole('checkbox', { name: 'Preview deployments' });
    expect(box).toHaveAccessibleDescription('For every branch');
    await userEvent.click(screen.getByText('Preview deployments'));
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('exposes the mixed state', () => {
    render(<Checkbox label="All" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'All' })).toBePartiallyChecked();
  });
});
