import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within } from 'storybook/test';
import pkg from '../package.json' with { type: 'json' };
import { toast } from './store.js';
import { Toaster } from './Toaster.js';
import '@pablo-v/button/style.css';
import '@pablo-v/pixel-icons/style.css';
import './toast.css';

const meta = {
  title: 'Feedback/Toast',
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

/** A toast with an `action` stays until dismissed, so the user has time to undo. */
export const WithAction: Story = {
  render: (args) => (
    <div style={{ minHeight: 240 }}>
      <Button
        variant="secondary"
        onClick={() =>
          toast('Project archived', {
            description: 'acme-web is hidden from the dashboard.',
            action: { label: 'Undo', onClick: () => toast.success('Project restored') },
          })
        }
      >
        Archive project
      </Button>
      <Toaster {...args} />
    </div>
  ),
};

/** `toast.error()` is announced immediately by screen readers. Pair it with a retry action. */
export const ErrorToast: Story = {
  name: 'Error',
  render: (args) => (
    <div style={{ minHeight: 240 }}>
      <Button
        variant="danger"
        onClick={() =>
          toast.error('Deployment failed', {
            description: 'Command "pnpm build" exited with 1.',
            action: { label: 'Retry', onClick: () => toast('Redeploying…') },
          })
        }
      >
        Deploy
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvas, userEvent, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Deploy' }));
    // Lets the a11y run check the list with an alert toast inside it.
    await within(canvasElement.ownerDocument.body).findByRole('alert');
  },
};

function deploy() {
  return new Promise<string>((resolve, reject) =>
    setTimeout(() => (Math.random() > 0.3 ? resolve('acme-web') : reject()), 1500),
  );
}

/** Reuse one `id` to turn a pending toast into the result of a promise. */
export const PromiseToast: Story = {
  name: 'Promise',
  render: (args) => (
    <div style={{ minHeight: 240 }}>
      <Button
        variant="secondary"
        onClick={async () => {
          const id = toast('Deploying…', { duration: Number.POSITIVE_INFINITY });
          try {
            const project = await deploy();
            toast.success('Deployment ready', { id, description: `${project} is live.` });
          } catch {
            toast.error('Deployment failed', { id, description: 'Check the build logs.' });
          }
        }}
      >
        Deploy with feedback
      </Button>
      <Toaster {...args} />
    </div>
  ),
};
