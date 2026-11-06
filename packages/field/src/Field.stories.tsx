import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithRef } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Field, useFieldControl } from './Field.js';
import '@pablo-v/pixel-icons/style.css';
import './field.css';

function Control(props: ComponentPropsWithRef<'input'>) {
  const controlProps = useFieldControl(props);
  const invalid = controlProps['aria-invalid'] && controlProps['aria-invalid'] !== 'false';
  return (
    <input
      {...controlProps}
      style={{
        boxSizing: 'border-box',
        minWidth: 0,
        height: 40,
        padding: '0 12px',
        border: `1px solid var(${invalid ? '--pxl-danger' : '--pxl-gray-600'})`,
        borderRadius: 'var(--pxl-radius-md)',
        background: 'var(--pxl-bg-subtle)',
        color: 'var(--pxl-fg)',
        outlineColor: `var(${invalid ? '--pxl-danger' : '--pxl-accent'})`,
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
    <div style={{ width: 'min(320px, calc(100vw - 32px))' }}>
      <Field {...args} />
    </div>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = { args: { required: true } };

export const WithError: Story = { args: { error: 'A project with this name already exists.' } };
