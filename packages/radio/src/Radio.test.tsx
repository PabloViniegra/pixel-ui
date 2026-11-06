import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './Radio.js';

describe('RadioGroup', () => {
  it('selects one option at a time and reports the value', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Runtime" defaultValue="node" onValueChange={onValueChange}>
        <Radio value="node" label="Node.js" />
        <Radio value="edge" label="Edge" />
      </RadioGroup>,
    );
    expect(screen.getByRole('group', { name: 'Runtime' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Node.js' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Edge' }));
    expect(screen.getByRole('radio', { name: 'Edge' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Node.js' })).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('edge');
  });

  it('disables every radio and describes the group with its error', () => {
    render(
      <RadioGroup label="Plan" error="Pick a plan" disabled>
        <Radio value="hobby" label="Hobby" />
      </RadioGroup>,
    );
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Pick a plan');
    expect(screen.getByRole('radio', { name: 'Hobby' })).toBeDisabled();
  });
});
