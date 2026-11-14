import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Stepper } from './Stepper.js';
import '@pablo-v/pixel-icons/style.css';
import './stepper.css';

const steps = [
  { label: 'Account', description: 'Email and password' },
  { label: 'Workspace', description: 'Name and region' },
  { label: 'Invite team', description: 'Optional' },
  { label: 'Review' },
];

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { steps, current: 1, 'aria-label': 'Setup progress' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    current: { control: { type: 'number', min: 0, max: steps.length } },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = { args: { orientation: 'vertical', current: 2 } };

export const WithError: Story = {
  args: {
    current: 2,
    steps: steps.map((s, i) => (i === 1 ? { ...s, status: 'error' as const } : s)),
  },
};

export const Navigable: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(3);
    return <Stepper {...args} current={current} onStepClick={setCurrent} />;
  },
};
