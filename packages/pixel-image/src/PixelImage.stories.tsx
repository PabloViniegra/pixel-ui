import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { PixelImage } from './PixelImage.js';
import './pixel-image.css';

/** A local gradient scene, so the story works offline and shows the mosaic well. */
const scene = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0b1a3a"/><stop offset="0.6" stop-color="#3291ff"/><stop offset="1" stop-color="#ffd7a8"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="750" fill="url(#sky)"/>
    <circle cx="860" cy="430" r="120" fill="#fff4e0"/>
    <path d="M0 560 L220 400 L380 520 L560 330 L780 560 L960 450 L1200 600 L1200 750 L0 750Z" fill="#171717"/>
    <path d="M0 640 L300 520 L520 640 L760 540 L1200 680 L1200 750 L0 750Z" fill="#0a0a0a"/>
  </svg>`,
)}`;

const meta = {
  title: 'Signature/PixelImage',
  component: PixelImage,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { src: scene, alt: 'Mountains at dusk', width: 1200, height: 750 },
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
