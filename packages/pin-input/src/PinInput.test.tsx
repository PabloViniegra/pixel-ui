import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PinInput } from './PinInput.js';

const cells = () => screen.getAllByRole('textbox');

function Example() {
  const [value, setValue] = useState('1234');
  return (
    <>
      <PinInput length={4} value={value} onChange={setValue} />
      <button type="button" onClick={() => setValue('9876')}>
        Reset
      </button>
    </>
  );
}

describe('PinInput', () => {
  it('preserves gaps with a controlled value and accepts external resets', async () => {
    render(<Example />);
    await userEvent.click(cells()[1] as HTMLElement);
    await userEvent.keyboard('{Delete}');
    expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['1', '', '3', '4']);
    await userEvent.keyboard('2');
    expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['1', '2', '3', '4']);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['9', '8', '7', '6']);
  });

  it.each(['{Delete}', '{Backspace}'])(
    'preserves later cells when deleting with %s',
    async (key) => {
      const onComplete = vi.fn();
      render(<PinInput length={4} defaultValue="1234" onComplete={onComplete} />);
      await userEvent.click(cells()[1] as HTMLElement);
      await userEvent.keyboard(key);
      expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['1', '', '3', '4']);
      expect(onComplete).not.toHaveBeenCalled();
      await userEvent.keyboard('2');
      expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['1', '2', '3', '4']);
      expect(onComplete).toHaveBeenLastCalledWith('1234');
    },
  );

  it('advances while typing, ignores invalid characters and completes', async () => {
    const onComplete = vi.fn();
    render(<PinInput aria-label="Code" length={4} onComplete={onComplete} />);
    expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument();
    await userEvent.click(cells()[0] as HTMLElement);
    await userEvent.keyboard('1a23');
    expect(cells()[3]).toHaveFocus();
    await userEvent.keyboard('4');
    expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(['1', '2', '3', '4']);
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('spreads a paste across the cells', async () => {
    const onChange = vi.fn();
    render(<PinInput aria-label="Code" length={6} onChange={onChange} />);
    await userEvent.click(cells()[0] as HTMLElement);
    await userEvent.paste('12 34-56');
    expect(onChange).toHaveBeenLastCalledWith('123456');
    expect(cells()[5]).toHaveFocus();
  });

  it('clears backwards with Backspace', async () => {
    const onChange = vi.fn();
    render(<PinInput aria-label="Code" length={3} defaultValue="123" onChange={onChange} />);
    await userEvent.click(cells()[2] as HTMLElement);
    await userEvent.keyboard('{Backspace}{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('1');
    expect(cells()[1]).toHaveFocus();
  });

  it('sends focus to the first empty cell instead of leaving gaps', async () => {
    render(<PinInput aria-label="Code" length={4} />);
    await userEvent.click(cells()[3] as HTMLElement);
    expect(cells()[0]).toHaveFocus();
  });

  it('uppercases alphanumeric codes', async () => {
    const onChange = vi.fn();
    render(<PinInput aria-label="Code" length={2} type="alphanumeric" onChange={onChange} />);
    await userEvent.click(cells()[0] as HTMLElement);
    await userEvent.keyboard('a9');
    expect(onChange).toHaveBeenLastCalledWith('A9');
  });

  it('hides masked characters from assistive technology as password cells', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <PinInput aria-label="PIN" length={2} mask defaultValue="1" onChange={onChange} />,
    );
    const masked = container.querySelectorAll('input');
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(masked[0]).toHaveAttribute('type', 'password');
    await userEvent.click(masked[1] as HTMLElement);
    await userEvent.keyboard('2');
    expect(onChange).toHaveBeenLastCalledWith('12');
  });
});
