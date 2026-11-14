import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { ScrollArea } from './ScrollArea.js';
import './scroll-area.css';

const tags = Array.from({ length: 40 }, (_, i) => `v1.${40 - i}.0`);

const box = {
  border: '1px solid var(--pxl-border)',
  borderRadius: 'var(--pxl-radius-lg)',
  fontFamily: 'var(--pxl-font-mono)',
  fontSize: 'var(--pxl-text-sm)',
  color: 'var(--pxl-fg)',
} as const;

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'Releases' },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args} style={{ ...box, width: 200, height: 240 }}>
      {tags.map((tag) => (
        <div key={tag} style={{ padding: '6px 12px', borderBottom: '1px solid var(--pxl-border)' }}>
          {tag}
        </div>
      ))}
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', 'aria-label': 'Swatches' },
  render: (args) => (
    <ScrollArea {...args} style={{ ...box, width: 360 }}>
      <div style={{ display: 'flex', gap: 8, padding: 12, width: 'max-content' }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static demo cells
            key={i}
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--pxl-radius-sm)',
              background: `var(--pxl-gray-${(i % 9) + 1}00)`,
            }}
          />
        ))}
      </div>
    </ScrollArea>
  ),
};
