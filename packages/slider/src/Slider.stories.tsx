import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Slider } from './Slider.js';
import '@pablo-v/field/style.css';
import './slider.css';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { defaultValue: 60, showValue: true, segments: 20 },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Field label="Concurrency" description="Builds that can run at the same time.">
        <Slider {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Formatted: Story = {
  args: { defaultValue: 512, min: 128, max: 3008, step: 64, format: (v: number) => `${v} MB` },
};

export const Disabled: Story = { args: { disabled: true } };
