import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { Clock, FlipCounter } from './FlipClock.js';
import '@pablo-v/button/style.css';
import './flip-clock.css';

const meta = {
  title: 'Signature/FlipClock',
  component: FlipCounter,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { value: 128, minDigits: 4 },
} satisfies Meta<typeof FlipCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Counter: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(128);
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <FlipCounter {...args} value={value} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 1))}>
            −1
          </Button>
          <Button variant="secondary" onClick={() => setValue((v) => v + 1)}>
            +1
          </Button>
          <Button variant="ghost" onClick={() => setValue((v) => v + 111)}>
            +111
          </Button>
        </div>
      </div>
    );
  },
};

export const LiveClock: Story = {
  name: 'Clock',
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Clock size="lg" />
      <Clock size="sm" showSeconds={false} timeZone="America/New_York" aria-label="New York" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <FlipCounter value={42} size="sm" />
      <FlipCounter value={42} size="md" />
      <FlipCounter value={42} size="lg" />
    </div>
  ),
};
