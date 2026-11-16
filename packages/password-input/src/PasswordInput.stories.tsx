import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { PasswordInput } from './PasswordInput.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import './password-input.css';

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'Password' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onVisibleChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(320px, calc(100vw - 32px))' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Starts revealed, for example right after generating a password. */
export const Visible: Story = {
  args: { defaultValue: 'correct-horse-battery', defaultVisible: true },
};

export const InField: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Field label="New password" description="At least 12 characters." required>
        <PasswordInput {...args} aria-label={undefined} autoComplete="new-password" />
      </Field>
      <Field label="Confirm password" error="Passwords do not match.">
        <PasswordInput defaultValue="hunter2" autoComplete="new-password" />
      </Field>
      <Field label="Current password" disabled>
        <PasswordInput defaultValue="secret" />
      </Field>
    </div>
  ),
};

/** Translate the toggle with `toggleLabel`. */
export const CustomLabel: Story = {
  args: { 'aria-label': 'Contraseña', toggleLabel: 'Mostrar contraseña' },
};
