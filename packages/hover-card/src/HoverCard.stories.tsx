import { Avatar } from '@pablo-v/avatar';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { HoverCard } from './HoverCard.js';
import '@pablo-v/avatar/style.css';
import './hover-card.css';

const profile = (
  <div style={{ display: 'flex', gap: 'var(--pxl-space-3)' }}>
    <Avatar name="Ada Lovelace" size="lg" status="online" />
    <div style={{ display: 'grid', gap: 'var(--pxl-space-1)' }}>
      <strong>Ada Lovelace</strong>
      <span style={{ color: 'var(--pxl-fg-muted)' }}>
        Writes the first programs. Maintains the analytical engine docs.
      </span>
      <span
        style={{
          color: 'var(--pxl-fg-muted)',
          fontFamily: 'var(--pxl-font-mono)',
          fontSize: 'var(--pxl-text-xs)',
        }}
      >
        Joined 1843
      </span>
    </div>
  </div>
);

const meta = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    content: profile,
    children: (
      <a
        href="#ada"
        style={{ color: 'var(--pxl-accent-text)', fontFamily: 'var(--pxl-font-sans)' }}
      >
        @ada
      </a>
    ),
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
