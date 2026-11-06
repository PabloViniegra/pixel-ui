import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Popover } from './Popover.js';
import '@pablo-v/button/style.css';
import './popover.css';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    label: 'Deployment protection',
    trigger: <Button variant="secondary">Protection</Button>,
    children: (
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ fontWeight: 600 }}>Deployment protection</strong>
        <span style={{ color: 'var(--pxl-fg-muted)' }}>
          Preview deployments require a Vercel login. Production stays public.
        </span>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <Button size="sm">Configure</Button>
        </div>
      </div>
    ),
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <div style={{ padding: 96, display: 'grid', placeItems: 'center' }}>
      <Popover {...args} />
    </div>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlignStart: Story = { args: { align: 'start' } };
