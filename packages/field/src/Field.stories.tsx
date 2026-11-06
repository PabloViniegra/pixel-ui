import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithRef } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Field, useFieldControl } from './Field.js';
import '@pixel-ui/pixel-icons/style.css';
import './field.css';

function Control(props: ComponentPropsWithRef<'input'>) {
  return (
    <input
      {...useFieldControl(props)}
      style={{
        height: 40,
        padding: '0 12px',
        border: '1px solid var(--pxl-border)',
        borderRadius: 'var(--pxl-radius-md)',
        background: 'var(--pxl-bg)',
        color: 'var(--pxl-fg)',
        font: 'inherit',
      }}
    />
  );
}

const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    label: 'Project name',
    description: 'Lowercase letters, numbers and dashes.',
    children: <Control placeholder="my-app" />,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Field {...args} />
    </div>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = { args: { required: true } };

export const WithError: Story = { args: { error: 'A project with this name already exists.' } };
