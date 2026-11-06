import { Button } from '@pixel-ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { toast } from './store.js';
import { Toaster } from './Toaster.js';
import '@pixel-ui/button/style.css';
import '@pixel-ui/pixel-icons/style.css';
import './toast.css';

const meta = {
  title: 'Overlays/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 240 }}>
      <Button
        variant="secondary"
        onClick={() => toast('Copied to clipboard', { description: 'https://acme-web.vercel.app' })}
      >
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success('Deployment ready', {
            description: 'acme-web is live in production.',
            action: { label: 'Visit', onClick: () => {} },
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning('Build cache is 92% full', { description: 'Old entries will be evicted.' })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error('Build failed', {
            description: 'Command "pnpm build" exited with 1.',
            duration: Number.POSITIVE_INFINITY,
          })
        }
      >
        Error (sticky)
      </Button>
      <Toaster {...args} />
    </div>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
