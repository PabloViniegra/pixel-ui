import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { ScrambleText } from './ScrambleText.js';
import './scramble-text.css';

const meta = {
  title: 'Components/ScrambleText',
  component: ScrambleText,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { text: 'Deployment ready', duration: 1100 },
  argTypes: {
    trigger: { control: 'inline-radio', options: ['mount', 'hover', 'inView', 'manual'] },
    duration: { control: { type: 'range', min: 200, max: 3000, step: 50 } },
  },
  decorators: [
    (Story) => (
      <div style={{ fontSize: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrambleText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnMount: Story = {};

export const OnHover: Story = { args: { trigger: 'hover', text: 'Hover to decode' } };

export const Rotating: Story = {
  render: (args) => {
    const words = ['Queued', 'Building', 'Ready'];
    const [i, setI] = useState(0);
    return (
      <button
        type="button"
        onClick={() => setI((n) => (n + 1) % words.length)}
        style={{ all: 'unset', cursor: 'pointer' }}
      >
        <ScrambleText {...args} text={words[i] ?? ''} duration={600} />
      </button>
    );
  },
};

export const CustomGlyphs: Story = { args: { characters: '01', text: 'Checksum verified' } };
