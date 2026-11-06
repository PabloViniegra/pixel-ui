import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { PixelImage } from './PixelImage.js';
import './pixel-image.css';
import deskSketches from '../assets/desk-sketches.webp';

const meta = {
  title: 'Signature/PixelImage',
  component: PixelImage,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    src: deskSketches,
    alt: 'Pixel icon sketches of a folder and a magnifying glass on graph paper, next to a pencil and a keyboard',
    width: 1200,
    height: 720,
  },
  render: function Render(args) {
    const [key, setKey] = useState(0);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <PixelImage key={key} {...args} />
        <button type="button" onClick={() => setKey((k) => k + 1)} style={{ justifySelf: 'start' }}>
          Replay
        </button>
      </div>
    );
  },
} satisfies Meta<typeof PixelImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Slow: Story = { args: { steps: [48, 24, 12, 6, 3], stepDuration: 260 } };
