import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColorArea } from './ColorArea.js';
import { ColorField } from './ColorField.js';
import { ColorPicker } from './ColorPicker.js';
import { ColorSlider } from './ColorSlider.js';
import { ColorSwatch } from './ColorSwatch.js';
import { ColorSwatchPicker } from './ColorSwatchPicker.js';
import { parseHex, toHex } from './color.js';

describe('hex conversion', () => {
  it('round-trips short, long and translucent hex', () => {
    const hex = (input: string) => {
      const parsed = parseHex(input);
      return parsed ? toHex(parsed) : null;
    };
    expect(hex('#0070F3')).toBe('#0070f3');
    expect(hex('fff')).toBe('#ffffff');
    expect(hex('#0070f380')).toBe('#0070f380');
    expect(hex('#12')).toBeNull();
  });
});

describe('ColorArea', () => {
  it('moves one cell per arrow key on both axes', async () => {
    const onChange = vi.fn();
    render(<ColorArea defaultValue="#ff0000" cells={5} onChange={onChange} />);
    const saturation = screen.getByRole('slider', { name: 'Saturation' });
    const brightness = screen.getByRole('slider', { name: 'Brightness' });
    expect(saturation).toHaveValue('4');
    expect(brightness).toHaveValue('4');

    saturation.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('#ff4040');
    await userEvent.keyboard('{ArrowDown}');
    expect(brightness).toHaveValue('3');
    expect(saturation).toHaveFocus();
  });

  it('keeps the hue while passing through greys', async () => {
    const onChange = vi.fn();
    render(<ColorArea defaultValue="#0070f3" cells={3} onChange={onChange} />);
    screen.getByRole('slider', { name: 'Saturation' }).focus();
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(onChange).toHaveBeenLastCalledWith('#ffffff');
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    const hue = parseHex('#0070f3')?.h ?? 0;
    expect(onChange).toHaveBeenLastCalledWith(toHex({ h: hue, s: 1, v: 1, a: 1 }));
  });

  it('announces both axes from either slider', async () => {
    render(<ColorArea defaultValue="#ff0000" cells={5} />);
    const brightness = screen.getByRole('slider', { name: 'Brightness' });
    brightness.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(brightness).toHaveAttribute('aria-valuetext', '100%, Saturation 75%');
  });

  it('follows a controlled value that ignores the change', async () => {
    const onChange = vi.fn();
    render(<ColorArea value="#ff0000" cells={5} onChange={onChange} />);
    const saturation = screen.getByRole('slider', { name: 'Saturation' });
    saturation.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('#ff4040');
    expect(saturation).toHaveValue('4');
  });

  it('picks the cell under the pointer', () => {
    const onChange = vi.fn();
    render(<ColorArea defaultValue="#00ff00" cells={5} onChange={onChange} />);
    const area = screen.getByRole('group', { name: 'Color' });
    area.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 100 });
    fireEvent.pointerDown(area, { button: 0, pointerId: 1, clientX: 10, clientY: 90 });
    expect(onChange).toHaveBeenLastCalledWith('#000000');
    fireEvent.pointerDown(area, { button: 0, pointerId: 1, clientX: 90, clientY: 10 });
    expect(onChange).toHaveBeenLastCalledWith('#00ff00');
  });
});

describe('ColorSlider', () => {
  it('changes one channel and announces it', () => {
    const onChange = vi.fn();
    render(<ColorSlider channel="hue" defaultValue="#ff0000" onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Hue' });
    expect(slider).toHaveAttribute('aria-valuetext', '0°');
    fireEvent.change(slider, { target: { value: '120' } });
    expect(onChange).toHaveBeenLastCalledWith('#00ff00');
  });
});

describe('ColorField', () => {
  it('applies valid hex as typed and settles to the normalised value on blur', async () => {
    const onChange = vi.fn();
    render(<ColorField aria-label="Hex" defaultValue="#000000" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Hex' });
    await userEvent.clear(input);
    await userEvent.type(input, 'ABCDEF');
    expect(onChange).toHaveBeenLastCalledWith('#abcdef');

    await userEvent.clear(input);
    await userEvent.type(input, 'zz');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.tab();
    expect(input).toHaveValue('#abcdef');
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});

describe('ColorSwatch', () => {
  it('is an image named by its colour', () => {
    render(<ColorSwatch color="#0070F3" />);
    expect(screen.getByRole('img', { name: '#0070f3' })).toBeInTheDocument();
  });
});

describe('ColorSwatchPicker', () => {
  it('is a radio group that selects with click and arrow keys', async () => {
    const onChange = vi.fn();
    render(
      <ColorSwatchPicker
        aria-label="Label color"
        colors={['#ff0000', { value: '#00ff00', label: 'Green' }, '#0000ff']}
        defaultValue="#ff0000"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'Label color' })).toBeInTheDocument();
    const red = screen.getByRole('radio', { name: '#ff0000' });
    expect(red).toBeChecked();

    red.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('#00ff00');

    await userEvent.click(screen.getByRole('radio', { name: '#0000ff' }));
    expect(onChange).toHaveBeenLastCalledWith('#0000ff');
  });
});

describe('ColorPicker', () => {
  it('opens a panel whose controls share the picker colour', async () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        label="Brand"
        defaultValue="#ff0000"
        swatches={['#0000ff']}
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Brand #ff0000' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Brand' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: '#0000ff' }));
    expect(onChange).toHaveBeenLastCalledWith('#0000ff');
    expect(screen.getByRole('textbox', { name: 'Hex' })).toHaveValue('#0000ff');
    expect(trigger).toHaveAccessibleName('Brand #0000ff');
  });
});
