import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Select } from './Select.js';
import '@pablo-v/field/style.css';
import '@pablo-v/pixel-icons/style.css';
import './select.css';

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { placeholder: 'Choose a region' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <div style={{ width: 'min(280px, calc(100vw - 32px))' }}>
      <Field label="Function region" description="Closest to your database is fastest.">
        <Select {...args}>
          <option value="fra1">Frankfurt (fra1)</option>
          <option value="iad1">Washington, D.C. (iad1)</option>
          <option value="hnd1">Tokyo (hnd1)</option>
        </Select>
      </Field>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
