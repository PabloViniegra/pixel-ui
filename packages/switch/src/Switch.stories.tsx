import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import pkg from '../package.json' with { type: 'json' };
import { Switch } from './Switch.js';
import './switch.css';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { label: 'Preview deployments', onCheckedChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const Small: Story = { args: { size: 'sm', defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 16, fontFamily: 'var(--pxl-font-mono)' }}>
        <Switch {...args} checked={checked} onCheckedChange={setChecked} label="Analytics" />
        <code>checked = {String(checked)}</code>
      </div>
    );
  },
};
