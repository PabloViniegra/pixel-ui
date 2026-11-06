import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Textarea } from './Textarea.js';
import '@pablo-v/field/style.css';
import './textarea.css';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { placeholder: 'Describe what changed in this deployment…' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Field label="Release notes" description="Markdown is supported.">
          <Story />
        </Field>
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AutoResize: Story = { args: { autoResize: true, rows: 2 } };
