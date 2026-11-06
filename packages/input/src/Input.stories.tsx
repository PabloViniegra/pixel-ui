import { Field } from '@pablo-v/field';
import { SearchIcon } from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Input } from './Input.js';
import '@pablo-v/field/style.css';
import '@pablo-v/pixel-icons/style.css';
import './input.css';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { placeholder: 'my-project', 'aria-label': 'Project name' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAffixes: Story = {
  args: { prefix: <SearchIcon />, suffix: '.vercel.app', placeholder: 'acme' },
};

export const InField: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Field label="Project name" description="Lowercase letters, numbers and dashes." required>
        <Input {...args} aria-label={undefined} />
      </Field>
      <Field label="Domain" error="This domain is already taken. Try another one.">
        <Input defaultValue="acme.dev" />
      </Field>
      <Field label="Team" disabled>
        <Input defaultValue="Personal" />
      </Field>
    </div>
  ),
};
