import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { NumberField } from './NumberField.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/pixel-icons/style.css';
import './number-field.css';

const meta = {
  title: 'Forms/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { defaultValue: 3, min: 1, max: 10, 'aria-label': 'Replicas', style: { width: 160 } },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Decimal: Story = {
  args: { defaultValue: 0.5, min: 0, max: 1, step: 0.05, 'aria-label': 'Opacity' },
};

export const InField: Story = {
  render: (args) => (
    <Field label="Replicas" description="Between 1 and 10 instances." style={{ maxWidth: 240 }}>
      <NumberField {...args} aria-label={undefined} />
    </Field>
  ),
};
