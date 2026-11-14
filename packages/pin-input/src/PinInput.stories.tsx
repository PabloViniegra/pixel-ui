import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { PinInput } from './PinInput.js';
import '@pablo-v/field/style.css';
import './pin-input.css';

const meta = {
  title: 'Forms/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'Verification code', length: 6 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
  },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MaskedPin: Story = {
  args: { length: 4, mask: true, defaultValue: '12', 'aria-label': 'PIN' },
};

export const InField: Story = {
  render: (args) => (
    <Field
      label="Verification code"
      description="We sent a 6-digit code to ada@acme.dev."
      error="That code has expired."
    >
      <PinInput {...args} aria-label={undefined} />
    </Field>
  ),
};
