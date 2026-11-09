import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { ColorArea } from './ColorArea.js';
import { ColorField } from './ColorField.js';
import { ColorPicker } from './ColorPicker.js';
import { ColorSlider } from './ColorSlider.js';
import { ColorSwatch } from './ColorSwatch.js';
import { ColorSwatchPicker } from './ColorSwatchPicker.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/popover/style.css';
import './color.css';

const PRESETS = ['#0a0a0a', '#666666', '#0070f3', '#08863a', '#b45309', '#e5001f', '#7c3aed'];

const meta = {
  title: 'Forms/Color',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { label: 'Brand color', defaultValue: '#0070f3' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Picker: Story = {};

export const PickerWithAlphaAndPresets: Story = {
  args: { alpha: true, swatches: PRESETS },
};

export const Area: Story = {
  render: function Render() {
    const [color, setColor] = useState('#3291ff');
    return (
      <div style={{ display: 'grid', gap: 12, width: 240 }}>
        <ColorArea value={color} onChange={setColor} />
        <ColorSlider value={color} onChange={setColor} />
        <code style={{ fontSize: 13 }}>{color}</code>
      </div>
    );
  },
};

export const CoarseArea: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <ColorArea defaultValue="#e5001f" cells={8} />
    </div>
  ),
};

export const Sliders: Story = {
  render: function Render() {
    const [color, setColor] = useState('#0070f3cc');
    return (
      <div style={{ display: 'grid', gap: 16, width: 280 }}>
        {(['hue', 'saturation', 'brightness', 'alpha'] as const).map((channel) => (
          <ColorSlider
            key={channel}
            channel={channel}
            value={color}
            onChange={setColor}
            showValue
          />
        ))}
      </div>
    );
  },
};

export const HexField: Story = {
  render: () => (
    <div style={{ width: 'min(240px, calc(100vw - 32px))' }}>
      <Field label="Accent" description="Hex, with optional alpha.">
        <ColorField defaultValue="#0070f3" />
      </Field>
    </div>
  ),
};

export const Swatches: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <ColorSwatch color="#0070f3" size="sm" />
      <ColorSwatch color="#08863a" />
      <ColorSwatch color="#e5001f80" size="lg" />
      <ColorSwatch color="not a color" />
    </div>
  ),
};

export const SwatchPicker: Story = {
  render: () => (
    <ColorSwatchPicker aria-label="Label color" colors={PRESETS} defaultValue="#0070f3" />
  ),
};
