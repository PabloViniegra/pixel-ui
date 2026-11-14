import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl.js';
import { Toggle } from './Toggle.js';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup.js';

describe('Toggle', () => {
  it('flips aria-pressed on click', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Preview</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Preview' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});

describe('ToggleGroup', () => {
  const group = (type: 'single' | 'multiple', onValueChange = vi.fn()) =>
    render(
      <ToggleGroup type={type} aria-label="Align" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );

  it('keeps one item pressed in single mode', async () => {
    const onValueChange = vi.fn();
    group('single', onValueChange);
    expect(screen.getByRole('toolbar', { name: 'Align' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Left' }));
    await userEvent.click(screen.getByRole('button', { name: 'Right' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['right']);
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('accumulates items in multiple mode', async () => {
    const onValueChange = vi.fn();
    group('multiple', onValueChange);
    await userEvent.click(screen.getByRole('button', { name: 'Left' }));
    await userEvent.click(screen.getByRole('button', { name: 'Right' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['left', 'right']);
  });

  it('is a single tab stop with arrow-key navigation', async () => {
    group('single');
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Left' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Center' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Right' })).toHaveFocus();
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });
});

describe('SegmentedControl', () => {
  it('keeps a keyboard entry point when the selected option becomes disabled', async () => {
    const options = [
      { value: 'a', label: 'A', disabled: false },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
    ];
    const { rerender } = render(<SegmentedControl options={options} defaultValue="a" />);
    rerender(
      <SegmentedControl
        options={options.map((o) => (o.value === 'a' ? { ...o, disabled: true } : o))}
        defaultValue="a"
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'B' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'C' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'C' })).toHaveAttribute('aria-checked', 'true');
  });

  const options = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month', disabled: true },
  ];

  it('selects with click and arrow keys, skipping disabled options', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="Range" options={options} onValueChange={onValueChange} />);
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onValueChange).toHaveBeenLastCalledWith('week');

    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith('day');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
  });
});
