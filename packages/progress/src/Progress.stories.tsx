import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Progress } from './Progress.js';
import './progress.css';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { value: 64, label: 'Build progress', showValue: true },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    segments: { control: { type: 'range', min: 4, max: 48, step: 1 } },
    tone: {
      control: 'inline-radio',
      options: ['accent', 'neutral', 'success', 'warning', 'danger'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = { args: { value: undefined } };

export const Simulated: Story = {
  render: (args) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 220);
      return () => clearInterval(id);
    }, []);
    return <Progress {...args} value={value} tone={value === 100 ? 'success' : 'accent'} />;
  },
};
